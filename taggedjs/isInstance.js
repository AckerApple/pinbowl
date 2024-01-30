export function isTagComponent(value) {
    return value?.isTemplater === true;
}
export function isTagInstance(tag) {
    return tag?.isTag === true;
}
export function isSubjectInstance(subject) {
    return (subject?.isSubject === true || subject?.subscribe) ? true : false; // subject?.isSubject === true || 
}
//# sourceMappingURL=isInstance.js.map