import { runAfterRender, runBeforeRedraw } from "./tagRunner.js";
export function updateExistingTag(templater, ogTag, existingSubject) {
    const tagSupport = ogTag.tagSupport;
    const oldest = tagSupport.oldest;
    runBeforeRedraw(oldest.tagSupport, oldest);
    const retag = templater.wrapper();
    // move my props onto tagSupport
    tagSupport.latestProps = retag.tagSupport.props;
    tagSupport.latestClonedProps = retag.tagSupport.clonedProps;
    // tagSupport.latestClonedProps = retag.tagSupport.latestClonedProps
    tagSupport.memory = retag.tagSupport.memory;
    retag.tagSupport = tagSupport;
    templater.newest = retag;
    tagSupport.newest = retag;
    runAfterRender(oldest.tagSupport, oldest);
    ogTag.updateByTag(retag);
    existingSubject.set(templater);
    return;
}
//# sourceMappingURL=updateExistingTag.function.js.map