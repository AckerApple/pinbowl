import { renderWithSupport } from './renderWithSupport.function.js';
export function renderSubjectComponent(subject, reSupport, ownerSupport) {
    const preClones = ownerSupport.global.clones.map(clone => clone);
    reSupport = renderWithSupport(reSupport, subject.tagSupport, // existing tag
    subject, ownerSupport);
    if (ownerSupport.global.clones.length > preClones.length) {
        const myClones = ownerSupport.global.clones.filter(fClone => !preClones.find(clone => clone === fClone));
        reSupport.global.clones.push(...myClones);
    }
    return reSupport;
}
//# sourceMappingURL=renderSubjectComponent.function.js.map