export function isTagComponent(value) {
    return value?.isTemplater === true;
}
export function isTagInstance(tag) {
    return tag?.isTag === true;
}
export function isSubjectInstance(subject) {
    return (subject?.isSubject === true || subject?.subscribe) ? true : false; // subject?.isSubject === true || 
}
export function isTagArray(value) {
    return value instanceof Array && value.every(x => isTagInstance(x));
}
//# sourceMappingURL=isInstance.js.map