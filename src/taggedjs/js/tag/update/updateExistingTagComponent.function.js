import { deepCompareDepth, hasSupportChanged, shallowCompareDepth } from '../hasSupportChanged.function.js';
import { processReplacementComponent } from './processFirstSubjectComponent.function.js';
import { castProps, isSkipPropValue } from '../../alterProp.function.js';
import { renderSupport } from '../render/renderSupport.function.js';
import { BasicTypes, ValueTypes } from '../ValueTypes.enum.js';
import { destroySupport } from '../destroySupport.function.js';
import { getNewGlobal } from './getNewGlobal.function.js';
import { isLikeTags } from '../isLikeTags.function.js';
import { isArray } from '../../isInstance.js';
import { PropWatches } from '../tag.js';
export function updateExistingTagComponent(ownerSupport, support, // lastest
subject) {
    const global = subject.global;
    const lastSupport = global.newest;
    const oldWrapper = lastSupport.templater.wrapper;
    const newWrapper = support.templater.wrapper;
    let isSameTag = false;
    const tagJsType = support.templater.tagJsType;
    const skipComparing = ValueTypes.stateRender === tagJsType || ValueTypes.renderOnce === tagJsType;
    if (skipComparing) {
        isSameTag = support.templater.tagJsType === ValueTypes.renderOnce || isLikeTags(lastSupport, support);
    }
    else if (oldWrapper && newWrapper) {
        const oldFunction = oldWrapper.parentWrap.original;
        const newFunction = newWrapper.parentWrap.original;
        // string compare both functions
        isSameTag = oldFunction === newFunction;
    }
    const templater = support.templater;
    if (!isSameTag) {
        swapTags(subject, templater, ownerSupport);
        return;
    }
    const hasChanged = skipComparing || hasSupportChanged(lastSupport, templater);
    // everyhing has matched, no display needs updating.
    if (!hasChanged) {
        const maxDepth = templater.propWatch === PropWatches.DEEP ? deepCompareDepth : shallowCompareDepth;
        syncSupports(templater, support, lastSupport, ownerSupport, maxDepth);
        return;
    }
    if (global.locked) {
        global.blocked.push(support);
        return;
    }
    renderSupport(support);
    return;
}
export function syncFunctionProps(newSupport, lastSupport, ownerSupport, newPropsArray, // templater.props
maxDepth, depth = -1) {
    const global = lastSupport.subject.global;
    const newest = global.newest;
    if (!newest) {
        const castedProps = castProps(newPropsArray, newSupport, depth);
        newPropsArray.push(...castedProps);
        const propsConfig = newSupport.propsConfig;
        propsConfig.castProps = castedProps;
        return newPropsArray;
    }
    lastSupport = newest || lastSupport;
    const priorPropConfig = lastSupport.propsConfig;
    const priorPropsArray = priorPropConfig.castProps;
    const newArray = [];
    for (let index = 0; index < newPropsArray.length; ++index) {
        const prop = newPropsArray[index];
        const priorProp = priorPropsArray[index];
        const newValue = syncPriorPropFunction(priorProp, prop, newSupport, ownerSupport, depth + 1, maxDepth);
        newArray.push(newValue);
    }
    const newPropsConfig = newSupport.propsConfig;
    newPropsConfig.castProps = newArray;
    return newArray;
}
function syncPriorPropFunction(priorProp, prop, newSupport, ownerSupport, maxDepth, depth) {
    if (typeof (priorProp) === BasicTypes.function) {
        // the prop i am receiving, is already being monitored/controlled by another parent
        if (prop.mem) {
            priorProp.mem = prop.mem;
            return prop;
        }
        priorProp.mem = prop;
        return priorProp;
    }
    // prevent infinite recursion
    if (depth === maxDepth) {
        return prop;
    }
    if (isSkipPropValue(prop)) {
        return prop; // no children to crawl through
    }
    if (isArray(prop)) {
        return updateExistingArray(prop, priorProp, newSupport, ownerSupport, depth);
    }
    if (priorProp === undefined) {
        return prop;
    }
    return updateExistingObject(prop, priorProp, newSupport, ownerSupport, depth, maxDepth);
}
function updateExistingObject(prop, priorProp, newSupport, ownerSupport, depth, maxDepth) {
    const keys = Object.keys(prop);
    for (const name of keys) {
        const subValue = prop[name];
        const result = syncPriorPropFunction(priorProp[name], subValue, newSupport, ownerSupport, maxDepth, depth + 1);
        if (prop[name] === result) {
            continue;
        }
        const hasSetter = Object.getOwnPropertyDescriptor(prop, name)?.set;
        if (hasSetter) {
            continue;
        }
        ;
        prop[name] = result;
    }
    return prop;
}
function updateExistingArray(prop, priorProp, newSupport, ownerSupport, depth) {
    for (let index = prop.length - 1; index >= 0; --index) {
        const x = prop[index];
        prop[index] = syncPriorPropFunction(priorProp[index], x, newSupport, ownerSupport, depth + 1, index);
    }
    return prop;
}
export function moveProviders(lastSupport, newSupport) {
    const global = lastSupport.subject.global;
    let pIndex = -1;
    const providers = global.providers = global.providers || [];
    const pLen = providers.length - 1;
    while (pIndex++ < pLen) {
        const provider = providers[pIndex];
        let index = -1;
        const pcLen = provider.children.length - 1;
        while (index++ < pcLen) {
            const child = provider.children[index];
            const wasSameGlobals = global === child.subject.global;
            if (wasSameGlobals) {
                provider.children.splice(index, 1);
                provider.children.push(newSupport);
                return;
            }
        }
    }
}
function syncSupports(templater, support, lastSupport, ownerSupport, maxDepth) {
    // update function refs to use latest references
    const newProps = templater.props;
    const castedProps = syncFunctionProps(support, lastSupport, ownerSupport, newProps, maxDepth);
    const propsConfig = support.propsConfig;
    // When new support actually makes call to real function, use these pre casted props
    propsConfig.castProps = castedProps;
    const lastPropsConfig = lastSupport.propsConfig;
    // update support to think it has different cloned props
    lastPropsConfig.latest = propsConfig.latest;
    return lastSupport; // its the same tag component  
}
/** Was tag, will be tag */
function swapTags(subject, templater, // new tag
ownerSupport) {
    const global = subject.global;
    const oldestSupport = global.oldest;
    destroySupport(oldestSupport, 0);
    getNewGlobal(subject);
    const newSupport = processReplacementComponent(templater, subject, ownerSupport, { added: 0, removed: 0 });
    return newSupport;
}
//# sourceMappingURL=updateExistingTagComponent.function.js.map