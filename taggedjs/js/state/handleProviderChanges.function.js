export function handleProviderChanges(appSupport, provider) {
    const tagsWithProvider = getTagsWithProvider(appSupport, provider);
    return tagsWithProvider;
}
/** Updates and returns memory of tag providers */
function getTagsWithProvider(support, provider, memory = []) {
    const subject = support.subject;
    memory.push({
        support,
        renderCount: subject.renderCount,
        provider,
    });
    const childTags = provider.children;
    for (let index = childTags.length - 1; index >= 0; --index) {
        const child = childTags[index];
        const cSubject = child.subject;
        memory.push({
            support: child,
            renderCount: cSubject.renderCount,
            provider,
        });
    }
    return memory;
}
//# sourceMappingURL=handleProviderChanges.function.js.map