import { getSubjectFunction, setValueRedraw } from "./Tag.utils.js";
import { ValueSubject } from "./ValueSubject.js";
import { runBeforeDestroy } from "./tagRunner.js";
import { isSubjectInstance, isTagComponent, isTagInstance } from "./isInstance.js";
import { buildClones } from "./render.js";
import { interpolateElement, interpolateString } from "./interpolateElement.js";
import { afterElmBuild } from "./interpolateTemplate.js";
import { elementDestroyCheck } from "./elementDestroyCheck.function.js";
import { updateExistingValue } from "./updateExistingValue.function.js";
export const variablePrefix = '__tagvar';
export const escapeVariable = '--' + variablePrefix + '--';
const prefixSearch = new RegExp(variablePrefix, 'g');
export const escapeSearch = new RegExp(escapeVariable, 'g');
export class ArrayValueNeverSet {
    isArrayValueNeverSet = true;
}
export class Tag {
    strings;
    values;
    isTag = true;
    clones = []; // elements on document
    cloneSubs = []; // subscriptions created by clones
    children = []; // tags on me
    tagSupport;
    // only present when a child of a tag
    ownerTag;
    insertBefore;
    appElement; // only seen on this.getAppElement().appElement
    // present only when an array. Populated by this.key()
    arrayValue = new ArrayValueNeverSet();
    constructor(strings, values) {
        this.strings = strings;
        this.values = values;
    }
    /** Used for array, such as array.map(), calls aka array.map(x => html``.key(x)) */
    key(arrayValue) {
        this.arrayValue = arrayValue;
        return this;
    }
    async destroy(options = {
        stagger: 0,
        byParent: false, // Only destroy clones of direct children
    }) {
        // the isComponent check maybe able to be removed
        const isComponent = this.tagSupport ? true : false;
        if (isComponent) {
            runBeforeDestroy(this.tagSupport, this);
        }
        this.destroySubscriptions();
        const promises = this.children.map((kid) => kid.destroy({ ...options, byParent: true }));
        if (!options.byParent) {
            options.stagger = await this.destroyClones(options);
        }
        if (this.ownerTag) {
            this.ownerTag.children = this.ownerTag.children.filter(child => child !== this);
        }
        await Promise.all(promises);
        return options.stagger;
    }
    destroySubscriptions() {
        this.cloneSubs.forEach(cloneSub => cloneSub.unsubscribe());
        this.cloneSubs.length = 0;
    }
    async destroyClones({ stagger } = {
        stagger: 0,
    }) {
        const promises = this.clones.reverse().map((clone, index) => {
            let promise = Promise.resolve();
            if (clone.ondestroy) {
                promise = elementDestroyCheck(clone, stagger);
            }
            promise.then(() => {
                clone.parentNode?.removeChild(clone);
                const ownerTag = this.ownerTag;
                if (ownerTag) {
                    // Sometimes my clones were first registered to my owner, remove them
                    ownerTag.clones = ownerTag.clones.filter(compareClone => compareClone !== clone);
                }
            });
            return promise;
        });
        await Promise.all(promises);
        // this.clones.length = 0
        return stagger;
    }
    updateByTag(tag) {
        this.updateConfig(tag.strings, tag.values);
        this.tagSupport.templater = tag.tagSupport.templater;
    }
    lastTemplateString = undefined; // used to compare templates for updates
    /** A method of passing down the same render method */
    setSupport(tagSupport) {
        this.tagSupport = tagSupport;
        this.tagSupport.mutatingRender = tagSupport.mutatingRender;
    }
    updateConfig(strings, values) {
        this.strings = strings;
        this.updateValues(values);
    }
    getTemplate() {
        const string = this.strings.map((string, index) => {
            const safeString = string.replace(prefixSearch, escapeVariable);
            const endString = safeString + (this.values.length > index ? `{${variablePrefix}${index}}` : '');
            // const trimString = index === 0 || index === this.strings.length-1 ? endString.trim() : endString
            const trimString = endString.replace(/>\s*/g, '>').replace(/\s*</g, '<');
            return trimString;
        }).join('');
        const interpolation = interpolateString(string);
        this.lastTemplateString = interpolation.string;
        return {
            interpolation,
            // string,
            string: interpolation.string,
            strings: this.strings,
            values: this.values,
            context: this.tagSupport?.memory.context || {},
        };
    }
    isLikeTag(tag) {
        const { string } = tag.getTemplate();
        const stringMatched = string === this.lastTemplateString;
        if (!stringMatched || tag.values.length !== this.values.length) {
            return false;
        }
        const allVarsMatch = tag.values.every((value, index) => {
            const compareTo = this.values[index];
            const isFunctions = value instanceof Function && compareTo instanceof Function;
            if (isFunctions) {
                const stringMatch = value.toString() === compareTo.toString();
                if (stringMatch) {
                    return true;
                }
                return false;
            }
            const tag = value;
            if (isTagInstance(tag) && isTagInstance(compareTo)) {
                // TODO: THis "is" is setting data, this is not good
                console.log('🎃');
                tag.ownerTag = this; // let children know I own them
                this.children.push(tag); // record children I created        
                tag.lastTemplateString || tag.getTemplate().string; // ensure last template string is generated
                if (tag.isLikeTag(compareTo)) {
                    return true;
                }
                return false;
            }
            return true;
        });
        if (allVarsMatch) {
            return true;
        }
        return false;
    }
    update() {
        return this.updateContext(this.tagSupport.memory.context);
    }
    updateValues(values) {
        this.values = values;
        return this.updateContext(this.tagSupport.memory.context);
    }
    updateContext(context) {
        this.strings.map((_string, index) => {
            const variableName = variablePrefix + index;
            const hasValue = this.values.length > index;
            const value = this.values[index];
            // is something already there?
            const existing = context[variableName];
            if (existing) {
                return updateExistingValue(existing, value, this);
            }
            // 🆕 First time values below
            processNewValue(hasValue, value, context, variableName, this);
        });
        return context;
    }
    getAppElement() {
        let tag = this;
        while (tag.ownerTag) {
            tag = tag.ownerTag;
        }
        return tag;
    }
    /** Used during HMR only where static content itself could have been edited */
    rebuild() {
        const insertBefore = this.insertBefore;
        if (!insertBefore) {
            const err = new Error('Cannot rebuild. Previous insertBefore element is not defined on tag');
            err.tag = this;
            throw err;
        }
        this.buildBeforeElement(insertBefore, {
            forceElement: true,
            counts: { added: 0, removed: 0 },
        });
    }
    buildBeforeElement(insertBefore, options = {
        forceElement: false,
        counts: { added: 0, removed: 0 },
    }) {
        this.insertBefore = insertBefore;
        const context = this.update();
        const template = this.getTemplate();
        // const ownerTag = this.ownerTag
        const temporary = document.createElement('div');
        temporary.id = 'tag-temp-holder';
        // render content with a first child that we can know is our first element
        temporary.innerHTML = `<template tag-wrap="22">${template.string}</template>`;
        // const clonesBefore = this.clones.map(clone => clone)
        const intClones = interpolateElement(temporary, context, template, this, // this.ownerTag || this,
        { forceElement: options.forceElement });
        this.clones.length = 0;
        const clones = buildClones(temporary, insertBefore);
        this.clones.push(...clones);
        if (intClones.length) {
            this.clones = this.clones.filter(cloneFilter => !intClones.find(clone => clone === cloneFilter));
        }
        this.clones.forEach(clone => afterElmBuild(clone, options));
        return this.clones;
    }
}
export function processNewValue(hasValue, value, context, variableName, tag) {
    if (isTagComponent(value)) {
        const existing = context[variableName] = new ValueSubject(value);
        setValueRedraw(value, existing, tag);
        return;
    }
    if (value instanceof Function) {
        context[variableName] = getSubjectFunction(value, tag);
        return;
    }
    if (!hasValue) {
        return; // more strings than values, stop here
    }
    if (isTagInstance(value)) {
        value.ownerTag = tag;
        tag.children.push(value);
        context[variableName] = new ValueSubject(value);
        return;
    }
    if (isSubjectInstance(value)) {
        context[variableName] = value;
        return;
    }
    context[variableName] = new ValueSubject(value);
}
//# sourceMappingURL=Tag.class.js.map