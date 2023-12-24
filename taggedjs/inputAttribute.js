export function inputAttribute(name, value, element) {
    const names = name.split('.');
    // style.position = "absolute"
    if (names[0] === 'style') {
        element.style[names[1]] = value;
    }
    // Example: class.width-full = "true"
    if (names[0] === 'class') {
        names.pop();
        if (value) {
            names.forEach(name => element.classList.remove(name));
        }
        else {
            names.forEach(name => element.classList.add(name));
        }
        return;
    }
}
//# sourceMappingURL=inputAttribute.js.map