export * from './tag/index.js';
export * from './errors.js';
export * from './subject.types.js';
export * from './isInstance.js';
export * from './state/index.js';
export * from './subject/index.js';
export * from './tag/TagSupport.class.js';
export * from './interpolations/ElementTargetEvent.interface.js';
export * from './interpolations/interpolateElement.js';
export * from './interpolations/InsertBefore.type.js';
export { tagElement } from './tag/tagElement.js';
export { Tag, variablePrefix } from './tag/Tag.class.js';
export { runBeforeRender } from './tag/tagRunner.js';
export { renderTagSupport } from './tag/render/renderTagSupport.function.js';
export { renderWithSupport } from './tag/render/renderWithSupport.function.js';
export { isLikeValueSets } from './tag/isLikeTags.function.js';
import { renderTagOnly } from './tag/render/renderTagOnly.function.js';
import { renderTagSupport } from './tag/render/renderTagSupport.function.js';
import { renderWithSupport } from './tag/render/renderWithSupport.function.js';
import { tagElement } from './tag/tagElement.js';
export const hmr = {
    tagElement, renderWithSupport, renderTagSupport,
    renderTagOnly,
};
//# sourceMappingURL=index.js.map