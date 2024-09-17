export function getStringsId(strings) {
    const array = strings.map(x => x.length);
    array.push(strings.length);
    return Number(array.join(''));
}
//# sourceMappingURL=getStringsId.function.js.map