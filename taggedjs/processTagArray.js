import { getTagSupport } from "./getTagSupport.js";
import { processTagResult } from "./processTagResult.function.js";
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
        const destroyItem = lessLength || subArrayValue !== item.tag.arrayValue;
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
        subTag.tagSupport = getTagSupport({}); // {...ownerTag.tagSupport} // ownerTag.tagSupport.templater
        subTag.tagSupport.mutatingRender = () => {
            ownerTag.tagSupport.render();
            return subTag;
        }; // fake having a render function
        subTag.ownerTag = ownerTag;
        ownerTag.children.push(subTag);
        // check for html``.key()
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
            const isSame = previous.tag.arrayValue === subTag.arrayValue;
            if (isSame) {
                previous.tag.updateValues(subTag.values);
            }
            return [];
        }
        const nextClones = processTagResult(subTag, result, before, {
            index,
            ...options,
        });
        clones.push(...nextClones);
    });
    return clones;
}
//# sourceMappingURL=processTagArray.js.map