export function isLastRunMatched(strings, values, lastRun) {
    if (lastRun) {
        if (lastRun.strings.length === strings.length) {
            const stringsMatch = lastRun.strings.every((string, index) => 
            // string.length === strings[index].length
            string === strings[index]);
            if (stringsMatch && lastRun.values.length === values.length) {
                return true; // performance savings using the last time this component was rendered
            }
        }
    }
    return false;
}
//# sourceMappingURL=isLastRunMatched.function.js.map