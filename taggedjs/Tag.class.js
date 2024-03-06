import { runBeforeDestroy } from "./tagRunner.js";
import { buildClones } from "./render.js";
import { interpolateElement, interpolateString } from "./interpolateElement.js";
import { afterElmBuild } from "./interpolateTemplate.js";
import { elementDestroyCheck } from "./elementDestroyCheck.function.js";
import { updateExistingValue } from "./updateExistingValue.function.js";
import { processNewValue } from "./processNewValue.function.js";
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
    clones = []; // elements on document. Needed at destroy process to know what to destroy
    cloneSubs = []; // subscriptions created by clones
    children = []; // tags on me
    tagSupport;
    // only present when a child of a tag
    ownerTag;
    // insertBefore?: Element
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
        this.children.length = 0;
        if (this.ownerTag) {
            this.ownerTag.children = this.ownerTag.children.filter(child => child !== this);
        }
        if (!options.byParent) {
            options.stagger = await this.destroyClones(options);
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
        let hasPromise = false;
        const promises = this.clones.reverse().map((clone, index) => {
            let promise;
            if (clone.ondestroy) {
                promise = elementDestroyCheck(clone, stagger);
            }
            const next = () => {
                clone.parentNode?.removeChild(clone);
                const ownerTag = this.ownerTag;
                if (ownerTag) {
                    // Sometimes my clones were first registered to my owner, remove them
                    ownerTag.clones = ownerTag.clones.filter(compareClone => compareClone !== clone);
                }
            };
            if (promise instanceof Promise) {
                hasPromise = true;
                promise.then(next);
            }
            else {
                next();
            }
            return promise;
        });
        this.clones.length = 0; // tag maybe used for something else
        if (hasPromise) {
            await Promise.all(promises);
        }
        return stagger;
    }
    updateByTag(tag) {
        this.updateConfig(tag.strings, tag.values);
        this.tagSupport.templater = tag.tagSupport.templater;
        this.tagSupport.propsConfig = { ...tag.tagSupport.propsConfig };
        this.tagSupport.newest = tag;
    }
    lastTemplateString = undefined; // used to compare templates for updates
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
        // TODO: most likely remove?
        if (!this.lastTemplateString) {
            throw new Error('no template here');
        }
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
        // const seenContext: string[] = []
        this.strings.map((_string, index) => {
            const variableName = variablePrefix + index;
            const hasValue = this.values.length > index;
            const value = this.values[index];
            // is something already there?
            const existing = variableName in context;
            // seenContext.push(variableName)
            if (existing) {
                const existing = context[variableName];
                return updateExistingValue(existing, value, this);
            }
            // 🆕 First time values below
            processNewValue(hasValue, value, context, variableName, this);
        });
        /*
        // Support reduction in context
        Object.entries(context).forEach(([key, subject]) => {
          if(seenContext.includes(key)) {
            return
          }
          const destroyed = checkDestroyPrevious(subject, undefined as any)
        })
        */
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
        // const insertBefore = this.insertBefore
        const insertBefore = this.tagSupport.templater.insertBefore;
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
        // this.insertBefore = insertBefore
        this.tagSupport.templater.insertBefore = insertBefore;
        const context = this.update();
        const template = this.getTemplate();
        const temporary = document.createElement('div');
        temporary.id = 'tag-temp-holder';
        // render content with a first child that we can know is our first element
        temporary.innerHTML = `<template id="temp-template-tag-wrap">${template.string}</template>`;
        // const clonesBefore = this.clones.map(clone => clone)
        const intClones = interpolateElement(temporary, context, template, this, // this.ownerTag || this,
        {
            forceElement: options.forceElement,
            counts: options.counts
        });
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
//# sourceMappingURL=Tag.class.js.map