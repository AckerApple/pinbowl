export * from "./tag";
export * from "./html";
export * from "./errors";
export * from "./isInstance";
export * from "./state/index";
export * from "./subject/index";
export * from "./TagSupport.class";
export * from "./ElementTargetEvent.interface";
export * from "./interpolations/interpolateElement";
export { tagElement } from "./tagElement";
export { Tag } from "./Tag.class";
export { runBeforeRender } from "./tagRunner";
export { renderTagSupport } from "./renderTagSupport.function";
export { renderWithSupport } from "./renderWithSupport.function";
import { renderTagSupport } from "./renderTagSupport.function";
import { renderWithSupport } from "./renderWithSupport.function";
import { tagElement } from "./tagElement";
export const hmr = {
    tagElement, renderWithSupport, renderTagSupport,
};
//# sourceMappingURL=index.js.map