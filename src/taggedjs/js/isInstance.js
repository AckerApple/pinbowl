export function isTagComponent(value) {
    return value?.wrapper?.original instanceof Function;
}
export function isTag(value) {
    return isTagTemplater(value) || isTagClass(value);
}
export function isTagTemplater(value) {
    const templater = value;
    return templater?.isTemplater === true && templater.wrapper === undefined;
}
export function isTagClass(value) {
    const templater = value;
    return templater?.isTagClass === true;
}
export function isSubjectInstance(subject) {
    return (subject?.isSubject === true || subject?.subscribe) ? true : false; // subject?.isSubject === true || 
}
export function isTagArray(value) {
    return value instanceof Array && value.every(x => isTagClass(x) || isTagTemplater(x));
}
//# sourceMappingURL=isInstance.js.map