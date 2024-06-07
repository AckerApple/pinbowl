export function destroyTagMemory(oldTagSupport) {
    // must destroy oldest which is tag with elements on stage
    const oldest = oldTagSupport.global.oldest;
    oldest.destroy();
    oldTagSupport.global.context = {};
}
//# sourceMappingURL=destroyTag.function.js.map