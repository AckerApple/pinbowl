import { hasPropChanges } from './hasPropChanges.function.js';
export function hasTagSupportChanged(lastSupport, newTagSupport, newTemplater) {
    /*if(lastSupport.templater.tag) {
      const oldStringLength = lastSupport.templater.tag?.strings.length
      const newStringLength = newTemplater.tag?.strings.length
      if( oldStringLength !== newStringLength ) {
        console.log('oldStringLength !== newStringLength', {
          oldStringLength, newStringLength,
          oldWrapper: lastSupport.templater.wrapper,
          newWrapper: newTemplater.wrapper,
          newTag: newTemplater.tag,
          tagJsType0: newTemplater.tagJsType,
          tagJsType1: lastSupport.templater.tagJsType,
        })
        return 1
      }
    }*/
    const latestProps = newTemplater.props; // newTagSupport.propsConfig.latest
    const pastCloneProps = lastSupport.propsConfig.latestCloned;
    const propsChanged = hasPropChanges(latestProps, pastCloneProps);
    // if no changes detected, no need to continue to rendering further tags
    if (propsChanged) {
        return propsChanged;
    }
    const propsChanged2 = hasPropChanges(lastSupport.propsConfig.latestCloned, newTagSupport.propsConfig.latestCloned);
    if (propsChanged2) {
        return propsChanged2;
    }
    const kidsChanged = hasKidsChanged(lastSupport, newTagSupport);
    // we already know props didn't change and if kids didn't either, than don't render
    return kidsChanged;
}
export function hasKidsChanged(oldTagSupport, newTagSupport) {
    const oldCloneKidValues = oldTagSupport.propsConfig.lastClonedKidValues;
    const newClonedKidValues = newTagSupport.propsConfig.lastClonedKidValues;
    const everySame = oldCloneKidValues.every((set, index) => {
        const x = newClonedKidValues[index];
        return set.every((item, index) => item === x[index]);
    });
    return everySame ? false : 9;
}
//# sourceMappingURL=hasTagSupportChanged.function.js.map