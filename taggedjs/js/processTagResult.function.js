export function processTagResult(tag, subject, // used for recording past and current value
insertBefore, // <template end interpolate />
{ counts, forceElement, }) {
    if (!insertBefore.parentNode) {
        throw new Error(`before here processTagResult ${insertBefore.nodeName}`);
    }
    // *if appears we already have seen
    const subjectTag = subject;
    const existingTag = subjectTag.tag;
    const previousTag = existingTag?.tagSupport.templater.global.oldest || undefined; // || tag.tagSupport.oldest // subjectTag.tag
    const justUpdate = previousTag; // && !forceElement
    if (previousTag && justUpdate) {
        /*
        const areLike = previousTag.isLikeTag(tag)
    
        // are we just updating an if we already had?
        if(areLike) {
          return processTagResultUpdate(tag, subjectTag, previousTag)
        }
        */
        return processTagResultUpdate(tag, subjectTag, previousTag);
    }
    /*
    if(insertBefore.nodeName !== 'TEMPLATE') {
      throw new Error(`processTagResult.function.ts insertBefore is not template ${insertBefore.nodeName}`)
    }
    */
    tag.buildBeforeElement(insertBefore, {
        counts,
        forceElement,
    });
}
function processTagResultUpdate(tag, subject, // used for recording past and current value
previousTag) {
    // components
    if (subject instanceof Function) {
        const newTag = subject(previousTag.tagSupport);
        previousTag.updateByTag(newTag);
        subject.tag = newTag;
        return;
    }
    previousTag.updateByTag(tag);
    subject.tag = tag;
    return;
}
//# sourceMappingURL=processTagResult.function.js.map