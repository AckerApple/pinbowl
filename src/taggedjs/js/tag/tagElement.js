import { BaseTagSupport } from './TagSupport.class';
import { runAfterRender, runBeforeRender } from './tagRunner';
import { ValueSubject } from '../subject/ValueSubject';
const appElements = [];
/**
 *
 * @param app taggedjs tag
 * @param element HTMLElement
 * @param props object
 * @returns
 */
export function tagElement(app, // (...args: unknown[]) => TemplaterResult,
element, props) {
    const appElmIndex = appElements.findIndex(appElm => appElm.element === element);
    if (appElmIndex >= 0) {
        appElements[appElmIndex].tagSupport.destroy();
        appElements.splice(appElmIndex, 1);
        // an element already had an app on it
        console.warn('Found and destroyed app element already rendered to element', { element });
    }
    // Create the app which returns [props, runOneTimeFunction]
    const wrapper = app(props);
    // have a function setup and call the tagWrapper with (props, {update, async, on})
    const tagSupport = runWrapper(wrapper);
    // TODO: is the below needed?
    tagSupport.appElement = element;
    tagSupport.isApp = true;
    tagSupport.global.isApp = true;
    const templateElm = document.createElement('template');
    templateElm.setAttribute('id', 'app-tag-' + appElements.length);
    templateElm.setAttribute('app-tag-detail', appElements.length.toString());
    const fragment = document.createDocumentFragment();
    fragment.appendChild(templateElm);
    element.destroy = async () => {
        await tagSupport.destroy();
        const insertBefore = tagSupport.global.insertBefore;
        const parentNode = insertBefore.parentNode;
        parentNode.removeChild(insertBefore);
    };
    tagSupport.buildBeforeElement(templateElm);
    tagSupport.global.oldest = tagSupport;
    tagSupport.global.newest = tagSupport;
    element.setUse = app.original.setUse;
    appElements.push({ element, tagSupport });
    element.appendChild(fragment);
    return {
        tagSupport,
        tags: app.original.tags,
    };
}
export function runWrapper(templater) {
    let newSupport = {};
    const subject = new ValueSubject(newSupport);
    newSupport = new BaseTagSupport(templater, subject);
    subject.set(templater);
    subject.tagSupport = newSupport;
    runBeforeRender(newSupport, undefined);
    // Call the apps function for our tag templater
    const wrapper = templater.wrapper;
    const tagSupport = wrapper(newSupport, subject);
    runAfterRender(newSupport, tagSupport);
    return tagSupport;
}
//# sourceMappingURL=tagElement.js.map