export function addSupportEventListener(support, eventName, element, callback) {
    const elm = support.appElement;
    // cast events that do not bubble up into ones that do
    if (eventName === 'blur') {
        eventName = 'focusout';
    }
    const replaceEventName = '_' + eventName;
    // const replaceEventName = eventName
    const global = support.subject.global;
    const eventReg = global.events;
    if (!eventReg[eventName]) {
        const listener = function eventCallback(event) {
            event.originalStopPropagation = event.stopPropagation;
            bubbleEvent(event, replaceEventName, event.target);
        };
        eventReg[eventName] = listener;
        elm.addEventListener(eventName, listener);
    }
    // attach to element but not as "_click" and "_keyup"
    ;
    element[replaceEventName] = callback;
    element[eventName] = callback;
}
function bubbleEvent(event, replaceEventName, target) {
    const callback = target[replaceEventName];
    if (callback) {
        let stopped = false;
        event.stopPropagation = function () {
            stopped = true;
            event.originalStopPropagation.call(event);
        };
        callback(event);
        if (event.defaultPrevented || stopped) {
            return;
        }
    }
    const parentNode = target.parentNode;
    if (parentNode) {
        bubbleEvent(event, replaceEventName, parentNode);
    }
}
//# sourceMappingURL=addSupportEventListener.function.js.map