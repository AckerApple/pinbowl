import { bindSubjectFunction, elementDestroyCheck, getSubjectFunction, setValueRedraw } from "./Tag.utils.js";
import { getTagSupport } from "./getTagSupport.js";
import { isTagComponent } from "./interpolateTemplate.js";
import { ValueSubject } from "./ValueSubject.js";
import { deepEqual } from "./deepFunctions.js";
import { runAfterRender, runBeforeRedraw, runBeforeRender } from "./tagRunner.js";
export const variablePrefix = '__tagVar';
export const escapeVariable = '--' + variablePrefix + '--';
const prefixSearch = new RegExp(variablePrefix, 'g');
export const escapeSearch = new RegExp(escapeVariable, 'g');
export class Tag {
    strings;
    values;
    context = {}; // populated after reading interpolated.values array converted to an object {variable0, variable:1}
    clones = []; // elements on document
    cloneSubs = []; // subscriptions created by clones
    children = []; // tags on me
    tagSupport;
    // only present when a child of a tag
    ownerTag;
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
    /** Used for array, such as array.map(), calls aka array.map(x => html``.key(x)) */
    key(arrayValue) {
        this.arrayValue = arrayValue;
        return this;
    }
    destroy(stagger = 0, byParent = false) {
        this.children.forEach((kid, index) => kid.destroy(0, true));
        this.destroySubscriptions();
        if (!byParent) {
            stagger = this.destroyClones(stagger);
        }
        return stagger;
    }
    destroySubscriptions() {
        this.cloneSubs.forEach(cloneSub => cloneSub.unsubscribe());
        this.cloneSubs.length = 0;
    }
    destroyClones(stagger = 0) {
        this.clones.reverse().forEach((clone, index) => {
            let promise = Promise.resolve();
            if (clone.ondestroy) {
                promise = elementDestroyCheck(clone, stagger);
            }
            promise.then(() => clone.parentNode.removeChild(clone));
        });
        this.clones.length = 0;
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
            return endString;
        }).join('');
        return { string, strings: this.strings, values: this.values, context: this.context };
    }
    isLikeTag(tag) {
        if (tag.lastTemplateString !== this.lastTemplateString) {
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
            if (value instanceof Tag && compareTo instanceof Tag) {
                value.ownerTag = this; // let children know I own them
                this.children.push(value); // record children I created        
                value.lastTemplateString || value.getTemplate().string; // ensure last template string is generated
                if (value.isLikeTag(compareTo)) {
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
        return this.updateContext(this.context);
    }
    updateValues(values) {
        this.values = values;
        return this.updateContext(this.context);
    }
    updateContext(context) {
        this.strings.map((_string, index) => {
            const variableName = variablePrefix + index;
            const hasValue = this.values.length > index;
            const value = this.values[index];
            // is something already there?
            const existing = context[variableName];
            if (existing) {
                /** @type {Tag | undefined} */
                const ogTag = existing.value?.tag;
                // handle already seen tag components
                if (isTagComponent(value)) {
                    const latestProps = value.cloneProps;
                    const existingTag = existing.tag;
                    // previously was something else, now a tag component
                    if (!existing.tag) {
                        setValueRedraw(value, existing, this);
                        value.redraw(latestProps);
                        return;
                    }
                    const oldTagSetup = existingTag.tagSupport;
                    const tagSupport = value.tagSupport || oldTagSetup || getTagSupport(value);
                    const oldCloneProps = tagSupport.templater?.cloneProps;
                    const oldProps = tagSupport.templater?.props;
                    if (existingTag) {
                        const isCommonEqual = oldProps === undefined && oldProps === latestProps;
                        const equal = isCommonEqual || deepEqual(oldCloneProps, latestProps);
                        if (equal) {
                            return;
                        }
                    }
                    setValueRedraw(value, existing, this);
                    oldTagSetup.templater = value;
                    existing.value.tag = oldTagSetup.newest = value.redraw(latestProps);
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
                    existing.set(value);
                    return;
                }
                // now its a function
                if (value instanceof Function) {
                    existing.set(bindSubjectFunction(value, this));
                    return;
                }
                existing.set(value); // let ValueSubject now of newest value
                return;
            }
            // First time values below
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
            if (value instanceof Tag) {
                value.ownerTag = this;
                this.children.push(value);
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
}
//# sourceMappingURL=Tag.class.js.map