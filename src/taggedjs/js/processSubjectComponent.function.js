import { setUse } from './state';
import { processTagResult } from './processTagResult.function';
import { TagSupport } from './TagSupport.class';
import { renderSubjectComponent } from './renderSubjectComponent.function';
export function processSubjectComponent(templater, subject, insertBefore, ownerSupport, options) {
    // Check if function component is wrapped in a tag() call
    // TODO: This below check not needed in production mode
    if (templater.tagged !== true) {
        const wrapper = templater.wrapper;
        const original = wrapper.original;
        let name = original.name || original.constructor?.name;
        if (name === 'Function') {
            name = undefined;
        }
        const label = name || original.toString().substring(0, 120);
        const error = new Error(`Not a tag component. Wrap your function with tag(). Example tag(props => html\`\`) on component:\n\n${label}\n\n`);
        throw error;
    }
    const tagSupport = new TagSupport(templater, ownerSupport, subject);
    let reSupport = subject.tagSupport;
    const global = tagSupport.global = reSupport?.global || tagSupport.global;
    global.insertBefore = insertBefore;
    const providers = setUse.memory.providerConfig;
    providers.ownerSupport = ownerSupport;
    const isRender = !reSupport || options.forceElement;
    if (isRender) {
        const support = reSupport || tagSupport;
        reSupport = renderSubjectComponent(subject, support, ownerSupport);
    }
    processTagResult(reSupport, subject, // The element set here will be removed from document. Also result.tag will be added in here
    insertBefore, // <template end interpolate /> (will be removed)
    options);
    return reSupport;
}
//# sourceMappingURL=processSubjectComponent.function.js.map