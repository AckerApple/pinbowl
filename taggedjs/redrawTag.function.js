export function redrawTag(tagSupport, templater, // latest tag function to call for rendering
existingTag, ownerTag) {
    const result = templater.renderWithSupport(tagSupport, existingTag, ownerTag);
    return result;
}
//# sourceMappingURL=redrawTag.function.js.map