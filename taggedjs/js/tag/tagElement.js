import { getBaseSupport } from './Support.class.js';
import { subscribeToTemplate } from '../interpolations/subscribeToTemplate.function.js';
import { buildBeforeElement } from './buildBeforeElement.function.js';
import { getNewGlobal } from './update/getNewGlobal.function.js';
import { BasicTypes, ValueTypes } from './ValueTypes.enum.js';
import { destroySupport } from './destroySupport.function.js';
import { checkTagValueChange, PropWatches } from './index.js';
import { setUseMemory } from '../state/setUse.function.js';
import { runAfterRender } from './afterRender.function.js';
import { executeWrap } from './executeWrap.function.js';
import { paint, painting } from './paint.function.js';
import { initState } from '../state/state.utils.js';
import { isTagComponent } from '../isInstance.js';
const appElements = [];
/**
 *
 * @param app taggedjs tag
 * @param element HTMLElement
 * @param props object
 * @returns
 */
export function tagElement(app, element, props) {
    const appElmIndex = appElements.findIndex(appElm => appElm.element === element);
    if (appElmIndex >= 0) {
        destroySupport(appElements[appElmIndex].support, 0);
        appElements.splice(appElmIndex, 1);
        // an element already had an app on it
        console.warn('Found and destroyed app element already rendered to element', { element });
    }
    // Create the app which returns [props, runOneTimeFunction]
    let templater = (() => templater2(props));
    templater.propWatch = PropWatches.NONE;
    templater.tagJsType = ValueTypes.stateRender;
    // todo: props should be an array
    templater.props = [props];
    // create observable the app lives on
    const subject = getNewSubject(templater, element);
    const global = subject.global;
    initState(global.newest, setUseMemory.stateConfig);
    let templater2 = app(props);
    if (typeof templater2 !== BasicTypes.function) {
        if (!isTagComponent(templater2)) {
            templater2 = app;
        }
        else {
            global.newest.propsConfig = {
                latest: [props],
                castProps: [props],
            };
            templater.propWatch = templater2.propWatch;
            templater.tagJsType = templater2.tagJsType;
            templater.wrapper = templater2.wrapper;
            templater = templater2;
        }
    }
    const placeholder = document.createTextNode('');
    const support = runWrapper(templater, placeholder, element, subject);
    global.isApp = true;
    element.destroy = function () {
        const events = global.events;
        for (const eventName in events) {
            const callback = events[eventName];
            element.removeEventListener(eventName, callback);
        }
        global.events = {};
        destroySupport(support, 0); // never return anything here
        paint();
    };
    let tags = []; // TagWrapper<unknown>[]
    ++painting.locks;
    const result = buildBeforeElement(support, element);
    global.oldest = support;
    global.newest = support;
    let setUse = templater.setUse;
    if (templater.tagJsType !== ValueTypes.stateRender) {
        const wrap = app;
        const original = wrap.original;
        // const parentWrap = wrap.parentWrap
        // const original = (wrap as unknown).original || parentWrap.original as Original
        //  const original = parentWrap.original as Original
        setUse = original.setUse;
        tags = original.tags;
    }
    ;
    element.setUse = setUse;
    element.ValueTypes = ValueTypes;
    appElements.push({ element, support });
    const newFragment = document.createDocumentFragment();
    newFragment.appendChild(placeholder);
    for (const domItem of result.dom) {
        putOneDomDown(domItem, newFragment);
    }
    for (const sub of result.subs) {
        subscribeToTemplate(sub);
    }
    --painting.locks;
    paint();
    element.appendChild(newFragment);
    // ++subject.renderCount
    return {
        support,
        tags,
        ValueTypes,
    };
}
function getNewSubject(templater, appElement) {
    const subject = {
        value: templater,
        checkValueChange: checkTagValueChange,
        withinOwnerElement: false, // i am the highest owner
        renderCount: 0,
        global: undefined, // gets set below in getNewGlobal()
    };
    const global = getNewGlobal(subject);
    global.events = {};
    const newSupport = getBaseSupport(templater, subject);
    newSupport.appElement = appElement;
    global.oldest = global.oldest || newSupport;
    global.newest = newSupport;
    return subject;
}
export function runWrapper(templater, placeholder, appElement, subject) {
    subject.placeholder = placeholder;
    const global = subject.global;
    const newSupport = global.newest;
    if (templater.tagJsType === ValueTypes.stateRender) {
        const result = (templater.wrapper || { original: templater });
        const nowSupport = executeWrap(templater, result, newSupport);
        runAfterRender(newSupport, nowSupport);
        return nowSupport;
    }
    // Call the apps function for our tag templater
    const wrapper = templater.wrapper;
    const nowSupport = wrapper(newSupport, subject);
    runAfterRender(newSupport, nowSupport);
    return nowSupport;
}
function putOneDomDown(dom, newFragment) {
    if (dom.domElement) {
        newFragment.appendChild(dom.domElement);
    }
    if (dom.marker) {
        newFragment.appendChild(dom.marker);
    }
}
//# sourceMappingURL=tagElement.js.map