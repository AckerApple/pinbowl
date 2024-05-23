import { ValueSubject } from '../subject';
import { getSupportInCycle } from '../tag/getSupportInCycle.function';
import { setUse } from './setUse.function';
import { state } from './state.function';
import { syncStates } from './syncStates.function';
/**
 * When an item in watch array changes, callback function will be triggered. Triggers on initial watch setup. TIP: try watch.noInit()
 * @param currentValues T[]
 * @param callback WatchCallback
 * @returns T[]
 */
export const watch = ((currentValues, callback) => {
    return setupWatch(currentValues, callback);
});
const defaultFinally = (x) => x;
function newWatch(setup) {
    const method = (currentValues, callback) => {
        return setupWatch(currentValues, callback, setup);
    };
    method.setup = setup;
    defineOnMethod(() => method, method);
    return method;
}
/**
 * puts above functionality together
 * @param currentValues values being watched
 * @param callback (currentValue, previousValues) => resolveToValue
 * @param param2
 * @returns
 */
const setupWatch = (currentValues, callback, { init, before = () => true, final = defaultFinally, } = {}) => {
    let previous = state({
        pastResult: undefined,
        values: undefined,
    });
    const previousValues = previous.values;
    // First time running watch?
    if (previousValues === undefined) {
        if (!before(currentValues)) {
            previous.values = currentValues;
            return previous.pastResult; // do not continue
        }
        const castedInit = init || callback;
        const result = castedInit(currentValues, previousValues);
        previous.pastResult = final(result);
        previous.values = currentValues;
        return previous.pastResult;
    }
    const allExact = currentValues.every((item, index) => item === previousValues[index]);
    if (allExact) {
        return previous.pastResult;
    }
    if (!before(currentValues)) {
        previous.values = currentValues;
        return previous.pastResult; // do not continue
    }
    const result = callback(currentValues, previousValues);
    previous.pastResult = final(result);
    previousValues.length = 0;
    previousValues.push(...currentValues);
    return previous.pastResult;
};
function defineOnMethod(getWatch, attachTo) {
    Object.defineProperty(attachTo, 'noInit', {
        get() {
            const watch = getWatch();
            watch.setup.init = () => undefined;
            return watch;
        },
    });
    Object.defineProperty(attachTo, 'asSubject', {
        get() {
            const oldWatch = getWatch();
            const method = (currentValues, callback) => {
                const originalState = state(() => getSupportInCycle().memory.state);
                const subject = state(() => new ValueSubject(undefined));
                setupWatch(currentValues, (currentValues, previousValues) => {
                    const setTo = callback(currentValues, previousValues);
                    if (originalState.length) {
                        const newestState = setUse.memory.stateConfig.array;
                        syncStates(newestState, originalState);
                    }
                    subject.set(setTo);
                }, oldWatch.setup);
                return subject;
            };
            method.setup = oldWatch.setup;
            defineOnMethod(() => method, method);
            return method;
            /*
            method.setup = setup
          
            defineOnMethod(() => method as any, method)
            
            return method as any
      
            
            const oldWatch = getWatch()
            const watch = newWatch( oldWatch.setup )
            // const watch = getWatch()
            
            const subject = state(() => new Subject())
            watch.setup.final = (x: any) => {
              subject.set(x)
              return subject
            }
            return watch
            */
        },
    });
    Object.defineProperty(attachTo, 'truthy', {
        get() {
            const watch = getWatch();
            watch.setup.before = (currentValues) => currentValues.every(x => x);
            return watch;
        },
    });
    return attachTo;
}
defineOnMethod(() => newWatch({}), watch);
//# sourceMappingURL=watch.function.js.map