import { deepEqual } from "./deepFunctions.js";
export function getTagSupport(templater) {
    const tagSupport = {
        templater,
        renderCount: 0,
        mutatingRender: () => { throw new Error('Tag function "render()" was called in sync but can only be called async'); }, // loaded later and only callable async
        render: () => {
            ++tagSupport.renderCount;
            return tagSupport.mutatingRender();
        }, // ensure this function still works even during deconstructing
        hasPropChanges: (props, newProps, compareToProps) => {
            const oldProps = tagSupport.templater.cloneProps;
            const isCommonEqual = props === undefined && props === compareToProps;
            const isEqual = isCommonEqual || deepEqual(newProps, oldProps);
            return !isEqual;
        },
    };
    return tagSupport;
}
//# sourceMappingURL=getTagSupport.js.map