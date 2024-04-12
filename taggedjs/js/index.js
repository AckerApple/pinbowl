// import { redrawTag } from "./redrawTag.function"
import { tagElement } from "./tagElement";
export * from "./ElementTargetEvent.interface";
export * from "./tag";
export * from "./html";
export * from "./errors";
export * from "./subject/index";
export * from "./isInstance";
export * from "./watch.function";
export * from "./TagSupport.class";
// export * from "./redrawTag.function"
export * from "./interpolateElement";
// TODO: export *
export { tagElement } from "./tagElement";
export { Tag } from "./Tag.class";
export { runBeforeRender } from "./tagRunner";
export { setUse } from "./setUse.function";
/* hooks */
// TODO: export *
export { providers } from "./providers";
export { set } from "./set.function";
export { setLet } from "./setLet.function";
export { setProp } from "./setProp.function";
export * from "./onInit";
export * from "./onDestroy";
export * from "./getCallback";
/* end: hooks */
export const hmr = {
    tagElement,
    // redrawTag
};
//# sourceMappingURL=index.js.map