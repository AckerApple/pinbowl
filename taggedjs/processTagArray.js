import { processTagResult } from "./interpolateTemplate.js";
export function processTagArray(result, value, // arry of Tag classes
template, // <template end interpolate />
ownerTag, counts) {
    result.lastArray = result.lastArray || []; // {tag, index}[] populated in processTagResult
    let removed = 0;
    /** 🗑️ remove previous items first */
    result.lastArray = result.lastArray.filter((item, index) => {
        const lessLength = value.length - 1 < index - removed;
        const subTag = value[index - removed];
        const subArrayValue = subTag?.arrayValue;
        if (lessLength || subArrayValue !== item.tag.arrayValue) {
            const last = result.lastArray[index];
            const tag = last.tag;
            tag.destroy(counts.removed, false);
            ++removed;
            ++counts.removed;
            return false;
        }
        return true;
    });
    value.forEach((subTag, index) => {
        subTag.tagSupport = ownerTag.tagSupport;
        subTag.ownerTag = ownerTag;
        ownerTag.children.push(subTag);
        if (subTag.arrayValue === undefined) {
            // appears arrayValue is not there but maybe arrayValue is actually the value of undefined
            if (!Object.keys(subTag).includes('arrayValue')) {
                const err = new Error('Use html`...`.key(item) instead of html`...` to template an Array');
                err.code = 'add-array-key';
                throw err;
            }
        }
        const previous = result.lastArray[index];
        if (previous) {
            if (previous.tag.arrayValue === subTag.arrayValue) {
                previous.tag.updateValues(subTag.values);
            }
            return;
        }
        const before = template || template.clone;
        processTagResult(subTag, result, before, {
            index,
            counts,
        });
    });
    return;
}
//# sourceMappingURL=processTagArray.js.map