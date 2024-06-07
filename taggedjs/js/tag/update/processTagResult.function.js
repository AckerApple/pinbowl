/** checks if previous support exists on subject or as a last global support. If first render, calls builder. Otherwise calls tagSupport.updateBy() */
export function processTagResult(tagSupport, subject, // used for recording past and current value
insertBefore, // <template end interpolate />
{ counts, }) {
    // *if appears we already have seen
    const subjectTag = subject;
    const lastSupport = subjectTag.tagSupport;
    const prevSupport = lastSupport?.global.oldest || undefined;
    const justUpdate = prevSupport;
    if (prevSupport && justUpdate) {
        return processTagResultUpdate(tagSupport, subjectTag, prevSupport);
    }
    tagSupport.buildBeforeElement(insertBefore, {
        counts,
    });
    return tagSupport;
}
function processTagResultUpdate(tagSupport, subject, // used for recording past and current value
prevSupport) {
    // components
    if (subject instanceof Function) {
        const newSupport = subject(prevSupport);
        prevSupport.updateBy(newSupport);
        subject.tagSupport = newSupport;
        return newSupport;
    }
    prevSupport.updateBy(tagSupport);
    subject.tagSupport = tagSupport;
    return tagSupport;
}
//# sourceMappingURL=processTagResult.function.js.map