import { ValueSubject } from './subject/ValueSubject';
import { ArrayNoKeyError } from './errors';
import { destroyArrayTag } from './checkDestroyPrevious.function';
import { applyFakeTemplater } from './processTag.function';
export function processTagArray(subject, value, // arry of Tag classes
insertBefore, // <template end interpolate />
ownerTag, options) {
    const clones = ownerTag.clones; // []
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
        const subTag = value[index - removed];
        const subArrayValue = subTag?.memory.arrayValue;
        const tag = item.tag;
        const destroyItem = lessLength || !areLikeValues(subArrayValue, tag.memory.arrayValue);
        if (destroyItem) {
            const last = lastArray[index];
            const tag = last.tag;
            destroyArrayTag(tag, options.counts);
            last.deleted = true;
            ++removed;
            ++options.counts.removed;
            return false;
        }
        return true;
    });
    value.forEach((subTag, index) => {
        const previous = lastArray[index];
        const previousSupport = previous?.tag.tagSupport;
        const fakeSubject = new ValueSubject({});
        applyFakeTemplater(subTag, ownerTag, fakeSubject);
        if (previousSupport) {
            subTag.tagSupport.templater.global = previousSupport.templater.global;
            previousSupport.templater.global.newest = subTag;
        }
        // check for html``.key()
        const keySet = 'arrayValue' in subTag.memory;
        if (!keySet) {
            const details = {
                template: subTag.getTemplate().string,
                array: value,
                ownerTagContent: ownerTag.lastTemplateString,
            };
            const message = 'Use html`...`.key(item) instead of html`...` to template an Array';
            console.error(message, details);
            const err = new ArrayNoKeyError(message, details);
            throw err;
        }
        const couldBeSame = lastArray.length > index;
        if (couldBeSame) {
            const prevSupport = previous.tag.tagSupport;
            const prevGlobal = prevSupport.templater.global;
            const isSame = areLikeValues(previous.tag.memory.arrayValue, subTag.memory.arrayValue);
            if (isSame) {
                subTag.tagSupport = subTag.tagSupport || prevSupport;
                const oldest = prevGlobal.oldest;
                oldest.updateByTag(subTag);
                return [];
            }
            // TODO: should not get here?
            processAddTagArrayItem(runtimeInsertBefore, subTag, index, options, lastArray);
            throw new Error('item should be back');
            // return [] // removed: item should have been previously deleted and will be added back
        }
        processAddTagArrayItem(runtimeInsertBefore, subTag, index, options, lastArray);
        ownerTag.childTags.push(subTag);
    });
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
function processAddTagArrayItem(before, subTag, index, options, lastArray) {
    const lastValue = {
        tag: subTag, index
    };
    // Added to previous array
    lastArray.push(lastValue);
    const counts = {
        added: options.counts.added + index,
        removed: options.counts.removed,
    };
    if (!before.parentNode) {
        throw new Error('issue adding array item');
    }
    const newTempElm = document.createElement('template');
    before.parentNode.insertBefore(newTempElm, before);
    subTag.buildBeforeElement(newTempElm, // before,
    { counts, forceElement: options.forceElement });
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