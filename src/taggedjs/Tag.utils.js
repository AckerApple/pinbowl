import { TagSupport } from "./TagSupport.class.js";
import { ValueSubject } from "./ValueSubject.js";
import { redrawTag } from "./redrawTag.function.js";
import { bindSubjectCallback } from "./bindSubjectCallback.function.js";
export function getSubjectFunction(value, tag) {
    return new ValueSubject(bindSubjectCallback(value, tag));
}
export function setValueRedraw(templater, // latest tag function to call for rendering
existing, ownerTag) {
    // redraw does not communicate to parent
    templater.redraw = () => {
        const existingTag = existing.tag;
        const tagSupport = existingTag?.tagSupport || new TagSupport(templater, templater.tagSupport.children);
        const { remit, retag } = redrawTag(tagSupport, templater, existingTag, ownerTag);
        existing.tagSupport = retag.tagSupport;
        if (!remit) {
            return;
        }
        existing.set(templater);
        return retag;
    };
}
//# sourceMappingURL=Tag.utils.js.map