import { interpolateElement } from "./interpolateElement.js";
import { getTagSupport } from "./getTagSupport.js";
import { runBeforeRender } from "./tagRunner.js";
export function renderAppToElement(app, element, props) {
    // Create the app which returns [props, runOneTimeFunction]
    const wrapper = app(props);
    // have a function setup and call the tagWrapper with (props, {update, async, on})
    const result = applyTagUpdater(wrapper);
    const { tag, tagSupport } = result;
    let lastTag;
    tagSupport.mutatingRender = () => {
        runBeforeRender(tagSupport, tag);
        tag.beforeRedraw();
        const fromTag = lastTag = wrapper.wrapper();
        fromTag.setSupport(tag.tagSupport);
        tag.afterRender();
        tag.updateByTag(fromTag);
        if (lastTag) {
            lastTag.destroy(0);
        }
        return lastTag;
    };
    const context = tag.updateValues(tag.values);
    const template = tag.getTemplate();
    element.innerHTML = template.string;
    interpolateElement(element, context, tag);
}
export function applyTagUpdater(wrapper) {
    const tagSupport = getTagSupport(wrapper);
    runBeforeRender(tagSupport);
    // Call the apps function for our tag templater
    const templater = tagSupport.templater;
    const tag = templater.wrapper();
    tag.tagSupport = tagSupport;
    tag.afterRender();
    return { tag, tagSupport };
}
//# sourceMappingURL=renderAppToElement.js.map