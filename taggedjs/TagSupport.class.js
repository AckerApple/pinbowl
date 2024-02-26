import { deepClone, deepEqual } from "./deepFunctions.js";
import { isTagArray, isTagComponent, isTagInstance } from "./isInstance.js";
import { providersChangeCheck } from "./provider.utils.js";
import { alterProps } from "./templater.utils.js";
export class TagSupport {
    templater;
    children;
    props;
    latestProps; // new props NOT cloned props
    // props from **constructor** are converted for comparing over renders
    latestClonedProps; // This seems to be a duplicate of clonedProps
    lastClonedKidValues = [];
    // TODO: see if we can remove
    clonedProps;
    memory = {
        context: {}, // populated after reading interpolated.values array converted to an object {variable0, variable:1}
        state: {
            newest: [],
        },
        providers: [],
        /** Indicator of re-rending. Saves from double rending something already rendered */
        renderCount: 0,
    };
    constructor(templater, children, // children tags passed in as arguments
    props) {
        this.templater = templater;
        this.children = children;
        this.props = props;
        // this.latestChildren = children // <--------------------?
        this.latestProps = props;
        const latestProps = alterProps(props, templater);
        this.latestClonedProps = latestProps; // assume its HTML children and then detect
        // if the latest props are not HTML children, then clone the props for later render cycles to compare
        if (!isTagInstance(props)) {
            this.latestClonedProps = deepClone(latestProps);
        }
        // TODO: see if we can remove
        this.clonedProps = this.latestClonedProps;
        this.lastClonedKidValues.length = 0;
        children.value.forEach(kid => {
            const cloneValues = cloneValueArray(kid.values);
            this.lastClonedKidValues.push(cloneValues);
        });
    }
    // TODO: these below may not be in use
    oldest;
    newest;
    mutatingRender() {
        const message = 'Tag function "render()" was called in sync but can only be called async';
        console.error(message, { tagSupport: this });
        throw new Error(message);
    } // loaded later and only callable async
    render() {
        ++this.memory.renderCount;
        return this.mutatingRender();
    } // ensure this function still works even during deconstructing
    /** Returns true when rendering owner is not needed. Returns false when rendering owner should occur */
    renderExistingTag(tag, newTemplater) {
        const preRenderCount = this.memory.renderCount;
        providersChangeCheck(tag);
        // When the providers were checked, a render to myself occurred and I do not need to re-render again
        if (preRenderCount !== this.memory.renderCount) {
            return true;
        }
        const oldTemplater = tag.tagSupport.templater;
        const hasChanged = hasTagSupportChanged(oldTemplater.tagSupport, newTemplater.tagSupport);
        this.newest = this.templater.redraw(); // No change detected, just redraw me only
        if (!hasChanged) {
            return true;
        }
        return false;
    }
}
export function hasTagSupportChanged(oldTagSupport, newTagSupport) {
    const oldProps = oldTagSupport.props;
    const latestProps = newTagSupport.props;
    const oldClonedProps = oldTagSupport.latestClonedProps;
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
            let compare = castedPastProps[key];
            if (!compare) {
                return false;
            }
            // ensure we are comparing apples to apples as function get wrapped
            if (compare.original) {
                compare = compare.original;
            }
            if (value.original) {
                value = value.original;
            }
            if (!(value instanceof Function)) {
                return true; // this will be checked in deepEqual
            }
            if (!(compare instanceof Function)) {
                return false; // its a function now but was not before
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
    const oldCloneKidValues = oldTagSupport.lastClonedKidValues;
    const newClonedKidValues = newTagSupport.lastClonedKidValues;
    const everySame = oldCloneKidValues.every((set, index) => {
        const x = newClonedKidValues[index];
        return set.every((item, index) => item === x[index]);
    });
    return !everySame;
}
function cloneValueArray(values) {
    return values.map((value) => {
        const tag = value;
        if (isTagInstance(tag)) {
            return cloneValueArray(tag.values);
        }
        if (isTagComponent(tag)) {
            const tagComponent = tag;
            if (tagComponent.newest || tagComponent.oldest) {
                throw 33;
            }
            return deepClone(tagComponent.tagSupport.latestClonedProps);
        }
        if (isTagArray(tag)) {
            return cloneValueArray(tag);
        }
        return deepClone(value);
    });
}
//# sourceMappingURL=TagSupport.class.js.map