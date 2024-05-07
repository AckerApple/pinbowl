import { renderWithSupport } from './renderWithSupport.function';
export function renderSubjectComponent(subject, reSupport, ownerSupport) {
    const preClones = ownerSupport.clones.map(clone => clone);
    reSupport = renderWithSupport(reSupport, subject.tagSupport, // existing tag
    subject, ownerSupport);
    reSupport.global.newest = reSupport;
    if (ownerSupport.clones.length > preClones.length) {
        const myClones = ownerSupport.clones.filter(fClone => !preClones.find(clone => clone === fClone));
        reSupport.clones.push(...myClones);
    }
    ownerSupport.childTags.push(reSupport);
    return reSupport;
}
//# sourceMappingURL=renderSubjectComponent.function.js.map