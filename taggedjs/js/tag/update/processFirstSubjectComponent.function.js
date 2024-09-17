import { processFirstTagResult, processReplaceTagResult } from './processTagResult.function.js';
import { getSupport } from '../Support.class.js';
import { renderWithSupport } from '../render/renderWithSupport.function.js';
import { ValueTypes } from '../ValueTypes.enum.js';
import { getCastedProps } from '../getTagWrap.function.js';
export function processReplacementComponent(templater, subject, ownerSupport, counts) {
    // TODO: This below check not needed in production mode
    // validateTemplater(templater)
    const newSupport = getSupport(templater, ownerSupport, ownerSupport.appSupport, subject);
    const newPropsConfig = newSupport.propsConfig;
    if (newPropsConfig) {
        const castedProps = templater.tagJsType !== ValueTypes.tagComponent ? [] : getCastedProps(templater, newSupport);
        newPropsConfig.castProps = castedProps;
    }
    const global = subject.global;
    const { support } = renderWithSupport(newSupport, global.newest, // existing tag
    subject, ownerSupport);
    processReplaceTagResult(support, counts, subject);
    return support;
}
export function processFirstSubjectComponent(templater, subject, ownerSupport, counts, appendTo) {
    // TODO: This below check not needed in production mode
    // validateTemplater(templater)
    const newSupport = getSupport(templater, ownerSupport, ownerSupport.appSupport, subject);
    const newPropsConfig = newSupport.propsConfig;
    if (newPropsConfig) {
        const castedProps = templater.tagJsType !== ValueTypes.tagComponent ? [] : getCastedProps(templater, newSupport);
        newPropsConfig.castProps = castedProps;
    }
    const global = subject.global;
    const { support } = renderWithSupport(newSupport, global.newest, // existing tag   
    subject, ownerSupport);
    processFirstTagResult(support, counts, appendTo);
    return support;
}
//# sourceMappingURL=processFirstSubjectComponent.function.js.map