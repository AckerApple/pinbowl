import { ValueSubject } from "./ValueSubject.js";
import { redrawTag } from "./redrawTag.function.js";
import { bindSubjectCallback } from "./bindSubjectCallback.function.js";
export function getSubjectFunction(value, tag) {
    return new ValueSubject(bindSubjectCallback(value, tag));
}
export function setValueRedraw(templater, // latest tag function to call for rendering
existing, ownerTag) {
    // const oldCount = existing.tagSupport?.memory.renderCount
    // redraw does not communicate to parent
    templater.redraw = () => {
        const existingTag = existing.tag;
        const { remit, retag } = redrawTag(existingTag, templater, ownerTag);
        existing.tagSupport = retag.tagSupport;
        if (!remit) {
            return;
        }
        existing.set(templater);
        return retag;
    };
}
//# sourceMappingURL=Tag.utils.js.map