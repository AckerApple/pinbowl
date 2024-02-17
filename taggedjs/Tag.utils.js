import { ValueSubject } from "./ValueSubject.js";
import { redrawTag } from "./redrawTag.function.js";
import { bindSubjectCallback } from "./bindSubjectCallback.function.js";
export function getSubjectFunction(value, tag) {
    return new ValueSubject(bindSubjectCallback(value, tag));
}
export function setValueRedraw(templater, // latest tag function to call for rendering
existing, ownerTag) {
    const oldCount = existing.tagSupport?.memory.renderCount;
    // redraw does not communicate to parent
    templater.redraw = (force // forces redraw on children
    ) => {
        const existingTag = existing.tag;
        const { remit, retag } = redrawTag(existingTag, templater, ownerTag);
        existing.tagSupport = retag.tagSupport;
        if (!remit) {
            return;
        }
        existing.set(templater);
        if (force) {
            const tagSupport = existingTag.tagSupport;
            const memory = tagSupport.memory;
            const context = memory.context;
            Object.values(context).forEach((item) => {
                if (!item.value?.isTemplater) {
                    return;
                }
                item.value.redraw();
            });
        }
        return retag;
    };
}
//# sourceMappingURL=Tag.utils.js.map