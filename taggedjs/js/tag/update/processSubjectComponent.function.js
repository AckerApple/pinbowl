import { processTagResult } from './processTagResult.function.js';
import { Support } from '../Support.class.js';
import { renderSubjectComponent } from '../render/renderSubjectComponent.function.js';
import { setupNewSupport } from './processTag.function.js';
import { ValueTypes } from '../ValueTypes.enum.js';
/** create new support, connects globals to old support if one, and  */
export function processSubjectComponent(templater, subject, insertBefore, ownerSupport, options) {
    // Check if function component is wrapped in a tag() call
    // TODO: This below check not needed in production mode
    const notTag = templater.tagJsType !== ValueTypes.stateRender && templater.tagged !== true;
    if (notTag) {
        const wrapper = templater.wrapper;
        const original = wrapper?.parentWrap.original || templater;
        let name = original.name || original.constructor?.name;
        if (name === 'Function') {
            name = undefined;
        }
        const label = name || original.toString().substring(0, 120);
        const error = new Error(`Not a tag component. Wrap your function with tag(). Example tag(props => html\`\`) on component:\n\n${label}\n\n`);
        throw error;
    }
    const support = new Support(templater, ownerSupport, subject);
    let reSupport = subject.support;
    setupNewSupport(support, ownerSupport, subject);
    const global = support.subject.global = reSupport?.subject.global || support.subject.global;
    global.oldest = support;
    global.insertBefore = insertBefore;
    const isRender = !reSupport;
    if (isRender) {
        const mySupport = reSupport || support;
        reSupport = renderSubjectComponent(subject, mySupport, ownerSupport);
    }
    const newSupport = processTagResult(reSupport, subject, // The element set here will be removed from document. Also result.tag will be added in here
    options);
    ownerSupport.subject.global.childTags.push(newSupport);
    return reSupport;
}
//# sourceMappingURL=processSubjectComponent.function.js.map