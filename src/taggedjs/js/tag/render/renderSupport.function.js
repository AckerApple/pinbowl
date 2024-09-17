import { deepEqual } from '../../deepFunctions.js';
import { renderExistingReadyTag } from './renderExistingTag.function.js';
import { ValueTypes } from '../ValueTypes.enum.js';
import { PropWatches } from '../index.js';
import { deepCompareDepth, immutablePropMatch, shallowPropMatch } from '../hasSupportChanged.function.js';
export function isInlineHtml(templater) {
    return ValueTypes.templater === templater.tagJsType;
}
/** Main function used by all other callers to render/update display of a tag component */
export function renderSupport(support) {
    const global = support.subject.global;
    const templater = support.templater;
    const inlineHtml = isInlineHtml(templater);
    const ownerSupport = support.ownerSupport;
    if (global.locked) {
        global.blocked.push(support);
        return support;
    }
    // is it just a vanilla tag, not component?
    if (inlineHtml) {
        return renderInlineHtml(ownerSupport, support);
    }
    global.locked = true;
    const subject = support.subject;
    if (global.blocked.length) {
        support = global.blocked.pop();
        global.blocked = [];
    }
    delete global.locked;
    const tag = renderExistingReadyTag(global.newest, support, ownerSupport, subject);
    return tag;
}
export function renderInlineHtml(ownerSupport, support) {
    const ownGlobal = ownerSupport.subject.global;
    if (!ownGlobal || ownGlobal.deleted === true) {
        return support;
    }
    // ??? new change
    const newest = ownGlobal.newest || ownerSupport;
    const result = renderSupport(newest);
    return result;
}
export function checkRenderUp(ownerSupport, templater, support) {
    const selfPropChange = hasPropsToOwnerChanged(templater, support);
    // render owner up first and that will cause me to re-render
    if (ownerSupport && selfPropChange) {
        return true;
    }
    return false;
}
function hasPropsToOwnerChanged(templater, support) {
    const nowProps = templater.props;
    const propsConfig = support.propsConfig;
    const latestProps = propsConfig.latest;
    const compareLen = hasPropLengthsChanged(nowProps, latestProps);
    if (compareLen) {
        return true;
    }
    switch (templater.propWatch) {
        case PropWatches.IMMUTABLE:
            return immutablePropMatch(nowProps, latestProps);
        case PropWatches.SHALLOW:
            return shallowPropMatch(nowProps, latestProps);
    }
    return !deepEqual(nowProps, latestProps, deepCompareDepth);
}
export function hasPropLengthsChanged(nowProps, latestProps) {
    const nowLen = nowProps.length;
    const latestLen = latestProps.length;
    /*
    const noLength = nowProps && nowLen === 0 && latestLen === 0
  
    if(noLength) {
      return false
    }
    */
    return nowLen !== latestLen;
}
//# sourceMappingURL=renderSupport.function.js.map