import { setUseMemory } from '../state/setUse.function.js';
// Life cycle 2
export function runAfterRender(support, ownerSupport) {
    ++support.subject.renderCount;
    const config = setUseMemory.stateConfig;
    // TODO: only needed in development
    /*
    const rearray = config.rearray as unknown as State[]
    if(rearray.length && rearray.length !== config.array.length) {
      const message = `States lengths have changed ${rearray.length} !== ${config.array.length}. State tracking requires the same amount of function calls every render. Typically this errors is thrown when a state like function call occurs only for certain conditions or when a function is intended to be wrapped with a tag() call`
      const wrapper = support.templater?.wrapper as Wrapper
      const details = {
        oldStates: config.array,
        newStates: config.rearray,
        tagFunction: wrapper.parentWrap.original,
      }
      const error = new StateMismatchError(message,details)
      console.warn(message,details)
      throw error
    }
    */
    delete config.support;
    support.state = config.array;
    setUseMemory.tagClosed$.next(ownerSupport);
}
//# sourceMappingURL=afterRender.function.js.map