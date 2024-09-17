import { clonePropsBy } from './clonePropsBy.function.js';
import { Subject } from '../subject/Subject.class.js';
/** used only for apps, otherwise use Support */
export function getBaseSupport(templater, subject, castedProps) {
    const baseSupport = {
        templater,
        subject,
        castedProps,
        state: [], // TODO: this is not needed for every type of  tag
        appSupport: undefined,
    };
    baseSupport.appSupport = baseSupport;
    const global = subject.global;
    global.blocked = [];
    global.destroy$ = new Subject();
    const props = templater.props; // natural props
    if (props) {
        baseSupport.propsConfig = clonePropsBy(baseSupport, props, castedProps);
    }
    return baseSupport;
}
export function getSupport(templater, // at runtime rendering of a tag, it needs to be married to a new Support()
ownerSupport, appSupport, subject, castedProps) {
    const support = getBaseSupport(templater, subject, castedProps);
    support.ownerSupport = ownerSupport;
    support.appSupport = appSupport;
    return support;
}
export function getHtmlSupport(templater, // at runtime rendering of a tag, it needs to be married to a new Support()
ownerSupport, appSupport, subject, castedProps) {
    const support = {
        templater,
        subject,
        castedProps,
        appSupport: undefined,
    };
    support.ownerSupport = ownerSupport;
    support.appSupport = appSupport;
    return support;
}
//# sourceMappingURL=Support.class.js.map