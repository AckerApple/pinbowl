import { setLet } from "./setLet.function.js";
/** When an item in watch array changes, callback function will be triggered */
export function watch(currentValues, callback) {
    let previousValues = setLet(undefined)(x => [previousValues, previousValues = x]);
    if (previousValues === undefined) {
        callback(currentValues, previousValues);
        const result = { currentValues, previousValues };
        previousValues = currentValues;
        return currentValues;
    }
    const allExact = currentValues.every((item, index) => item === previousValues[index]);
    if (allExact) {
        return currentValues;
    }
    callback(currentValues, previousValues);
    previousValues = currentValues;
    return currentValues;
}
//# sourceMappingURL=watch.function.js.map