export function elementInitCheck(nextSibling, counts) {
    const onInitDoubleWrap = nextSibling.oninit;
    if (!onInitDoubleWrap) {
        return;
    }
    const onInitWrap = onInitDoubleWrap.tagFunction;
    if (!onInitWrap) {
        return;
    }
    const onInit = onInitWrap.tagFunction;
    if (!onInit) {
        return;
    }
    const event = { target: nextSibling, stagger: counts.added };
    onInit(event);
    ++counts.added;
}
//# sourceMappingURL=elementInitCheck.js.map