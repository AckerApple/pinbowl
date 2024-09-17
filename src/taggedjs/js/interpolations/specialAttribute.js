const style = 'style';
const classS = 'class';
export function specialAttribute(name, value, element) {
    const names = name.split('.');
    // style.position = "absolute"
    if (names[0] === style) {
        element.style[names[1]] = value;
    }
    // Example: class.width-full = "true"
    if (names[0] === classS) {
        names.shift();
        if (value) {
            for (let index = 0; index < names.length; ++index) {
                element.classList.add(names[index]);
            }
        }
        else {
            for (let index = 0; index < names.length; ++index) {
                element.classList.remove(names[index]);
            }
        }
    }
}
//# sourceMappingURL=specialAttribute.js.map