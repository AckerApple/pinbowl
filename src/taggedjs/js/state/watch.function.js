import { letState } from './letState.function';
/**
 * When an item in watch array changes, callback function will be triggered. Does not trigger on initial watch setup.
 * @param currentValues T[]
 * @param callback WatchCallback
 * @returns T[]
 */
export function watch(currentValues, callback) {
    let previousValues = letState(undefined)(x => [previousValues, previousValues = x]);
    // First time running watch?
    if (previousValues === undefined) {
        // callback(currentValues, previousValues) // do not call during init
        previousValues = currentValues;
        return currentValues;
    }
    const allExact = currentValues.every((item, index) => item === previousValues[index]);
    if (allExact) {
        return currentValues;
    }
    callback(currentValues, previousValues);
    previousValues.length = 0;
    previousValues.push(...currentValues);
    return currentValues;
}
//# sourceMappingURL=watch.function.js.map