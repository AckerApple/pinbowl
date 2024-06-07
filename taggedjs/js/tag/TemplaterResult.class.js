import { Tag } from './Tag.class.js';
import { ValueSubject } from '../subject/index.js';
import { kidsToTagArraySubject } from './kidsToTagArraySubject.function.js';
export class TemplaterResult {
    props;
    tagJsType = 'templater';
    tagged;
    wrapper;
    madeChildIntoSubject;
    tag;
    children = new ValueSubject([]);
    arrayValue; // used for tag components used in arrays
    constructor(props) {
        this.props = props;
    }
    key(arrayValue) {
        this.arrayValue = arrayValue;
        return this;
    }
    html(strings, ...values) {
        const children = new Tag(strings, values);
        const childSubject = kidsToTagArraySubject(children, this);
        this.children = childSubject;
        return this;
    }
}
//# sourceMappingURL=TemplaterResult.class.js.map