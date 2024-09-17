import { getSupport } from '../Support.class.js';
import { beforeRender } from './beforeRender.function.js';
import { executeWrap } from '../executeWrap.function.js';
import { ValueTypes } from '../ValueTypes.enum.js';
import { runAfterRender } from '../afterRender.function.js';
export function renderTagOnly(newSupport, prevSupport, // causes restate
subject, ownerSupport) {
    const global = subject.global;
    const oldRenderCount = subject.renderCount;
    beforeRender(newSupport, prevSupport?.state);
    const templater = newSupport.templater;
    let reSupport;
    // NEW TAG CREATED HERE
    if (templater.tagJsType === ValueTypes.stateRender) {
        const result = templater; // .wrapper as any// || {original: templater} as any
        const useSupport = getSupport(templater, ownerSupport, newSupport.appSupport, // ownerSupport.appSupport as Support,
        subject);
        reSupport = executeWrap(templater, result, useSupport);
    }
    else {
        // functions wrapped in tag()
        const wrapper = templater.wrapper;
        // calls the function returned from getTagWrap()
        reSupport = wrapper(newSupport, subject, prevSupport);
    }
    runAfterRender(reSupport, ownerSupport);
    global.newest = reSupport;
    // When we rendered, only 1 render should have taken place OTHERWISE rendering caused another render and that is the latest instead
    // TODO: below most likely not needed
    if (subject.renderCount > oldRenderCount + 1) {
        return global.newest;
    }
    return reSupport;
}
//# sourceMappingURL=renderTagOnly.function.js.map