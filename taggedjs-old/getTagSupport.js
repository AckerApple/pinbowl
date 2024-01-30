import { deepClone, deepEqual } from "./deepFunctions.js";
export function getTagSupport(depth, templater) {
    const tagSupport = {
        templater,
        renderCount: 0,
        depth,
        memory: {
            context: {} // populated after reading interpolated.values array converted to an object {variable0, variable:1}
        },
        mutatingRender: () => {
            const message = 'Tag function "render()" was called in sync but can only be called async';
            console.error(message, { tagSupport });
            throw new Error(message);
        }, // loaded later and only callable async
        render: (force) => {
            ++tagSupport.renderCount;
            return tagSupport.mutatingRender(force);
        }, // ensure this function still works even during deconstructing
        renderExistingTag: (tag, newTemplater) => {
            const preRenderCount = tagSupport.renderCount;
            providersChangeCheck(tag);
            // When the providers were checked, a render to myself occurred and I do not need to re-render again
            if (preRenderCount !== tagSupport.renderCount) {
                return true;
            }
            const oldTemplater = tag.tagSupport.templater;
            const oldProps = oldTemplater?.props;
            const hasPropsChanged = tagSupport.hasPropChanges(newTemplater.props, newTemplater.newProps, oldProps);
            if (!hasPropsChanged) {
                tagSupport.newest = templater.redraw(newTemplater.newProps); // No change detected, just redraw me only
                return true;
            }
            return false;
        },
        hasPropChanges: (props, newProps, compareToProps) => {
            const oldProps = tagSupport.templater.cloneProps;
            const isCommonEqual = props === undefined && props === compareToProps;
            const isEqual = isCommonEqual || deepEqual(newProps, oldProps);
            return !isEqual;
        },
    };
    return tagSupport;
}
function providersChangeCheck(tag) {
    const providersWithChanges = tag.providers.filter(provider => {
        return !deepEqual(provider.instance, provider.clone);
    });
    // reset clones
    providersWithChanges.forEach(provider => {
        const appElement = tag.getAppElement();
        handleProviderChanges(appElement, provider);
        provider.clone = deepClone(provider.instance);
    });
}
/**
 *
 * @param {Tag} appElement
 * @param {Provider} provider
 */
function handleProviderChanges(appElement, provider) {
    const tagsWithProvider = getTagsWithProvider(appElement, provider);
    tagsWithProvider.forEach(({ tag, renderCount, provider }) => {
        if (renderCount === tag.tagSupport.renderCount) {
            provider.clone = deepClone(provider.instance);
            tag.tagSupport.render();
        }
    });
}
/**
 *
 * @param {Tag} appElement
 * @param {Provider} provider
 * @returns {{tag: Tag, renderCount: numer, provider: Provider}[]}
 */
function getTagsWithProvider(tag, provider, memory = []) {
    const hasProvider = tag.providers.find(xProvider => xProvider.constructMethod === provider.constructMethod);
    if (hasProvider) {
        memory.push({
            tag,
            renderCount: tag.tagSupport.renderCount,
            provider: hasProvider
        });
    }
    tag.children.forEach(child => getTagsWithProvider(child, provider, memory));
    return memory;
}
//# sourceMappingURL=getTagSupport.js.map