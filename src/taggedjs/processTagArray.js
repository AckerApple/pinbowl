import { ValueSubject } from "./ValueSubject.js";
import { TagSupport } from "./TagSupport.class.js";
import { processTagResult } from "./processTagResult.function.js";
import { ArrayNoKeyError } from "./errors.js";
export function processTagArray(result, value, // arry of Tag classes
template, // <template end interpolate />
ownerTag, options) {
    const clones = [];
    result.lastArray = result.lastArray || []; // {tag, index}[] populated in processTagResult
    result.template = template;
    let removed = 0;
    /** 🗑️ remove previous items first */
    result.lastArray = result.lastArray.filter((item, index) => {
        const newLength = value.length - 1;
        const at = index - removed;
        const lessLength = newLength < at;
        const subTag = value[index - removed];
        const subArrayValue = subTag?.arrayValue;
        const destroyItem = lessLength || !areLikeValues(subArrayValue, item.tag.arrayValue);
        if (destroyItem) {
            const last = result.lastArray[index];
            const tag = last.tag;
            tag.destroy({
                stagger: options.counts.removed,
                byParent: false
            });
            ++removed;
            ++options.counts.removed;
            return false;
        }
        return true;
    });
    // const masterBefore = template || (template as any).clone
    const before = template || template.clone;
    value.forEach((subTag, index) => {
        subTag.tagSupport = new TagSupport({}, new ValueSubject([]));
        subTag.tagSupport.mutatingRender = () => {
            ownerTag.tagSupport.render();
            // subTag.tagSupport.render()
            return subTag;
        }; // fake having a render function
        subTag.ownerTag = ownerTag;
        ownerTag.children.push(subTag);
        // check for html``.key()
        const keyNotSet = subTag.arrayValue;
        if (keyNotSet?.isArrayValueNeverSet) {
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
        if (result.lastArray.length > index) {
            const previous = result.lastArray[index];
            const isSame = areLikeValues(previous.tag.arrayValue, subTag.arrayValue);
            if (isSame) {
                previous.tag.updateValues(subTag.values);
                // previous.tag.updateByTag(subTag)
            }
            /*
            previous.tag.destroy()
            ++removed
            ++options.counts.removed
            */
            return [];
        }
        const nextClones = processTagResult(subTag, result, before, {
            index,
            ...options,
            counts: {
                added: options.counts.added + index,
                removed: options.counts.removed,
            }
        });
        clones.push(...nextClones);
    });
    return clones;
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