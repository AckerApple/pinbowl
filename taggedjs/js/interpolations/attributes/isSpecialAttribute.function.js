/** Looking for (class | style) followed by a period */
export function isSpecialAttr(attrName) {
    if (attrName.startsWith('class.')) {
        return 'class';
    }
    const specialAction = isSpecialAction(attrName);
    if (specialAction) {
        return true;
    }
    if (attrName.startsWith('style.')) {
        return 'style';
    }
    return false;
}
export function isSpecialAction(attrName) {
    switch (attrName) {
        case 'autoselect':
            return 'autoselect';
        case 'autofocus':
            return 'autofocus';
        case 'oninit':
            return 'oninit';
    }
    return false;
}
//# sourceMappingURL=isSpecialAttribute.function.js.map