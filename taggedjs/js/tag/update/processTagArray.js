import { ValueSubject } from '../../subject/ValueSubject';
import { ArrayNoKeyError } from '../../errors';
import { destroyArrayTag } from '../checkDestroyPrevious.function';
import { setupNewTemplater, tagFakeTemplater } from './processTag.function';
import { TagSupport } from '../TagSupport.class';
import { isTagClass } from '../../isInstance';
export function processTagArray(subject, value, // arry of Tag classes
insertBefore, // <template end interpolate />
ownerSupport, options) {
    const clones = ownerSupport.clones; // []
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
        const subValue = value[index - removed];
        const subTag = subValue;
        // const tag = subTag?.templater.tag as Tag
        const lastTag = item.tagSupport.templater.tag;
        const newArrayValue = subTag?.memory.arrayValue;
        const lastArrayValue = lastTag.memory.arrayValue;
        const destroyItem = lessLength || !areLikeValues(newArrayValue, lastArrayValue);
        if (destroyItem) {
            const last = lastArray[index];
            const tagSupport = last.tagSupport;
            destroyArrayTag(tagSupport, options.counts);
            last.deleted = true;
            ++removed;
            ++options.counts.removed;
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
        if (isTagClass(subTag) && !subTag.templater) {
            tagFakeTemplater(subTag);
        }
        const tagSupport = new TagSupport(subTag.templater, ownerSupport, new ValueSubject(undefined));
        if (previousSupport) {
            setupNewTemplater(tagSupport, ownerSupport, previousSupport.subject);
            const global = previousSupport.global;
            tagSupport.global = global;
            global.newest = tagSupport;
        }
        // check for html``.key()
        const keySet = 'arrayValue' in subTag.memory;
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
            // subTag.tagSupport = subTag.tagSupport || prevSupport
            const oldest = prevGlobal.oldest;
            oldest.updateBy(tagSupport);
            // return []
            continue;
        }
        processAddTagArrayItem(runtimeInsertBefore, tagSupport, index, options, lastArray);
        ownerSupport.childTags.push(tagSupport);
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
//# sourceMappingURL=processTagArray.js.map