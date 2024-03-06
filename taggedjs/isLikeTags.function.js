export function isLikeTags(tag0, tag1) {
    if (tag0.strings.length !== tag1.strings.length) {
        return false;
    }
    const everyStringMatched = tag0.strings.every((string, index) => tag1.strings[index] === string);
    if (!everyStringMatched) {
        return false;
    }
    const valuesLengthsMatch = tag0.values.length === tag1.values.length;
    if (!valuesLengthsMatch) {
        return false;
    }
    return true;
}
//# sourceMappingURL=isLikeTags.function.js.map