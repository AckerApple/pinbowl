import { isTagComponent } from "../../isInstance.js";
import { providersChangeCheck } from "../../state/providersChangeCheck.function.js";
import { checkRenderUp, isInlineHtml } from "../../tag/render/renderSupport.function.js";
import { ValueTypes } from "../../tag/ValueTypes.enum.js";
export function getUpTags(support, supports = []) {
    const global = support.subject.global;
    const templater = support.templater;
    const inlineHtml = isInlineHtml(templater);
    const ownerSupport = support.ownerSupport;
    if (global.locked) {
        supports.push(support);
        return supports;
    }
    // is it just a vanilla tag, not component?
    if (inlineHtml) {
        return getUpTags(ownerSupport, supports);
    }
    const newSupport = support; // global.newest as Support
    const isComponent = isTagComponent(newSupport.templater);
    const tagJsType = support.templater.tagJsType;
    const canContinueUp = ownerSupport && tagJsType !== ValueTypes.stateRender;
    const continueUp = canContinueUp && (!isComponent || checkRenderUp(ownerSupport, newSupport.templater, newSupport));
    const proSupports = providersChangeCheck(newSupport);
    supports.push(...proSupports);
    if (continueUp) {
        getUpTags(ownerSupport, supports);
        if (isComponent) {
            supports.push(newSupport);
        }
        return supports; // more to keep going up, do not push this child for review
    }
    supports.push(newSupport);
    return supports;
}
//# sourceMappingURL=getUpTags.function.js.map