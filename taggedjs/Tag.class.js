import { bindSubjectFunction, elementDestroyCheck, getSubjectFunction, setValueRedraw } from "./Tag.utils.js";
import { getTagSupport } from "./getTagSupport.js";
import { ValueSubject } from "./ValueSubject.js";
import { deepEqual } from "./deepFunctions.js";
import { runAfterRender, runAfterTagClone, runBeforeDestroy, runBeforeRedraw, runBeforeRender } from "./tagRunner.js";
import { isSubjectInstance, isTagComponent, isTagInstance } from "./isInstance.js";
import { buildClones } from "./render.js";
import { interpolateElement } from "./interpolateElement.js";
import { afterElmBuild } from "./interpolateTemplate.js";
export const variablePrefix = '__tagVar';
export const escapeVariable = '--' + variablePrefix + '--';
const prefixSearch = new RegExp(variablePrefix, 'g');
export const escapeSearch = new RegExp(escapeVariable, 'g');
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
    arrayValue;
    constructor(strings, values) {
        this.strings = strings;
        this.values = values;
    }
    providers = [];
    beforeRedraw() {
        runBeforeRedraw(this.tagSupport, this);
    }
    afterRender() {
        runAfterRender(this.tagSupport, this);
    }
    afterClone(newTag) {
        runAfterTagClone(this, newTag);
    }
    /** Used for array, such as array.map(), calls aka array.map(x => html``.key(x)) */
    key(arrayValue) {
        this.arrayValue = arrayValue;
        return this;
    }
    async destroy(options = {
        stagger: 0,
        byParent: false, // who's destroying me? if byParent, ignore possible animations
    }) {
        runBeforeDestroy(this.tagSupport, this);
        this.destroySubscriptions();
        const promises = this.children.map((kid) => kid.destroy({ ...options, byParent: true }));
        options.stagger = await this.destroyClones(options);
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
                    ownerTag.clones = ownerTag.clones.filter(compareClone => {
                        if (compareClone === clone) {
                            console.error('my clone found in a parent - 1', {
                                compareClone, clone,
                                tag: this.tagSupport.templater?.wrapper.original,
                                ownerTag: ownerTag.tagSupport.templater?.wrapper.original,
                            });
                            // throw new Error('issue')
                            return false;
                        }
                        return true;
                    });
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
        this.tagSupport = this.tagSupport || tagSupport;
        this.tagSupport.mutatingRender = this.tagSupport.mutatingRender || tagSupport.mutatingRender;
        this.children.forEach(kid => kid.setSupport(tagSupport));
    }
    updateConfig(strings, values) {
        this.strings = strings;
        this.updateValues(values);
    }
    getTemplate() {
        // TODO: treat interpolation hack here
        const string = this.lastTemplateString = this.strings.map((string, index) => {
            const safeString = string.replace(prefixSearch, escapeVariable);
            const endString = safeString + (this.values.length > index ? `{${variablePrefix}${index}}` : '');
            // const trimString = index === 0 || index === this.strings.length-1 ? endString.trim() : endString
            const trimString = endString.replace(/>\s*/g, '>').replace(/\s*</g, '<');
            return trimString;
        }).join('');
        return {
            string,
            strings: this.strings,
            values: this.values,
            context: this.tagSupport?.memory.context || {},
        };
    }
    isLikeTag(tag) {
        const { string } = tag.getTemplate();
        if (string !== this.lastTemplateString) {
            return false;
        }
        if (tag.values.length !== this.values.length) {
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
            if (isTagComponent(value)) {
                const existing = context[variableName] = new ValueSubject(value);
                setValueRedraw(value, existing, this);
                return;
            }
            if (value instanceof Function) {
                context[variableName] = getSubjectFunction(value, this);
                return;
            }
            if (!hasValue) {
                return; // more strings than values, stop here
            }
            if (isTagInstance(value)) {
                value.ownerTag = this;
                this.children.push(value);
            }
            if (isSubjectInstance(value)) {
                context[variableName] = value;
                return;
            }
            context[variableName] = new ValueSubject(value);
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
        // redrawTag(this, this.tagSupport.templater as TemplaterResult, this.ownerTag)
        this.buildBeforeElement(insertBefore, {
            forceElement: true,
            counts: { added: 0, removed: 0 },
            depth: this.tagSupport.depth,
        });
    }
    buildBeforeElement(insertBefore, options = {
        forceElement: false,
        counts: { added: 0, removed: 0 },
        depth: 0,
    }) {
        this.insertBefore = insertBefore;
        const context = this.update();
        const template = this.getTemplate();
        const ownerTag = this.ownerTag;
        const temporary = document.createElement('div');
        temporary.id = 'tag-temp-holder';
        // render content with a first child that we can know is our first element
        temporary.innerHTML = '<div id="top-element-insert-after"></div>' + template.string;
        if (ownerTag) {
            // Sometimes my clones were first registered to my owner, remove them
            // this.ownerTag.clones = this.ownerTag.clones.filter(compareClone =>
            //   !this.clones.find(myClone => compareClone === myClone)
            // )
            ownerTag.clones = ownerTag.clones.filter(compareClone => {
                const match = this.clones.find(myClone => compareClone === myClone);
                if (match) {
                    console.error('found clone in parents clones', { match, compareClone });
                    throw new Error('found clone in parents clones');
                    this.clones.push(compareClone);
                    // ownerTag.clones = ownerTag.clones.filter(clone => compareClone !== clone)
                    return false;
                }
                return true;
            });
        }
        // const preClones = buildClones(temporary, insertBefore)
        // temporary.innerHTML = '<div id="top-element-insert-after"></div>'
        // const clonesBefore = this.clones.map(clone => clone)
        const intClones = interpolateElement(temporary, context, this, // this.ownerTag || this,
        { forceElement: options.forceElement, depth: options.depth });
        /*
        // this.destroyClones()
        */
        this.clones.length = 0;
        const clones = buildClones(temporary, insertBefore);
        this.clones.push(...clones);
        // this.clones.push( ...preClones )
        if (intClones.length) {
            this.clones = this.clones.filter(cloneFilter => !intClones.find(clone => clone === cloneFilter));
        }
        if (ownerTag) {
            // Sometimes my clones were first registered to my owner, remove them
            // this.ownerTag.clones = this.ownerTag.clones.filter(compareClone =>
            //   !this.clones.find(myClone => compareClone === myClone)
            // )
            ownerTag.clones = ownerTag.clones.filter(compareClone => {
                const match = this.clones.find(myClone => compareClone === myClone);
                if (match) {
                    console.error('found clone in parents clones', { match, compareClone });
                    throw new Error('found clone in parents clones');
                    this.clones.push(compareClone);
                    // ownerTag.clones = ownerTag.clones.filter(clone => compareClone !== clone)
                    return false;
                }
                return true;
            });
        }
        this.clones.forEach(clone => afterElmBuild(clone, options));
        return this.clones;
    }
}
function updateExistingValue(existing, value, tag) {
    /** @type {Tag | undefined} */
    const ogTag = existing.value?.tag;
    const tempResult = value;
    const existingSubject = existing;
    // handle already seen tag components
    if (isTagComponent(tempResult)) {
        const latestProps = tempResult.cloneProps;
        const existingTag = existingSubject.tag;
        // previously was something else, now a tag component
        if (!existingSubject.tag) {
            setValueRedraw(tempResult, existingSubject, tag);
            tempResult.redraw();
            return;
        }
        const oldTagSetup = existingTag.tagSupport;
        // TODO: The first argument can most likely be delete `tempResult.tagSupport`
        const tagSupport = tempResult.tagSupport || oldTagSetup || getTagSupport(tag.tagSupport.depth, tempResult);
        const oldCloneProps = tagSupport.templater?.cloneProps;
        const oldProps = tagSupport.templater?.props;
        if (existingTag) {
            const isCommonEqual = oldProps === undefined && oldProps === latestProps;
            const equal = isCommonEqual || deepEqual(oldCloneProps, latestProps);
            if (equal) {
                return;
            }
        }
        setValueRedraw(tempResult, existingSubject, tag);
        oldTagSetup.templater = tempResult;
        existingSubject.value.tag = oldTagSetup.newest = tempResult.redraw();
        return;
    }
    // handle already seen tags
    if (ogTag) {
        const tagSupport = ogTag.tagSupport;
        const templater = value;
        runBeforeRender(tagSupport, ogTag);
        tagSupport.oldest.beforeRedraw();
        const retag = templater.wrapper();
        retag.tagSupport = tagSupport;
        templater.newest = retag;
        tagSupport.oldest.afterRender();
        ogTag.updateByTag(retag);
        existingSubject.set(value);
        return;
    }
    // now its a function
    if (value instanceof Function) {
        existingSubject.set(bindSubjectFunction(value, tag));
        return;
    }
    if (isSubjectInstance(value)) {
        existingSubject.set(value.value); // let ValueSubject now of newest value
        return;
    }
    existingSubject.set(value); // let ValueSubject now of newest value
    return;
}
//# sourceMappingURL=Tag.class.js.map