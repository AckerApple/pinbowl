import { Tag } from './tag/Tag.class';
import { kidsToTagArraySubject } from './tag/tag';
import { ValueSubject } from './subject';
export class TemplaterResult {
    props;
    tagJsType = 'templater';
    tagged;
    wrapper;
    madeChildIntoSubject = false;
    tag;
    children = new ValueSubject([]);
    constructor(props) {
        this.props = props;
    }
    html(strings, ...values) {
        const children = new Tag(strings, values);
        const { childSubject, madeSubject } = kidsToTagArraySubject(children);
        this.children = childSubject;
        this.madeChildIntoSubject = madeSubject;
        return this;
    }
}
//# sourceMappingURL=TemplaterResult.class.js.map