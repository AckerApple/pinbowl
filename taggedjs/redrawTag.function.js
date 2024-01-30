import { getTagSupport } from "./getTagSupport.js";
export function redrawTag(existingTag, templater, // latest tag function to call for rendering
ownerTag) {
    const depth = ownerTag?.tagSupport.depth || 0;
    const tagSupport = existingTag?.tagSupport || getTagSupport(depth, templater);
    const result = templater.renderWithSupport(tagSupport, existingTag, ownerTag);
    return result;
}
//# sourceMappingURL=redrawTag.function.js.map