import { renderWithSupport } from './renderWithSupport.function.js';
export function renderSubjectComponent(subject, reSupport, ownerSupport) {
    const preClones = ownerSupport.clones.map(clone => clone);
    reSupport = renderWithSupport(reSupport, subject.tagSupport, // existing tag
    subject, ownerSupport);
    if (ownerSupport.clones.length > preClones.length) {
        const myClones = ownerSupport.clones.filter(fClone => !preClones.find(clone => clone === fClone));
        reSupport.clones.push(...myClones);
    }
    return reSupport;
}
//# sourceMappingURL=renderSubjectComponent.function.js.map