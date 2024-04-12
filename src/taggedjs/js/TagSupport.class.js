import { deepClone } from './deepFunctions';
import { isTagArray, isTagComponent, isTagInstance } from './isInstance';
export class BaseTagSupport {
    templater;
    subject;
    isApp = true;
    propsConfig;
    memory = {
        // context: {}, // populated after reading interpolated.values array converted to an object {variable0, variable:1}
        state: {
            newest: [],
        },
    };
    constructor(templater, subject) {
        this.templater = templater;
        this.subject = subject;
        const children = this.templater.children; // children tags passed in as arguments
        const props = this.templater.props; // natural props
        const latestCloned = deepClone(props); // alterProps(props, templater)
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
}
function cloneValueArray(values) {
    return values.map((value) => {
        const tag = value;
        if (isTagInstance(tag)) {
            return cloneValueArray(tag.values);
        }
        if (isTagComponent(tag)) {
            const tagComponent = tag;
            return deepClone(tagComponent.props);
        }
        if (isTagArray(tag)) {
            return cloneValueArray(tag);
        }
        return deepClone(value);
    });
}
export class TagSupport extends BaseTagSupport {
    ownerTagSupport;
    templater;
    subject;
    isApp = false;
    constructor(ownerTagSupport, templater, subject) {
        super(templater, subject);
        this.ownerTagSupport = ownerTagSupport;
        this.templater = templater;
        this.subject = subject;
    }
}
//# sourceMappingURL=TagSupport.class.js.map