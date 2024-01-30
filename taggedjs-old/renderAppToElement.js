import { getTagSupport } from "./getTagSupport.js";
import { runBeforeRender } from "./tagRunner.js";
export function renderAppToElement(app, element, props) {
    // Create the app which returns [props, runOneTimeFunction]
    const wrapper = app(props);
    // have a function setup and call the tagWrapper with (props, {update, async, on})
    const result = applyTagUpdater(wrapper);
    const { tag, tagSupport } = result;
    tag.appElement = element;
    addAppTagRender(tagSupport, tag);
    const context = tag.updateValues(tag.values);
    const templateElm = document.createElement('template');
    templateElm.setAttribute('tag-detail', 'app-template-placeholder');
    element.appendChild(templateElm);
    tag.buildBeforeElement(templateElm);
    element.tag = tag;
}
export function applyTagUpdater(wrapper) {
    const tagSupport = getTagSupport(0, wrapper);
    runBeforeRender(tagSupport);
    // Call the apps function for our tag templater
    const templater = tagSupport.templater;
    const tag = templater.wrapper();
    tag.tagSupport = tagSupport;
    tag.afterRender();
    return { tag, tagSupport };
}
export function addAppTagRender(tagSupport, tag) {
    let lastTag;
    tagSupport.mutatingRender = () => {
        runBeforeRender(tagSupport, tag);
        tag.beforeRedraw();
        const templater = tagSupport.templater; // wrapper
        const fromTag = lastTag = templater.wrapper();
        fromTag.setSupport(tag.tagSupport);
        tag.afterRender();
        tag.updateByTag(fromTag);
        if (lastTag) {
            lastTag.destroy({ stagger: 0 });
        }
        return lastTag;
    };
}
//# sourceMappingURL=renderAppToElement.js.map