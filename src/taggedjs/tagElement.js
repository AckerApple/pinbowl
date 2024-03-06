import { runAfterRender, runBeforeRender } from "./tagRunner.js";
import { renderExistingTag } from "./renderExistingTag.function.js";
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
    // wrapper.tagSupport = tagSupport
    tag.appElement = element;
    tag.tagSupport.oldest = tag;
    addAppTagRender(tag.tagSupport, tag);
    const templateElm = document.createElement('template');
    templateElm.setAttribute('id', 'app-tag-' + appElements.length);
    templateElm.setAttribute('app-tag-detail', appElements.length.toString());
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
    runAfterRender(tagSupport, tag);
    return { tag, tagSupport };
}
/** Overwrites arguments.tagSupport.mutatingRender */
export function addAppTagRender(tagSupport, tag) {
    tagSupport.templater.redraw = () => {
        const existingTag = tag;
        const { retag } = tagSupport.templater.renderWithSupport(tagSupport, existingTag, // newest
        {});
        tag.updateByTag(retag);
        return retag;
    };
    tagSupport.mutatingRender = () => {
        renderExistingTag(tag, tagSupport.templater, tagSupport);
        return tag;
    };
}
//# sourceMappingURL=tagElement.js.map