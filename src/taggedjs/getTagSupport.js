import { deepClone, deepEqual } from "./deepFunctions.js";
import { isTagInstance } from "./isInstance.js";
import { getNewProps } from "./templater.utils.js";
export class TagSupport {
    templater;
    props;
    latestProps; // new props NOT cloned props
    // props from **constructor** are converted for comparing over renders
    clonedProps;
    latestClonedProps; // This seems to be a duplicate of clonedProps
    memory = {
        context: {}, // populated after reading interpolated.values array converted to an object {variable0, variable:1}
        state: {
            newest: [],
        },
        providers: [],
        /** Indicator of re-rending. Saves from double rending something already rendered */
        renderCount: 0,
    };
    constructor(templater, props) {
        this.templater = templater;
        this.props = props;
        this.latestProps = props; // getNewProps(props, templater)
        const latestProps = getNewProps(props, templater);
        this.latestClonedProps = latestProps;
        // if the latest props are not HTML children, then clone the props for later render cycles to compare
        if (!isTagInstance(props)) {
            this.latestClonedProps = deepClone(latestProps);
        }
        this.clonedProps = this.latestClonedProps;
    }
    // TODO: these below may not be in use
    oldest;
    newest;
    hasPropChanges(props, // natural props
    pastCloneProps, // previously cloned props
    compareToProps) {
        // const oldProps = this.props
        const oldProps = compareToProps;
        const isCommonEqual = props === undefined && props === compareToProps;
        const isEqual = isCommonEqual || deepEqual(pastCloneProps, props);
        return !isEqual;
    }
    mutatingRender() {
        const message = 'Tag function "render()" was called in sync but can only be called async';
        console.error(message, { tagSupport: this });
        throw new Error(message);
    } // loaded later and only callable async
    render() {
        ++this.memory.renderCount;
        return this.mutatingRender();
    } // ensure this function still works even during deconstructing
    renderExistingTag(tag, newTemplater) {
        const preRenderCount = this.memory.renderCount;
        providersChangeCheck(tag);
        // When the providers were checked, a render to myself occurred and I do not need to re-render again
        if (preRenderCount !== this.memory.renderCount) {
            return true;
        }
        const oldTemplater = tag.tagSupport.templater;
        const nowProps = newTemplater.tagSupport.props; // natural props
        // const oldClonedProps = newTemplater.tagSupport.clonedProps // natural props
        const oldClonedProps = oldTemplater.tagSupport.clonedProps; // natural props
        // const oldClonedProps = oldTemplater?.tagSupport.clonedProps // previously cloned props
        // const newProps = newTemplater.tagSupport.clonedProps // new props cloned
        const oldProps = oldTemplater?.tagSupport.props; // new props cloned
        // const newProps = newTemplater.tagSupport.latestClonedProps // new props cloned
        return renderTag(this, nowProps, oldClonedProps, oldProps, // newProps,
        this.templater);
    }
}
export function getTagSupport(templater, props) {
    const tagSupport = new TagSupport(templater, props);
    return tagSupport;
}
function providersChangeCheck(tag) {
    const providersWithChanges = tag.tagSupport.memory.providers.filter(provider => !deepEqual(provider.instance, provider.clone));
    // reset clones
    providersWithChanges.forEach(provider => {
        const appElement = tag.getAppElement();
        handleProviderChanges(appElement, provider);
        provider.clone = deepClone(provider.instance);
    });
}
function handleProviderChanges(appElement, provider) {
    const tagsWithProvider = getTagsWithProvider(appElement, provider);
    tagsWithProvider.forEach(({ tag, renderCount, provider }) => {
        const unRendered = renderCount === tag.tagSupport.memory.renderCount;
        if (unRendered) {
            provider.clone = deepClone(provider.instance);
            tag.tagSupport.render();
        }
    });
}
function getTagsWithProvider(tag, provider, memory = []) {
    const hasProvider = tag.tagSupport.memory.providers.find(xProvider => xProvider.constructMethod === provider.constructMethod);
    if (hasProvider) {
        memory.push({
            tag,
            renderCount: tag.tagSupport.memory.renderCount,
            provider: hasProvider
        });
    }
    tag.children.forEach(child => getTagsWithProvider(child, provider, memory));
    return memory;
}
function renderTag(tagSupport, nowProps, // natural props
oldCloneProps, // now props cloned
oldProps, // previously NOT cloned props
templater) {
    const hasPropsChanged = tagSupport.hasPropChanges(nowProps, oldCloneProps, oldProps);
    tagSupport.newest = templater.redraw(); // No change detected, just redraw me only
    if (!hasPropsChanged) {
        return true;
    }
    return false;
}
//# sourceMappingURL=getTagSupport.js.map