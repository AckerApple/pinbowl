import { bindSubjectCallback } from "./bindSubjectCallback.function";
import { ValueSubject } from "./subject/ValueSubject";
export function getSubjectFunction(value, tag) {
    return new ValueSubject(bindSubjectCallback(value, tag));
}
//# sourceMappingURL=Tag.utils.js.map