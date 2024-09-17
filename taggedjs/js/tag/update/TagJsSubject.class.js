import { Subject, defineValueOn } from '../../subject/Subject.class.js';
import { ValueSubject } from '../../subject/ValueSubject.js';
import { ValueTypes } from '../ValueTypes.enum.js';
import { getValueType } from '../getValueType.function.js';
export class TagJsSubject extends ValueSubject {
    tagJsType = ValueTypes.tagJsSubject;
    // travels with all renderings
    global = getNewGlobal();
    constructor(value, valueType) {
        super(value);
        this.global.nowValueType = valueType || getValueType(value);
        defineValueOn(this); // if you extend this AND have a constructor, you must call this in your extension
    }
}
export function getNewGlobal() {
    return {
        destroy$: new Subject(),
        context: [], // populated after reading interpolated.values array converted to an object {variable0, variable:1}
        providers: [],
        /** Indicator of re-rending. Saves from double rending something already rendered */
        renderCount: 0,
        subscriptions: [],
        oldest: undefined, // TODO: This needs to addressed
        blocked: [], // renders that did not occur because an event was processing
        childTags: [], // tags on me
        htmlDomMeta: [],
    };
}
//# sourceMappingURL=TagJsSubject.class.js.map