export function destroyTagMemory(oldSupport) {
    const subject = oldSupport.subject;
    const global = subject.global;
    const oldest = global.oldest;
    oldest.destroy();
}
//# sourceMappingURL=destroyTag.function.js.map