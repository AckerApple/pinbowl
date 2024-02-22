/** Must use .js and NOT .ts extensions here */
import { redrawTag } from "./redrawTag.function.js";
import { tagElement } from "./tagElement.js";
export * from "./ElementTargetEvent.interface.js";
export * from "./tag.js";
export * from "./html.js";
export * from "./errors.js";
export * from "./Subject.js";
export * from "./isInstance.js";
export * from "./ValueSubject.js";
export * from "./TagSupport.class.js";
export * from "./gateway/index.js";
export * from "./redrawTag.function.js";
export * from "./interpolateElement.js";
export { tagElement } from "./tagElement.js";
export { Tag } from "./Tag.class.js";
export { runBeforeRender } from "./tagRunner.js";
export { setUse } from "./setUse.function.js";
/* hooks */
// TODO: export *
export { providers } from "./providers.js";
// TODO: export *
export { state } from "./state.js";
export * from "./onInit.js";
export * from "./onDestroy.js";
export * from "./getCallback.js";
/* end: hooks */
export const hmr = {
    tagElement, redrawTag
};
//# sourceMappingURL=index.js.map