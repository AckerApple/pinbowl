import { BasicTypes, ValueTypes } from './ValueTypes.enum.js';
export function isLikeTags(support0, // new
support1) {
    const templater0 = support0.templater;
    const templater1 = support1.templater;
    const tag0 = templater0?.tag || support0;
    const tag1 = templater1.tag; // || (support1 as any)
    if (templater0?.tagJsType === ValueTypes.stateRender) {
        return templater0.dom === templater1.dom;
    }
    if (tag0.tagJsType === ValueTypes.dom) {
        return isLikeDomTags(tag0, tag1);
    }
    const like = isLikeStringTags(tag0, tag1, support0, support1);
    return like;
}
// used when compiler was used
export function isLikeDomTags(tag0, tag1) {
    const domMeta0 = tag0.dom;
    const domMeta1 = tag1.dom;
    return domMeta0 === domMeta1;
}
// used for no compiling
function isLikeStringTags(tag0, tag1, support0, // new
support1) {
    const strings0 = tag0.strings;
    const strings1 = tag1.strings;
    if (strings0.length !== strings1.length) {
        return false;
    }
    const everyStringMatched = strings0.every((string, index) => strings1[index].length === string.length // performance, just compare length of strings // TODO: Document this
    // strings1[index] === string // slower
    );
    if (!everyStringMatched) {
        return false;
    }
    const values0 = support0.templater.values || tag0.values;
    const values1 = support1.templater.values || tag1.values;
    return isLikeValueSets(values0, values1);
}
export function isLikeValueSets(values0, values1) {
    const valuesLengthsMatch = values0.length === values1.length;
    if (!valuesLengthsMatch) {
        return false;
    }
    const allVarsMatch = values1.every((value, index) => {
        const compareTo = values0[index];
        const isFunctions = typeof (value) === BasicTypes.function && typeof (compareTo) === BasicTypes.function;
        if (isFunctions) {
            const stringMatch = value.toString() === compareTo.toString();
            if (stringMatch) {
                return true;
            }
            return false;
        }
        return true;
    });
    if (allVarsMatch) {
        return true;
    }
    return false;
}
//# sourceMappingURL=isLikeTags.function.js.map