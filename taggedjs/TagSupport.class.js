import { deepClone } from "./deepFunctions.js";
import { isTagArray, isTagComponent, isTagInstance } from "./isInstance.js";
import { alterProps } from "./templater.utils.js";
export class TagSupport {
    templater;
    children;
    propsConfig;
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
        const latestCloned = alterProps(props, templater);
        this.propsConfig = {
            latest: props,
            latestCloned, // assume its HTML children and then detect
            clonedProps: latestCloned, // maybe duplicate
            lastClonedKidValues: children.value.map(kid => {
                const cloneValues = cloneValueArray(kid.values);
                return cloneValues;
            })
        };
        // if the latest props are not HTML children, then clone the props for later render cycles to compare
        if (!isTagInstance(props)) {
            this.propsConfig.latestCloned = deepClone(latestCloned);
            this.propsConfig.clonedProps = this.propsConfig.latestCloned;
        }
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
}
function cloneValueArray(values) {
    return values.map((value) => {
        const tag = value;
        if (isTagInstance(tag)) {
            return cloneValueArray(tag.values);
        }
        if (isTagComponent(tag)) {
            const tagComponent = tag;
            return deepClone(tagComponent.tagSupport.propsConfig.latestCloned);
        }
        if (isTagArray(tag)) {
            return cloneValueArray(tag);
        }
        return deepClone(value);
    });
}
//# sourceMappingURL=TagSupport.class.js.map