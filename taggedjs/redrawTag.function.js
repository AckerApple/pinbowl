import { getTagSupport } from "./getTagSupport.js";
export function redrawTag(existingTag, templater, // latest tag function to call for rendering
ownerTag) {
    const tagSupport = existingTag?.tagSupport || getTagSupport(templater);
    const result = templater.renderWithSupport(tagSupport, existingTag, ownerTag);
    return result;
}
//# sourceMappingURL=redrawTag.function.js.map