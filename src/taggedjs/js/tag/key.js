/** Used to give unique value to an array of tag content. Should not be an object */
export function key(arrayValue) {
    return {
        set html(newValue) {
            newValue.arrayValue = arrayValue;
        }
    };
}
//# sourceMappingURL=key.js.map