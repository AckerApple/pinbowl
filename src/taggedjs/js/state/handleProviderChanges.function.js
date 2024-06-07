import { deepClone } from '../deepFunctions.js';
import { renderTagSupport } from '../tag/render/renderTagSupport.function.js';
export function handleProviderChanges(appSupport, provider) {
    const tagsWithProvider = getTagsWithProvider(appSupport, provider);
    for (let index = tagsWithProvider.length - 1; index >= 0; --index) {
        const { tagSupport, renderCount, provider } = tagsWithProvider[index];
        if (tagSupport.global.deleted) {
            continue; // i was deleted after another tag processed
        }
        const notRendered = renderCount === tagSupport.global.renderCount;
        if (notRendered) {
            provider.clone = deepClone(provider.instance);
            renderTagSupport(tagSupport.global.newest, // tagSupport, // tagSupport.global.newest as TagSupport,
            false);
            continue;
        }
    }
}
/** Updates and returns memory of tag providers */
function getTagsWithProvider(tagSupport, provider, memory = []) {
    memory.push({
        tagSupport,
        renderCount: tagSupport.global.renderCount,
        provider,
    });
    const childTags = provider.children;
    for (let index = childTags.length - 1; index >= 0; --index) {
        memory.push({
            tagSupport: childTags[index],
            renderCount: childTags[index].global.renderCount,
            provider,
        });
    }
    return memory;
}
//# sourceMappingURL=handleProviderChanges.function.js.map