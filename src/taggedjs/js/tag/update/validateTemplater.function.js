import { isTagComponent } from '../../isInstance.js';
export function validateTemplater(templater) {
    // Check if function component is wrapped in a tag() call
    if (isTagComponent(templater)) {
        return;
    }
    const wrapper = templater.wrapper;
    const original = wrapper?.parentWrap.original || templater;
    let name = original.name || original.constructor?.name;
    if (name === 'Function') {
        name = undefined;
    }
    const label = name || original.toString().substring(0, 120);
    const error = new Error(`Not a tag component. Wrap your function with tag(). Example tag(props => html\`\`) on component:\n\n${label}\n\n`);
    throw error;
}
//# sourceMappingURL=validateTemplater.function.js.map