import { ValueSubject } from '../../subject/ValueSubject.js';
import { ArrayNoKeyError } from '../../errors.js';
import { destroyArrayTag } from '../checkDestroyPrevious.function.js';
import { newTagSupportByTemplater, setupNewSupport, tagFakeTemplater } from './processTag.function.js';
import { TagSupport } from '../TagSupport.class.js';
import { isTagClass } from '../../isInstance.js';
import { renderTagOnly } from '../render/renderTagOnly.function.js';
export function processTagArray(subject, value, // arry of Tag classes
insertBefore, // <template end interpolate />
ownerSupport, options) {
    const clones = ownerSupport.global.clones; // []
    let lastArray = subject.lastArray = subject.lastArray || [];
    if (!subject.placeholder) {
        setPlaceholderElm(insertBefore, subject);
    }
    const runtimeInsertBefore = subject.placeholder; // || insertBefore
    let removed = 0;
    /** 🗑️ remove previous items first */
    lastArray = subject.lastArray = subject.lastArray.filter((item, index) => {
        const newLength = value.length - 1;
        const at = index - removed;
        const lessLength = newLength < at;
        if (lessLength) {
            destroyArrayItem(lastArray, index, options);
            ++removed;
            return false;
        }
        const subTag = value[index - removed];
        const tagClass = isTagClass(subTag);
        let tag = subTag;
        let templater = subTag.templater;
        let prevArrayValue;
        if (tagClass) {
            prevArrayValue = tag.memory.arrayValue;
        }
        else {
            templater = subTag;
            tag = templater.tag;
            prevArrayValue = templater.arrayValue;
        }
        // const tag = subTag?.templater.tag as Tag
        const lastTag = item.tagSupport.templater.tag;
        const lastArrayValue = lastTag.memory.arrayValue;
        const destroyItem = !areLikeValues(prevArrayValue, lastArrayValue);
        if (destroyItem) {
            destroyArrayItem(lastArray, index, options);
            ++removed;
            return false;
        }
        return true;
    });
    const length = value.length;
    for (let index = 0; index < length; ++index) {
        const item = value[index];
        const previous = lastArray[index];
        const previousSupport = previous?.tagSupport;
        const subTag = item;
        const tagClass = isTagClass(subTag);
        const itemSubject = new ValueSubject(undefined);
        let templater = subTag.templater;
        let tagSupport;
        if (tagClass) {
            if (!templater) {
                templater = tagFakeTemplater(subTag);
            }
            tagSupport = new TagSupport(templater, ownerSupport, itemSubject);
        }
        else {
            templater = subTag;
            tagSupport = setupNewTemplater(templater, ownerSupport, itemSubject);
        }
        // share global between old and new
        if (previousSupport) {
            setupNewSupport(tagSupport, ownerSupport, previousSupport.subject);
            const global = previousSupport.global;
            tagSupport.global = global;
            global.newest = tagSupport;
        }
        // check for html``.key()
        const tag = templater.tag || subTag;
        const keySet = 'arrayValue' in tag.memory;
        if (!keySet) {
            const details = {
                template: tagSupport.getTemplate().string,
                array: value,
            };
            const message = 'Use html`...`.key(item) instead of html`...` to template an Array';
            console.error(message, details);
            const err = new ArrayNoKeyError(message, details);
            throw err;
        }
        const couldBeSame = lastArray.length > index;
        if (couldBeSame) {
            const prevSupport = previous.tagSupport;
            const prevGlobal = prevSupport.global;
            const oldest = prevGlobal.oldest;
            oldest.updateBy(tagSupport);
            continue;
        }
        processAddTagArrayItem(runtimeInsertBefore, tagSupport, index, options, lastArray);
        ownerSupport.global.childTags.push(tagSupport);
    }
    return clones;
}
function setPlaceholderElm(insertBefore, subject) {
    if (insertBefore.nodeName !== 'TEMPLATE') {
        subject.placeholder = insertBefore;
        return;
    }
    const placeholder = subject.placeholder = document.createTextNode('');
    const parentNode = insertBefore.parentNode;
    parentNode.insertBefore(placeholder, insertBefore);
    parentNode.removeChild(insertBefore);
}
function processAddTagArrayItem(before, tagSupport, index, options, lastArray) {
    const lastValue = {
        tagSupport, index
    };
    // Added to previous array
    lastArray.push(lastValue);
    const counts = {
        added: options.counts.added + index,
        removed: options.counts.removed,
    };
    const fragment = document.createDocumentFragment();
    const newTempElm = document.createElement('template');
    fragment.appendChild(newTempElm);
    tagSupport.buildBeforeElement(newTempElm, // before,
    { counts });
    const parent = before.parentNode;
    parent.insertBefore(fragment, before);
}
/** compare two values. If both values are arrays then the items will be compared */
function areLikeValues(valueA, valueB) {
    if (valueA === valueB) {
        return true;
    }
    const bothArrays = valueA instanceof Array && valueB instanceof Array;
    const matchLengths = bothArrays && valueA.length == valueB.length;
    if (matchLengths) {
        return valueA.every((item, index) => item == valueB[index]);
    }
    return false;
}
function setupNewTemplater(templater, ownerSupport, itemSubject) {
    const tagSupport = newTagSupportByTemplater(templater, ownerSupport, itemSubject);
    renderTagOnly(tagSupport, tagSupport, itemSubject, ownerSupport);
    return tagSupport;
}
function destroyArrayItem(lastArray, index, options) {
    const last = lastArray[index];
    const tagSupport = last.tagSupport;
    destroyArrayTag(tagSupport, options.counts);
    last.deleted = true;
    ++options.counts.removed;
}
//# sourceMappingURL=processTagArray.js.map