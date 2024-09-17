import { deepEqual } from '../deepFunctions.js';
import { isArray } from '../isInstance.js';
import { hasPropLengthsChanged } from './render/renderSupport.function.js';
import { PropWatches } from './tag.js';
import { BasicTypes } from './ValueTypes.enum.js';
export function hasSupportChanged(lastSupport, newTemplater) {
    const latestProps = newTemplater.props;
    const propsConfig = lastSupport.propsConfig;
    const pastCloneProps = propsConfig.latest;
    const propsChanged = hasPropChanges(latestProps, pastCloneProps, lastSupport.templater.propWatch);
    return propsChanged;
}
/**
 *
 * @param props
 * @param pastCloneProps
 * @returns WHEN number then props have changed. WHEN false props have not changed
 */
function hasPropChanges(props, // natural props
pastCloneProps, // previously cloned props
propWatch) {
    const hasLenChanged = hasPropLengthsChanged(props, pastCloneProps);
    if (hasLenChanged) {
        return 11;
    }
    switch (propWatch) {
        case PropWatches.NONE:
            return 1; // always render
        case PropWatches.SHALLOW: // determining equal is same as immutable, its the previous cloning step thats different
            return shallowPropMatch(props, pastCloneProps);
        case PropWatches.IMMUTABLE:
            return immutablePropMatch(props, pastCloneProps);
    }
    return deepPropChangeCompare(props, pastCloneProps);
}
function deepPropChangeCompare(props, pastCloneProps) {
    // DEEP watch
    let castedProps = props;
    let castedPastProps = pastCloneProps;
    castedProps = [...props];
    castedPastProps = [...(pastCloneProps || [])];
    const allFunctionsMatch = castedProps.every((value, index) => onePropCompare(value, index, castedProps, castedPastProps));
    if (!allFunctionsMatch) {
        return 7; // a change has been detected by function comparisons
    }
    return false;
}
export function immutablePropMatch(props, pastCloneProps) {
    // if every prop the same, then no changes
    const len = props.length;
    for (let index = 0; index < len; ++index) {
        const prop = props[index];
        const pastProp = pastCloneProps[index];
        if (prop !== pastProp) {
            return 2;
        }
    }
    return false; // false means has not changed
}
export function shallowPropMatch(props, pastCloneProps) {
    // if every prop the same, then no changes
    const len = props.length;
    for (let index = 0; index < len; ++index) {
        const prop = props[index];
        const pastProp = pastCloneProps[index];
        if (isArray(prop) && isArray(pastProp)) {
            if (prop === pastProp) {
                continue;
            }
            return 3.0; // not equal array
        }
        if (typeof (prop) === BasicTypes.function && typeof (pastProp) === BasicTypes.function) {
            continue; // considered good
        }
        if (typeof (prop) === BasicTypes.object) {
            if (typeof (pastCloneProps) === BasicTypes.object) {
                const obEntries = Object.entries(prop);
                for (const subItem of obEntries) {
                    const result = objectItemMatches(subItem, pastProp);
                    if (!result) {
                        return 3.1;
                    }
                }
            }
            continue; // all sub objects matched
        }
        if (prop === pastProp) {
            continue; // matched good
        }
        return 3.3; // not equal
    }
    return false; // false means has not changed
}
function onePropCompare(value, index, castedProps, castedPastProps) {
    const compare = castedPastProps[index];
    if (typeof (value) === BasicTypes.object) {
        const subCastedProps = { ...value };
        const subCompareProps = { ...compare || {} };
        const matched = Object.entries(subCastedProps).every(([key, value]) => compareProps(value, subCompareProps[key], () => {
            delete subCastedProps[key]; // its a function and not needed to be compared
            delete subCompareProps[key]; // its a function and not needed to be compared
        }));
        return matched;
    }
    return compareProps(value, compare, () => {
        castedProps.splice(index, 1);
        castedPastProps.splice(index, 1);
    });
}
export const shallowCompareDepth = 3;
export const deepCompareDepth = 10;
/** returning a number means true good comparison */
function compareProps(value, compare, onDelete) {
    if (!(typeof (value) === BasicTypes.function)) {
        return deepEqual(value, compare, deepCompareDepth) ? 4 : false;
    }
    const compareFn = compare;
    if (!(typeof (compareFn) === BasicTypes.function)) {
        return false; // its a function now but was not before
    }
    // ensure we are comparing apples to apples as function get wrapped
    const compareOriginal = compare?.original;
    if (compareOriginal) {
        compare = compareOriginal;
    }
    const original = value.original;
    if (original) {
        value = value.original;
    }
    const valueString = value.toString();
    const compareString = compare.toString();
    if (valueString === compareString) {
        onDelete();
        return 5; // both are function the same
    }
    onDelete();
    return 6;
}
function objectItemMatches([name, value], pastProp) {
    const pastValue = pastProp[name];
    if (typeof (value) === BasicTypes.function && typeof (pastValue) === BasicTypes.function) {
        return true;
    }
    return pastValue === value;
}
//# sourceMappingURL=hasSupportChanged.function.js.map