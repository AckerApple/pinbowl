import { updateBeforeTemplate } from './updateBeforeTemplate.function';
export function processRegularValue(value, subject, // could be tag via subject.tag
insertBefore) {
    subject.insertBefore = insertBefore;
    const before = subject.clone || insertBefore; // Either the template is on the doc OR its the first element we last put on doc
    // matches but also was defined at some point
    if (subject.lastValue === value && 'lastValue' in subject) {
        return; // no need to update display, its the same
    }
    subject.lastValue = value;
    // Processing of regular values
    const clone = updateBeforeTemplate(value, before);
    subject.clone = clone; // remember single element put down, for future updates
}
//# sourceMappingURL=processRegularValue.function.js.map