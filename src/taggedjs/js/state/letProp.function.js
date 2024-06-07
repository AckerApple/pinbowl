import { letState } from './letState.function.js';
import { watch } from './watch.function.js';
/**
 * Enables the ability to maintain a change to a props value until the prop itself changes
 * @param prop typically the name of an existing prop
 * @returns immediately call the returned function: letProp(y)(x => [y, y=x])
 */
export function letProp(prop) {
    return getSetProp => {
        let myProp = letState(prop)(getSetProp);
        watch([prop], () => getSetProp(myProp = prop));
        getSetProp(myProp); // always reset to my value and right await so that the old prop value never slips through
        return myProp;
    };
}
//# sourceMappingURL=letProp.function.js.map