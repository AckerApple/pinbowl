import { updateBetweenTemplates } from "./interpolateTemplate.js";
export function processRegularValue(value, result, // could be tag via result.tag
template) {
    result.template = template;
    const before = result.clone || template; // Either the template is on the doc OR its the first element we last put on doc
    result.lastValue = value;
    // Processing of regular values
    const clone = updateBetweenTemplates(value, before);
    result.clone = clone; // remember single element put down, for future updates
    return [];
}
//# sourceMappingURL=processRegularValue.function.js.map