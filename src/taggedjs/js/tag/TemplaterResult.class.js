import { ValueTypes } from './ValueTypes.enum.js';
export function getTemplaterResult(propWatch, props) {
    const templater = {
        propWatch,
        props,
        tagJsType: ValueTypes.templater,
        key: function keyTemplate(arrayValue) {
            templater.arrayValue = arrayValue;
            return templater;
        }
    };
    return templater;
}
//# sourceMappingURL=TemplaterResult.class.js.map