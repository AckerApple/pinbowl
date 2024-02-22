import { runAfterRender, runBeforeRedraw, runBeforeRender } from "./tagRunner.js";
const appElements = [];
export function tagElement(app, // (...args: unknown[]) => TemplaterResult,
element, props) {
    const appElmIndex = appElements.findIndex(appElm => appElm.element === element);
    if (appElmIndex >= 0) {
        appElements[appElmIndex].tag.destroy();
        appElements.splice(appElmIndex, 1);
        // an element already had an app on it
        console.warn('Found and destroyed app element already rendered to element', { element });
    }
    // Create the app which returns [props, runOneTimeFunction]
    const wrapper = app(props);
    // have a function setup and call the tagWrapper with (props, {update, async, on})
    const result = applyTagUpdater(wrapper);
    const { tag, tagSupport } = result;
    tag.appElement = element;
    addAppTagRender(tagSupport, tag);
    const templateElm = document.createElement('template');
    templateElm.setAttribute('tag-detail', 'app-template-placeholder');
    element.appendChild(templateElm);
    tag.buildBeforeElement(templateElm);
    element.setUse = app.original.setUse;
    appElements.push({ element, tag });
    return { tag, tags: app.original.tags };
}
export function applyTagUpdater(wrapper) {
    const tagSupport = wrapper.tagSupport;
    runBeforeRender(tagSupport, undefined);
    // Call the apps function for our tag templater
    const tag = wrapper.wrapper();
    tag.tagSupport = tagSupport;
    runAfterRender(tag.tagSupport, tag);
    return { tag, tagSupport };
}
/** Overwrites arguments.tagSupport.mutatingRender */
export function addAppTagRender(tagSupport, tag) {
    let lastTag;
    tagSupport.mutatingRender = () => {
        runBeforeRedraw(tag.tagSupport, tag);
        const templater = tagSupport.templater; // wrapper
        const fromTag = lastTag = templater.wrapper();
        tagSupport.latestProps = fromTag.tagSupport.props;
        tagSupport.latestClonedProps = fromTag.tagSupport.clonedProps;
        fromTag.setSupport(tagSupport);
        runAfterRender(tag.tagSupport, tag);
        tag.updateByTag(fromTag);
        tagSupport.newest = fromTag;
        return lastTag;
    };
}
//# sourceMappingURL=tagElement.js.map