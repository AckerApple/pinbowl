import { deepEqual } from "./deepFunctions.js";
export function hasTagSupportChanged(oldTagSupport, newTagSupport) {
    if (oldTagSupport === newTagSupport) {
        throw new Error('someting here');
    }
    const oldProps = oldTagSupport.propsConfig.latest;
    const latestProps = newTagSupport.propsConfig.latest;
    const oldClonedProps = oldTagSupport.propsConfig.latestCloned;
    const propsChanged = hasPropChanges(latestProps, oldClonedProps, oldProps);
    // if no changes detected, no need to continue to rendering further tags
    if (propsChanged) {
        return true;
    }
    const kidsChanged = hasKidsChanged(oldTagSupport, newTagSupport);
    // we already know props didn't change and if kids didn't either, than don't render
    return kidsChanged;
}
export function hasPropChanges(props, // natural props
pastCloneProps, // previously cloned props
compareToProps) {
    const isCommonEqual = props === undefined && props === compareToProps;
    if (isCommonEqual) {
        return false;
    }
    let castedProps = props;
    let castedPastProps = pastCloneProps;
    // check all prop functions match
    if (typeof (props) === 'object') {
        if (!pastCloneProps) {
            return true;
        }
        castedProps = { ...props };
        castedPastProps = { ...(pastCloneProps || {}) };
        const allFunctionsMatch = Object.entries(castedProps).every(([key, value]) => {
            /*if(!(key in (castedPastProps as any))) {
              return false
            }*/
            let compare = castedPastProps[key];
            if (!(value instanceof Function)) {
                return true; // this will be checked in deepEqual
            }
            if (!(compare instanceof Function)) {
                return false; // its a function now but was not before
            }
            // ensure we are comparing apples to apples as function get wrapped
            if (compare.original) {
                compare = compare.original;
            }
            const original = value.original;
            if (original) {
                value = value.original;
            }
            if (value.toString() !== compare.toString()) {
                return false; // both are function but not the same
            }
            delete castedProps[key]; // its a function and not needed to be compared
            delete castedPastProps[key]; // its a function and not needed to be compared
            return true;
        });
        if (!allFunctionsMatch) {
            return true; // a change has been detected by function comparisons
        }
    }
    const isEqual = deepEqual(pastCloneProps, props);
    return !isEqual; // if equal then no changes
}
export function hasKidsChanged(oldTagSupport, newTagSupport) {
    const oldCloneKidValues = oldTagSupport.propsConfig.lastClonedKidValues;
    const newClonedKidValues = newTagSupport.propsConfig.lastClonedKidValues;
    const everySame = oldCloneKidValues.every((set, index) => {
        const x = newClonedKidValues[index];
        return set.every((item, index) => item === x[index]);
    });
    return !everySame;
}
//# sourceMappingURL=hasTagSupportChanged.function.js.map