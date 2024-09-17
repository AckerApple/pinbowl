import { castTextValue, updateBeforeTemplate } from '../../updateBeforeTemplate.function.js';
import { setContent } from '../paint.function.js';
import { checkSimpleValueChange } from '../checkDestroyPrevious.function.js';
export function processUpdateRegularValue(value, contextItem) {
    const castedValue = castTextValue(value);
    const oldClone = contextItem.simpleValueElm; // placeholder
    setContent.push([castedValue, oldClone]);
}
/** Used during updates that were another value/tag first but now simple string */
export function processNowRegularValue(value, subject) {
    subject.checkValueChange = checkSimpleValueChange;
    const before = subject.placeholder;
    const castedValue = castTextValue(value);
    // Processing of regular values
    subject.simpleValueElm = updateBeforeTemplate(castedValue, before);
}
//# sourceMappingURL=processRegularValue.function.js.map