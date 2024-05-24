import { ValueTypes } from "./tag/update/processFirstSubject.utils";
export function isStaticTag(value) {
    return [
        ValueTypes.tag,
        ValueTypes.templater,
    ].includes(value?.tagJsType);
}
export function isTagTemplater(value) {
    return value?.tagJsType === ValueTypes.templater;
}
// TODO: whats the difference between isTagClass and isTagComponent
export function isTagComponent(value) {
    return value?.tagJsType === ValueTypes.tagComponent;
}
export function isTagClass(value) {
    return value?.tagJsType === ValueTypes.tag;
}
// isSubjectLike
export function isSubjectInstance(subject) {
    return (subject?.isSubject === true || subject?.subscribe) ? true : false; // subject?.isSubject === true || 
}
export function isTagArray(value) {
    return value instanceof Array && value.every(x => [
        ValueTypes.tag, ValueTypes.templater, ValueTypes.tag, ValueTypes.tagComponent
    ].includes(x?.tagJsType));
}
//# sourceMappingURL=isInstance.js.map