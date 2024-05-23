import { TagSupport } from '../TagSupport.class';
import { ValueSubject } from '../../subject';
/** Could be a regular tag or a component. Both are Tag.class */
export function processTag(templater, insertBefore, ownerSupport, // owner
subject) {
    let tagSupport = subject.tagSupport;
    // first time seeing this tag?
    if (!tagSupport) {
        tagSupport = new TagSupport(templater, ownerSupport, subject);
        setupNewTemplater(tagSupport, ownerSupport, subject);
        ownerSupport.childTags.push(tagSupport);
    }
    subject.tagSupport = tagSupport;
    tagSupport.ownerTagSupport = ownerSupport;
    tagSupport.buildBeforeElement(insertBefore, {
        counts: { added: 0, removed: 0 },
    });
}
export function setupNewTemplater(tagSupport, ownerSupport, subject) {
    tagSupport.global.oldest = tagSupport;
    tagSupport.global.newest = tagSupport;
    // asking me to render will cause my parent to render
    tagSupport.ownerTagSupport = ownerSupport;
    subject.tagSupport = tagSupport;
}
export function tagFakeTemplater(tag) {
    const templater = getFakeTemplater();
    templater.tag = tag;
    tag.templater = templater;
    return templater;
}
export function getFakeTemplater() {
    const fake = {
        children: new ValueSubject([]), // no children
        // props: {} as Props,
        props: [],
        isTag: true,
        isTemplater: false,
        tagged: false,
        madeChildIntoSubject: false,
        html: () => fake
    };
    return fake;
}
//# sourceMappingURL=processTag.function.js.map