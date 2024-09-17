export function elementDestroyCheck(nextSibling, stagger) {
    const onDestroyDoubleWrap = nextSibling.ondestroy;
    const onDestroyWrap = onDestroyDoubleWrap.tagFunction;
    if (!onDestroyWrap) {
        return;
    }
    const onDestroy = onDestroyWrap.tagFunction;
    const event = {
        target: nextSibling,
        stagger
    };
    return onDestroy(event);
}
//# sourceMappingURL=elementDestroyCheck.function.js.map