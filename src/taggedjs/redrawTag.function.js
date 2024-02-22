import { TagSupport } from "./TagSupport.class.js";
export function redrawTag(existingTag, templater, // latest tag function to call for rendering
ownerTag) {
    // TODO: The or condition here may not be needed since its an obvious "re"draw
    const tagSupport = existingTag?.tagSupport || new TagSupport(templater, templater.tagSupport.children);
    const result = templater.renderWithSupport(tagSupport, existingTag, ownerTag);
    return result;
}
//# sourceMappingURL=redrawTag.function.js.map