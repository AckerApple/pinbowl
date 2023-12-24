export function wait(ms) {
    return new Promise(res => {
        setTimeout(() => {
            res(0);
        }, ms);
    });
}
//# sourceMappingURL=wait.js.map