/******/ var __webpack_modules__ = ({

/***/ "./ts/TemplaterResult.class.ts":
/*!*************************************!*\
  !*** ./ts/TemplaterResult.class.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplaterResult: () => (/* binding */ TemplaterResult)
/* harmony export */ });
/* harmony import */ var _tag_Tag_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tag/Tag.class */ "./ts/tag/Tag.class.ts");
/* harmony import */ var _tag_tag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tag/tag */ "./ts/tag/tag.ts");
/* harmony import */ var _subject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./subject */ "./ts/subject/index.ts");



class TemplaterResult {
    props;
    isTemplater = true;
    tagged;
    wrapper;
    madeChildIntoSubject = false;
    tag;
    children = new _subject__WEBPACK_IMPORTED_MODULE_2__.ValueSubject([]);
    constructor(props) {
        this.props = props;
    }
    html(strings, ...values) {
        const children = new _tag_Tag_class__WEBPACK_IMPORTED_MODULE_0__.Tag(strings, values);
        const { childSubject, madeSubject } = (0,_tag_tag__WEBPACK_IMPORTED_MODULE_1__.kidsToTagArraySubject)(children);
        this.children = childSubject;
        this.madeChildIntoSubject = madeSubject;
        return this;
    }
}


/***/ }),

/***/ "./ts/alterProps.function.ts":
/*!***********************************!*\
  !*** ./ts/alterProps.function.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alterProps: () => (/* binding */ alterProps),
/* harmony export */   callbackPropOwner: () => (/* binding */ callbackPropOwner)
/* harmony export */ });
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tag/render/renderTagSupport.function */ "./ts/tag/render/renderTagSupport.function.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./state */ "./ts/state/index.ts");
/* harmony import */ var _tag_getSupportInCycle_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tag/getSupportInCycle.function */ "./ts/tag/getSupportInCycle.function.ts");





/* Used to rewrite props that are functions. When they are called it should cause parent rendering */
function alterProps(props, ownerSupport) {
    const isPropTag = (0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTag)(props);
    const watchProps = isPropTag ? 0 : props;
    const newProps = resetFunctionProps(watchProps, ownerSupport);
    return newProps;
}
function resetFunctionProps(newProps, ownerSupport) {
    if (typeof (newProps) !== 'object' || !ownerSupport) {
        return newProps;
    }
    // BELOW: Do not clone because if first argument is object, the memory ref back is lost
    // const newProps = {...props} 
    for (const name in newProps) {
        const value = newProps[name];
        if (!(value instanceof Function)) {
            continue;
        }
        const toCall = newProps[name].toCall;
        if (toCall) {
            continue; // already previously converted
        }
        newProps[name] = (...args) => newProps[name].toCall(...args); // what gets called can switch over parent state changes
        // Currently, call self but over parent state changes, I may need to call a newer parent tag owner
        newProps[name].toCall = (...args) => callbackPropOwner(value, args, ownerSupport);
        newProps[name].original = value;
    }
    return newProps;
}
function callbackPropOwner(toCall, callWith, ownerSupport) {
    // const renderCount = ownerSupport.global.renderCount
    const cycle = (0,_tag_getSupportInCycle_function__WEBPACK_IMPORTED_MODULE_4__.getSupportInCycle)();
    const result = toCall(...callWith);
    const run = () => {
        const lastestOwner = ownerSupport.global.newest;
        if (cycle) {
            // appears a prop function was called sync/immediately so lets see if owner changed state
            const allMatched = lastestOwner.memory.state.every(state => {
                const lastValue = state.lastValue;
                const get = state.get();
                const equal = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepEqual)((0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(lastValue), get);
                return equal;
            });
            if (allMatched) {
                return result; // owner did not change
            }
        }
        const newest = (0,_tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_2__.renderTagSupport)(lastestOwner, true);
        lastestOwner.global.newest = newest;
        return result;
    };
    if (!cycle) {
        return run();
    }
    _state__WEBPACK_IMPORTED_MODULE_3__.setUse.memory.tagClosed$.toCallback(run);
    return result;
}


/***/ }),

/***/ "./ts/deepFunctions.ts":
/*!*****************************!*\
  !*** ./ts/deepFunctions.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deepClone: () => (/* binding */ deepClone),
/* harmony export */   deepEqual: () => (/* binding */ deepEqual)
/* harmony export */ });
function deepClone(obj) {
    return makeDeepClone(obj, new WeakMap());
}
function makeDeepClone(obj, visited) {
    // If obj is a primitive type or null, return it directly
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // If obj is already visited, return the cloned reference
    if (visited.has(obj)) {
        return visited.get(obj);
    }
    // Handle special cases like Date and RegExp
    if (obj instanceof Date) {
        return new Date(obj);
    }
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }
    // Create an empty object or array with the same prototype
    const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
    // Register the cloned object to avoid cyclic references
    visited.set(obj, clone);
    // Clone each property or element of the object or array
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            clone[i] = makeDeepClone(obj[i], visited);
        }
    }
    else {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = makeDeepClone(obj[key], visited);
            }
        }
    }
    return clone;
}
function deepEqual(obj1, obj2) {
    return isDeepEqual(obj1, obj2, new WeakMap());
}
function isDeepEqual(obj1, obj2, visited) {
    const directEqual = obj1 === obj2;
    if (directEqual || isSameFunctions(obj1, obj2)) {
        return true;
    }
    // If obj is already visited, return the cloned reference
    if (visited.has(obj1)) {
        return true;
    }
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
        // both are dates and were already determined not the same
        if (obj1 instanceof Date && obj2 instanceof Date) {
            return obj1.getTime() === obj2.getTime();
        }
        // Register the cloned object to avoid cyclic references
        visited.set(obj1, 0);
        // Check if obj1 and obj2 are both arrays
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            return isArrayDeepEqual(obj1, obj2, visited);
        }
        else if (Array.isArray(obj1) || Array.isArray(obj2)) {
            // One is an array, and the other is not
            return false;
        }
        return isObjectDeepEqual(obj1, obj2, visited);
    }
    return false;
}
function isObjectDeepEqual(obj1, obj2, visited) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length === 0 && keys2.length === 0) {
        return true;
    }
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const keyFound = keys2.includes(key);
        if (!keyFound || !isDeepEqual(obj1[key], obj2[key], visited)) {
            return false;
        }
    }
    return true;
}
function isArrayDeepEqual(obj1, obj2, visited) {
    if (obj1.length !== obj2.length) {
        return false;
    }
    for (let i = 0; i < obj1.length; i++) {
        if (!isDeepEqual(obj1[i], obj2[i], visited)) {
            return false;
        }
    }
    return true;
}
function isSameFunctions(fn0, fn1) {
    const bothFunction = fn0 instanceof Function && fn1 instanceof Function;
    return bothFunction && fn0.toString() === fn1.toString();
}


/***/ }),

/***/ "./ts/errors.ts":
/*!**********************!*\
  !*** ./ts/errors.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArrayNoKeyError: () => (/* binding */ ArrayNoKeyError),
/* harmony export */   StateMismatchError: () => (/* binding */ StateMismatchError),
/* harmony export */   SyncCallbackError: () => (/* binding */ SyncCallbackError),
/* harmony export */   TagError: () => (/* binding */ TagError)
/* harmony export */ });
class TagError extends Error {
    details;
    constructor(message, errorCode, details = {}) {
        super(message);
        this.name = TagError.name;
        this.details = { ...details, errorCode };
    }
}
class ArrayNoKeyError extends TagError {
    constructor(message, details) {
        super(message, 'array-no-key-error', details);
        this.name = ArrayNoKeyError.name;
    }
}
class StateMismatchError extends TagError {
    constructor(message, details) {
        super(message, 'state-mismatch-error', details);
        this.name = StateMismatchError.name;
    }
}
class SyncCallbackError extends TagError {
    constructor(message, details) {
        super(message, 'sync-callback-error', details);
        this.name = SyncCallbackError.name;
    }
}


/***/ }),

/***/ "./ts/insertAfter.function.ts":
/*!************************************!*\
  !*** ./ts/insertAfter.function.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   insertAfter: () => (/* binding */ insertAfter)
/* harmony export */ });
// Function to insert element after reference element
function insertAfter(newNode, referenceNode) {
    const parentNode = referenceNode.parentNode;
    parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


/***/ }),

/***/ "./ts/interpolations/ElementTargetEvent.interface.ts":
/*!***********************************************************!*\
  !*** ./ts/interpolations/ElementTargetEvent.interface.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./ts/interpolations/afterInterpolateElement.function.ts":
/*!***************************************************************!*\
  !*** ./ts/interpolations/afterInterpolateElement.function.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterInterpolateElement: () => (/* binding */ afterInterpolateElement)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../render */ "./ts/render.ts");
/* harmony import */ var _interpolateTemplate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interpolateTemplate */ "./ts/interpolations/interpolateTemplate.ts");


function afterInterpolateElement(container, insertBefore, tagSupport, context, options) {
    const clones = (0,_render__WEBPACK_IMPORTED_MODULE_0__.buildClones)(container, insertBefore);
    if (!clones.length) {
        return clones;
    }
    for (let index = clones.length - 1; index >= 0; --index) {
        const clone = clones[index];
        (0,_interpolateTemplate__WEBPACK_IMPORTED_MODULE_1__.afterElmBuild)(clone, options, context, tagSupport);
        tagSupport.clones.push(clone);
    }
    return clones;
}


/***/ }),

/***/ "./ts/interpolations/bindSubjectCallback.function.ts":
/*!***********************************************************!*\
  !*** ./ts/interpolations/bindSubjectCallback.function.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindSubjectCallback: () => (/* binding */ bindSubjectCallback),
/* harmony export */   runTagCallback: () => (/* binding */ runTagCallback)
/* harmony export */ });
/* harmony import */ var _tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tag/render/renderTagSupport.function */ "./ts/tag/render/renderTagSupport.function.ts");
/** File largely responsible for reacting to element events, such as onclick */

function bindSubjectCallback(value, tagSupport) {
    // Is this children? No override needed
    if (value.isChildOverride) {
        return value;
    }
    const subjectFunction = (element, args) => runTagCallback(value, tagSupport, element, args);
    // link back to original. Mostly used for <div oninit ondestroy> animations
    subjectFunction.tagFunction = value;
    return subjectFunction;
}
function runTagCallback(value, tagSupport, bindTo, args) {
    const myGlobal = tagSupport.global;
    const renderCount = myGlobal.renderCount;
    const method = value.bind(bindTo);
    const callbackResult = method(...args);
    const sameRenderCount = renderCount === myGlobal.renderCount;
    const skipRender = !sameRenderCount || myGlobal.deleted;
    // already rendered OR tag was deleted before event processing
    if (skipRender) {
        if (callbackResult instanceof Promise) {
            return callbackResult.then(() => {
                return 'promise-no-data-ever'; // tag was deleted during event processing
            });
        }
        return 'no-data-ever'; // already rendered
    }
    const newest = (0,_tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_0__.renderTagSupport)(myGlobal.newest, true);
    myGlobal.newest = newest;
    if (callbackResult instanceof Promise) {
        return callbackResult.then(() => {
            if (myGlobal.deleted) {
                return 'promise-no-data-ever'; // tag was deleted during event processing
            }
            const newest = (0,_tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_0__.renderTagSupport)(myGlobal.newest, true);
            myGlobal.newest = newest;
            return 'promise-no-data-ever';
        });
    }
    // Caller always expects a Promise
    return 'no-data-ever';
}


/***/ }),

/***/ "./ts/interpolations/elementInitCheck.ts":
/*!***********************************************!*\
  !*** ./ts/interpolations/elementInitCheck.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   elementInitCheck: () => (/* binding */ elementInitCheck)
/* harmony export */ });
function elementInitCheck(nextSibling, counts) {
    const onInitDoubleWrap = nextSibling.oninit;
    if (!onInitDoubleWrap) {
        return counts.added;
    }
    const onInitWrap = onInitDoubleWrap.tagFunction;
    if (!onInitWrap) {
        return counts.added;
    }
    const onInit = onInitWrap.tagFunction;
    if (!onInit) {
        return counts.added;
    }
    const event = { target: nextSibling, stagger: counts.added };
    onInit(event);
    return ++counts.added;
}


/***/ }),

/***/ "./ts/interpolations/inputAttribute.ts":
/*!*********************************************!*\
  !*** ./ts/interpolations/inputAttribute.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   inputAttribute: () => (/* binding */ inputAttribute)
/* harmony export */ });
function inputAttribute(name, value, element) {
    const names = name.split('.');
    // style.position = "absolute"
    if (names[0] === 'style') {
        element.style[names[1]] = value;
    }
    // Example: class.width-full = "true"
    if (names[0] === 'class') {
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


/***/ }),

/***/ "./ts/interpolations/interpolateAttributes.ts":
/*!****************************************************!*\
  !*** ./ts/interpolations/interpolateAttributes.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   interpolateAttributes: () => (/* binding */ interpolateAttributes)
/* harmony export */ });
/* harmony import */ var _processAttribute_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./processAttribute.function */ "./ts/interpolations/processAttribute.function.ts");

function howToSetAttribute(element, name, value) {
    element.setAttribute(name, value);
}
function howToSetInputValue(element, name, value) {
    element[name] = value;
}
function interpolateAttributes(child, scope, ownerSupport) {
    const attrNames = child.getAttributeNames();
    let howToSet = howToSetAttribute;
    for (let index = 0; index < attrNames.length; ++index) {
        const attrName = attrNames[index];
        if (child.nodeName === 'INPUT' && attrName === 'value') {
            howToSet = howToSetInputValue;
        }
        const value = child.getAttribute(attrName);
        (0,_processAttribute_function__WEBPACK_IMPORTED_MODULE_0__.processAttribute)(attrName, value, child, scope, ownerSupport, howToSet);
        howToSet = howToSetAttribute; // put back
    }
}


/***/ }),

/***/ "./ts/interpolations/interpolateContentTemplates.ts":
/*!**********************************************************!*\
  !*** ./ts/interpolations/interpolateContentTemplates.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   interpolateContentTemplates: () => (/* binding */ interpolateContentTemplates)
/* harmony export */ });
/* harmony import */ var _interpolateTemplate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interpolateTemplate */ "./ts/interpolations/interpolateTemplate.ts");

function interpolateContentTemplates(context, tagSupport, options, children) {
    // counting for animation stagger computing
    const counts = options.counts;
    const clones = [];
    const tagComponents = [];
    const childLength = children.length;
    for (let index = childLength - 1; index >= 0; --index) {
        const child = children[index];
        const { clones: nextClones, tagComponent } = (0,_interpolateTemplate__WEBPACK_IMPORTED_MODULE_0__.interpolateTemplate)(child, context, tagSupport, counts, options);
        clones.push(...nextClones);
        if (tagComponent) {
            tagComponents.push(tagComponent);
            continue;
        }
        if (child.children) {
            for (let index = child.children.length - 1; index >= 0; --index) {
                const subChild = child.children[index];
                // IF <template end /> its a variable to be processed
                if (isRenderEndTemplate(subChild)) {
                    const { tagComponent } = (0,_interpolateTemplate__WEBPACK_IMPORTED_MODULE_0__.interpolateTemplate)(subChild, context, tagSupport, counts, options);
                    if (tagComponent) {
                        tagComponents.push(tagComponent);
                    }
                }
                const { clones: nextClones, tagComponents: nextTagComponent } = interpolateContentTemplates(context, tagSupport, options, subChild.children);
                clones.push(...nextClones);
                tagComponents.push(...nextTagComponent);
            }
        }
    }
    return { clones, tagComponents };
}
function isRenderEndTemplate(child) {
    const isTemplate = child.tagName === 'TEMPLATE';
    return isTemplate &&
        child.getAttribute('interpolate') !== undefined &&
        child.getAttribute('end') !== undefined;
}


/***/ }),

/***/ "./ts/interpolations/interpolateElement.ts":
/*!*************************************************!*\
  !*** ./ts/interpolations/interpolateElement.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   interpolateElement: () => (/* binding */ interpolateElement),
/* harmony export */   interpolateString: () => (/* binding */ interpolateString)
/* harmony export */ });
/* harmony import */ var _interpolateAttributes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interpolateAttributes */ "./ts/interpolations/interpolateAttributes.ts");
/* harmony import */ var _interpolations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interpolations */ "./ts/interpolations/interpolations.ts");
/* harmony import */ var _interpolateContentTemplates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interpolateContentTemplates */ "./ts/interpolations/interpolateContentTemplates.ts");
/* harmony import */ var _tag_Tag_class__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../tag/Tag.class */ "./ts/tag/Tag.class.ts");




/** Review elements within an element */
function interpolateElement(container, // element containing innerHTML to review interpolations
context, // variables used to evaluate
interpolatedTemplates, ownerSupport, options) {
    const clones = [];
    const tagComponents = [];
    const result = interpolatedTemplates.interpolation;
    const template = container.children[0];
    const children = template.content.children;
    if (result.keys.length) {
        const { clones: nextClones, tagComponents: nextTagComponents } = (0,_interpolateContentTemplates__WEBPACK_IMPORTED_MODULE_2__.interpolateContentTemplates)(context, ownerSupport, options, children);
        clones.push(...nextClones);
        tagComponents.push(...nextTagComponents);
    }
    (0,_interpolateAttributes__WEBPACK_IMPORTED_MODULE_0__.interpolateAttributes)(template, context, ownerSupport);
    processChildrenAttributes(children, context, ownerSupport);
    return { clones, tagComponents };
}
function processChildrenAttributes(children, context, ownerSupport) {
    for (let index = children.length - 1; index >= 0; --index) {
        const child = children[index];
        (0,_interpolateAttributes__WEBPACK_IMPORTED_MODULE_0__.interpolateAttributes)(child, context, ownerSupport);
        if (child.children) {
            processChildrenAttributes(child.children, context, ownerSupport);
        }
    }
}
function interpolateString(string) {
    const result = (0,_interpolations__WEBPACK_IMPORTED_MODULE_1__.interpolateToTemplates)(string);
    result.string = result.string.replace(_tag_Tag_class__WEBPACK_IMPORTED_MODULE_3__.escapeSearch, _tag_Tag_class__WEBPACK_IMPORTED_MODULE_3__.variablePrefix);
    return result;
}


/***/ }),

/***/ "./ts/interpolations/interpolateTemplate.ts":
/*!**************************************************!*\
  !*** ./ts/interpolations/interpolateTemplate.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterElmBuild: () => (/* binding */ afterElmBuild),
/* harmony export */   interpolateTemplate: () => (/* binding */ interpolateTemplate),
/* harmony export */   subscribeToTemplate: () => (/* binding */ subscribeToTemplate)
/* harmony export */ });
/* harmony import */ var _tag_Tag_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tag/Tag.class */ "./ts/tag/Tag.class.ts");
/* harmony import */ var _elementInitCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./elementInitCheck */ "./ts/interpolations/elementInitCheck.ts");
/* harmony import */ var _tag_update_processFirstSubjectValue_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tag/update/processFirstSubjectValue.function */ "./ts/tag/update/processFirstSubjectValue.function.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _scanTextAreaValue_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scanTextAreaValue.function */ "./ts/interpolations/scanTextAreaValue.function.ts");
/* harmony import */ var _tag_update_updateExistingValue_function__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../tag/update/updateExistingValue.function */ "./ts/tag/update/updateExistingValue.function.ts");
/* harmony import */ var _tag_setTagPlaceholder_function__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../tag/setTagPlaceholder.function */ "./ts/tag/setTagPlaceholder.function.ts");







function interpolateTemplate(insertBefore, // <template end interpolate /> (will be removed)
context, // variable scope of {`__tagvar${index}`:'x'}
ownerSupport, // Tag class
counts, // used for animation stagger computing
options) {
    // TODO: THe clones array is useless here
    const clones = [];
    if (!insertBefore.hasAttribute('end')) {
        return { clones }; // only care about <template end>
    }
    const variableName = insertBefore.getAttribute('id');
    if (variableName?.substring(0, _tag_Tag_class__WEBPACK_IMPORTED_MODULE_0__.variablePrefix.length) !== _tag_Tag_class__WEBPACK_IMPORTED_MODULE_0__.variablePrefix) {
        return { clones }; // ignore, not a tagVar
    }
    const existingSubject = context[variableName];
    const isDynamic = (0,_isInstance__WEBPACK_IMPORTED_MODULE_3__.isTagComponent)(existingSubject.value) || (0,_isInstance__WEBPACK_IMPORTED_MODULE_3__.isTagArray)(existingSubject.value);
    // process dynamics later
    if (isDynamic) {
        return {
            clones,
            tagComponent: {
                variableName,
                ownerSupport,
                subject: existingSubject,
                insertBefore
            }
        };
    }
    subscribeToTemplate(insertBefore, existingSubject, ownerSupport, counts);
    return { clones };
}
function subscribeToTemplate(insertBefore, subject, ownerSupport, counts) {
    let called = false;
    const onValue = (value) => {
        if (called) {
            (0,_tag_update_updateExistingValue_function__WEBPACK_IMPORTED_MODULE_5__.updateExistingValue)(subject, value, ownerSupport, insertBefore);
            return;
        }
        const templater = value;
        (0,_tag_update_processFirstSubjectValue_function__WEBPACK_IMPORTED_MODULE_2__.processFirstSubjectValue)(templater, subject, insertBefore, ownerSupport, {
            counts: { ...counts },
        });
        called = true;
    };
    let mutatingCallback = onValue;
    const callback = (value) => mutatingCallback(value);
    const sub = subject.subscribe(callback);
    // on subscribe, the Subject did NOT emit immediately. Lets pull the template off the document
    if (insertBefore.parentNode) {
        const clone = subject.clone = (0,_tag_setTagPlaceholder_function__WEBPACK_IMPORTED_MODULE_6__.swapInsertBefore)(insertBefore);
        mutatingCallback = v => {
            const parentNode = clone.parentNode;
            parentNode.insertBefore(insertBefore, clone);
            parentNode.removeChild(clone);
            delete subject.clone;
            mutatingCallback = onValue; // all future calls will just produce value
            onValue(v); // calls for rending
        };
    }
    ownerSupport.global.subscriptions.push(sub);
}
function afterElmBuild(elm, options, context, ownerSupport) {
    if (!elm.getAttribute) {
        return;
    }
    const tagName = elm.nodeName; // elm.tagName
    if (tagName === 'TEXTAREA') {
        (0,_scanTextAreaValue_function__WEBPACK_IMPORTED_MODULE_4__.scanTextAreaValue)(elm, context, ownerSupport);
    }
    let diff = options.counts.added;
    diff = (0,_elementInitCheck__WEBPACK_IMPORTED_MODULE_1__.elementInitCheck)(elm, options.counts) - diff;
    if (elm.children) {
        const children = elm.children;
        for (let index = children.length - 1; index >= 0; --index) {
            const child = children[index];
            const subOptions = {
                ...options,
                counts: options.counts,
            };
            return afterElmBuild(child, subOptions, context, ownerSupport);
        }
    }
}


/***/ }),

/***/ "./ts/interpolations/interpolations.ts":
/*!*********************************************!*\
  !*** ./ts/interpolations/interpolations.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   interpolateReplace: () => (/* binding */ interpolateReplace),
/* harmony export */   interpolateToTemplates: () => (/* binding */ interpolateToTemplates)
/* harmony export */ });
// support arrow functions in attributes
const interpolateReplace = /(?:<[^>]*?(?:(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+)))*\s*)\/?>)|({__tagvar[^}]+})/g;
/** replaces ${x} with <template id="x-start"></template><template id="x-end"></template> */
function interpolateToTemplates(template) {
    const keys = [];
    const string = template.replace(interpolateReplace, (match, expression) => {
        if (match.startsWith('<')) {
            // If the match is an HTML tag, don't replace
            return match;
        }
        const noBraces = expression.substring(1, expression.length - 1);
        const id = noBraces;
        keys.push(id);
        return `<template interpolate end id="${id}"></template>`;
    });
    return { string, keys };
}


/***/ }),

/***/ "./ts/interpolations/processAttribute.function.ts":
/*!********************************************************!*\
  !*** ./ts/interpolations/processAttribute.function.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processAttribute: () => (/* binding */ processAttribute)
/* harmony export */ });
/* harmony import */ var _inputAttribute__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inputAttribute */ "./ts/interpolations/inputAttribute.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bindSubjectCallback.function */ "./ts/interpolations/bindSubjectCallback.function.ts");



const startRegX = /^\s*{__tagvar/;
const endRegX = /}\s*$/;
function isTagVar(value) {
    return value && value.search(startRegX) >= 0 && value.search(endRegX) >= 0;
}
function processAttribute(attrName, value, child, scope, ownerSupport, howToSet) {
    if (isTagVar(value)) {
        return processScopedNameValueAttr(attrName, value, child, scope, ownerSupport, howToSet);
    }
    if (isTagVar(attrName)) {
        const contextValueSubject = getContextValueByVarString(scope, attrName);
        let lastValue;
        // the above callback gets called immediately since its a ValueSubject()
        const sub = contextValueSubject.subscribe((value) => {
            processNameOnlyAttr(value, lastValue, child, ownerSupport, howToSet);
            lastValue = value;
        });
        ownerSupport.global.subscriptions.push(sub); // this is where unsubscribe is picked up
        child.removeAttribute(attrName);
        return;
    }
    // Non dynamic
    const isSpecial = isSpecialAttr(attrName);
    if (isSpecial) {
        return (0,_inputAttribute__WEBPACK_IMPORTED_MODULE_0__.inputAttribute)(attrName, value, child);
    }
}
function processScopedNameValueAttr(attrName, value, // {__tagVarN}
child, scope, ownerSupport, howToSet) {
    // get the code inside the brackets like "variable0" or "{variable0}"
    const result = getContextValueByVarString(scope, value);
    return processNameValueAttr(attrName, result, child, ownerSupport, howToSet);
}
function getContextValueByVarString(scope, value) {
    const code = value.replace('{', '').split('').reverse().join('').replace('}', '').split('').reverse().join('');
    return scope[code];
}
function processNameOnlyAttr(attrValue, lastValue, child, ownerSupport, howToSet) {
    if (lastValue && lastValue != attrValue) {
        if (typeof (lastValue) === 'string') {
            child.removeAttribute(lastValue);
        }
        else if (lastValue instanceof Object) {
            for (const name in lastValue) {
                child.removeAttribute(name);
            }
        }
    }
    if (typeof (attrValue) === 'string') {
        if (!attrValue.length) {
            return;
        }
        processNameValueAttr(attrValue, '', child, ownerSupport, howToSet);
        return;
    }
    if (attrValue instanceof Object) {
        for (const name in attrValue) {
            processNameValueAttr(name, attrValue[name], child, ownerSupport, howToSet);
        }
    }
}
function processNameValueAttr(attrName, result, child, ownerSupport, howToSet) {
    const isSpecial = isSpecialAttr(attrName);
    if (result instanceof Function) {
        const action = function (...args) {
            const result2 = result(child, args);
            return result2;
        };
        child[attrName].action = action;
    }
    // Most every variable comes in here since everything is made a ValueSubject
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isSubjectInstance)(result)) {
        child.removeAttribute(attrName);
        const callback = (newAttrValue) => {
            if (newAttrValue instanceof Function) {
                newAttrValue = (0,_bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_2__.bindSubjectCallback)(newAttrValue, ownerSupport);
            }
            return processAttributeSubjectValue(newAttrValue, child, attrName, isSpecial, howToSet);
        };
        // 🗞️ Subscribe. Above callback called immediately since its a ValueSubject()
        const sub = result.subscribe(callback);
        // Record subscription for later unsubscribe when element destroyed
        ownerSupport.global.subscriptions.push(sub);
        return;
    }
    howToSet(child, attrName, result);
    // child.setAttribute(attrName, result.value)
    return;
}
function processAttributeSubjectValue(newAttrValue, child, attrName, isSpecial, howToSet) {
    if (newAttrValue instanceof Function) {
        const fun = function (...args) {
            return newAttrValue(child, args);
        };
        // access to original function
        fun.tagFunction = newAttrValue;
        child[attrName] = fun;
        return;
    }
    if (isSpecial) {
        (0,_inputAttribute__WEBPACK_IMPORTED_MODULE_0__.inputAttribute)(attrName, newAttrValue, child);
        return;
    }
    if (newAttrValue) {
        howToSet(child, attrName, newAttrValue);
        return;
    }
    const isDeadValue = [undefined, false, null].includes(newAttrValue);
    if (isDeadValue) {
        child.removeAttribute(attrName);
        return;
    }
    // value is 0
    howToSet(child, attrName, newAttrValue);
}
/** Looking for (class | style) followed by a period */
function isSpecialAttr(attrName) {
    return attrName.search(/^(class|style)(\.)/) >= 0;
}


/***/ }),

/***/ "./ts/interpolations/scanTextAreaValue.function.ts":
/*!*********************************************************!*\
  !*** ./ts/interpolations/scanTextAreaValue.function.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scanTextAreaValue: () => (/* binding */ scanTextAreaValue)
/* harmony export */ });
/* harmony import */ var _processAttribute_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./processAttribute.function */ "./ts/interpolations/processAttribute.function.ts");

const search = new RegExp('\\s*<template interpolate end id="__tagvar(\\d{1,4})"([^>]*)></template>(\\s*)');
function scanTextAreaValue(textarea, context, ownerSupport) {
    const value = textarea.value;
    if (value.search(search) >= 0) {
        const match = value.match(/__tagvar(\d{1,4})/);
        const token = match ? match[0] : '';
        const dynamic = '{' + token + '}';
        textarea.value = '';
        textarea.setAttribute('text-var-value', dynamic);
        const howToSet = (_elm, _name, value) => textarea.value = value;
        (0,_processAttribute_function__WEBPACK_IMPORTED_MODULE_0__.processAttribute)('text-var-value', dynamic, // realValue, // context[token].value,
        textarea, context, ownerSupport, howToSet);
    }
}


/***/ }),

/***/ "./ts/isInstance.ts":
/*!**************************!*\
  !*** ./ts/isInstance.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isSubjectInstance: () => (/* binding */ isSubjectInstance),
/* harmony export */   isTag: () => (/* binding */ isTag),
/* harmony export */   isTagArray: () => (/* binding */ isTagArray),
/* harmony export */   isTagClass: () => (/* binding */ isTagClass),
/* harmony export */   isTagComponent: () => (/* binding */ isTagComponent),
/* harmony export */   isTagTemplater: () => (/* binding */ isTagTemplater)
/* harmony export */ });
function isTag(value) {
    return isTagTemplater(value) || isTagClass(value);
}
function isTagTemplater(value) {
    const templater = value;
    return templater?.isTemplater === true && templater.wrapper === undefined;
}
// TODO: whats the difference between isTagClass and isTagComponent
function isTagComponent(value) {
    return value?.wrapper?.parentWrap.original instanceof Function;
}
function isTagClass(value) {
    const templater = value;
    return templater?.isTagClass === true;
}
// isSubjectLike
function isSubjectInstance(subject) {
    return (subject?.isSubject === true || subject?.subscribe) ? true : false; // subject?.isSubject === true || 
}
function isTagArray(value) {
    return value instanceof Array && value.every(x => isTagClass(x) || isTagTemplater(x));
}


/***/ }),

/***/ "./ts/render.ts":
/*!**********************!*\
  !*** ./ts/render.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildClones: () => (/* binding */ buildClones)
/* harmony export */ });
function buildClones(temporary, insertBefore) {
    const clones = [];
    const template = temporary.children[0];
    let nextSibling = template.content.firstChild;
    const fragment = document.createDocumentFragment();
    while (nextSibling) {
        const nextNextSibling = nextSibling.nextSibling;
        clones.push(nextSibling);
        fragment.appendChild(nextSibling);
        nextSibling = nextNextSibling;
    }
    if (insertBefore.parentNode) {
        const parentNode = insertBefore.parentNode;
        parentNode.insertBefore(fragment, insertBefore);
    }
    return clones;
}


/***/ }),

/***/ "./ts/state/callbackMaker.function.ts":
/*!********************************************!*\
  !*** ./ts/state/callbackMaker.function.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   callback: () => (/* binding */ callback),
/* harmony export */   callbackMaker: () => (/* binding */ callbackMaker)
/* harmony export */ });
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");
/* harmony import */ var _tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tag/render/renderTagSupport.function */ "./ts/tag/render/renderTagSupport.function.ts");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../errors */ "./ts/errors.ts");
/* harmony import */ var _syncStates_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./syncStates.function */ "./ts/state/syncStates.function.ts");
/* harmony import */ var _tag_getSupportInCycle_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../tag/getSupportInCycle.function */ "./ts/tag/getSupportInCycle.function.ts");





let innerCallback = (callback) => (a, b, c, d, e, f) => {
    throw new _errors__WEBPACK_IMPORTED_MODULE_2__.SyncCallbackError('Callback function was called immediately in sync and must instead be call async');
};
const callbackMaker = () => innerCallback;
const originalGetter = innerCallback; // callbackMaker
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse)({
    beforeRender: (tagSupport) => initMemory(tagSupport),
    beforeRedraw: (tagSupport) => initMemory(tagSupport),
    afterRender: (tagSupport) => {
        ;
        tagSupport.global.callbackMaker = true;
        innerCallback = originalGetter; // prevent crossing callbacks with another tag
    },
});
function callback(callback) {
    const tagSupport = (0,_tag_getSupportInCycle_function__WEBPACK_IMPORTED_MODULE_4__.getSupportInCycle)();
    if (!tagSupport) {
        const error = new _errors__WEBPACK_IMPORTED_MODULE_2__.SyncCallbackError('callback() was called outside of synchronous rendering. Use `callback = callbackMaker()` to create a callback that could be called out of sync with rendering');
        throw error;
    }
    const oldState = _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.stateConfig.array;
    const trigger = (...args) => {
        const callbackMaker = tagSupport.global.callbackMaker;
        if (callbackMaker) {
            return triggerStateUpdate(tagSupport, callback, oldState, ...args);
        }
        return callback(...args);
    };
    return trigger;
}
function initMemory(tagSupport) {
    const oldState = _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.stateConfig.array;
    innerCallback = (callback) => {
        const trigger = (...args) => {
            const callbackMaker = tagSupport.global.callbackMaker;
            if (callbackMaker) {
                return triggerStateUpdate(tagSupport, callback, oldState, ...args);
            }
            return callback(...args);
        };
        return trigger;
    };
}
function triggerStateUpdate(tagSupport, callback, oldState, ...args) {
    const state = tagSupport.memory.state;
    // ensure that the oldest has the latest values first
    (0,_syncStates_function__WEBPACK_IMPORTED_MODULE_3__.syncStates)(state, oldState);
    // run the callback
    const maybePromise = callback(...args);
    // send the oldest state changes into the newest
    (0,_syncStates_function__WEBPACK_IMPORTED_MODULE_3__.syncStates)(oldState, state);
    /*
    if(tagSupport.global.deleted) {
      return maybePromise // While running callback the tag was deleted. Often that happens
    }
    */
    (0,_tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__.renderTagSupport)(tagSupport, false);
    if (maybePromise instanceof Promise) {
        maybePromise.finally(() => {
            // send the oldest state changes into the newest
            (0,_syncStates_function__WEBPACK_IMPORTED_MODULE_3__.syncStates)(oldState, state);
            (0,_tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__.renderTagSupport)(tagSupport, false);
        });
    }
    // return undefined as T
    return maybePromise;
}


/***/ }),

/***/ "./ts/state/children.ts":
/*!******************************!*\
  !*** ./ts/state/children.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   children: () => (/* binding */ children)
/* harmony export */ });
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");

function setCurrentTagSupport(support) {
    _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.childrenCurrentSupport = support;
}
function children() {
    const tagSupport = _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.childrenCurrentSupport;
    const children = tagSupport.templater.children;
    return children;
}
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse)({
    beforeRender: tagSupport => setCurrentTagSupport(tagSupport),
    beforeRedraw: tagSupport => setCurrentTagSupport(tagSupport),
});


/***/ }),

/***/ "./ts/state/index.ts":
/*!***************************!*\
  !*** ./ts/state/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   callback: () => (/* reexport safe */ _callbackMaker_function__WEBPACK_IMPORTED_MODULE_7__.callback),
/* harmony export */   callbackMaker: () => (/* reexport safe */ _callbackMaker_function__WEBPACK_IMPORTED_MODULE_7__.callbackMaker),
/* harmony export */   children: () => (/* reexport safe */ _children__WEBPACK_IMPORTED_MODULE_10__.children),
/* harmony export */   letProp: () => (/* reexport safe */ _letProp_function__WEBPACK_IMPORTED_MODULE_4__.letProp),
/* harmony export */   letState: () => (/* reexport safe */ _letState_function__WEBPACK_IMPORTED_MODULE_5__.letState),
/* harmony export */   onDestroy: () => (/* reexport safe */ _onDestroy__WEBPACK_IMPORTED_MODULE_9__.onDestroy),
/* harmony export */   onInit: () => (/* reexport safe */ _onInit__WEBPACK_IMPORTED_MODULE_8__.onInit),
/* harmony export */   providers: () => (/* reexport safe */ _providers__WEBPACK_IMPORTED_MODULE_6__.providers),
/* harmony export */   setUse: () => (/* reexport safe */ _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse),
/* harmony export */   state: () => (/* reexport safe */ _state_function__WEBPACK_IMPORTED_MODULE_2__.state),
/* harmony export */   subject: () => (/* reexport safe */ _subject_function__WEBPACK_IMPORTED_MODULE_3__.subject),
/* harmony export */   watch: () => (/* reexport safe */ _watch_function__WEBPACK_IMPORTED_MODULE_0__.watch)
/* harmony export */ });
/* harmony import */ var _watch_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watch.function */ "./ts/state/watch.function.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");
/* harmony import */ var _state_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state.function */ "./ts/state/state.function.ts");
/* harmony import */ var _subject_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./subject.function */ "./ts/state/subject.function.ts");
/* harmony import */ var _letProp_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./letProp.function */ "./ts/state/letProp.function.ts");
/* harmony import */ var _letState_function__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./letState.function */ "./ts/state/letState.function.ts");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./providers */ "./ts/state/providers.ts");
/* harmony import */ var _callbackMaker_function__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./callbackMaker.function */ "./ts/state/callbackMaker.function.ts");
/* harmony import */ var _onInit__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./onInit */ "./ts/state/onInit.ts");
/* harmony import */ var _onDestroy__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./onDestroy */ "./ts/state/onDestroy.ts");
/* harmony import */ var _children__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./children */ "./ts/state/children.ts");













/***/ }),

/***/ "./ts/state/letProp.function.ts":
/*!**************************************!*\
  !*** ./ts/state/letProp.function.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   letProp: () => (/* binding */ letProp)
/* harmony export */ });
/* harmony import */ var _letState_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./letState.function */ "./ts/state/letState.function.ts");
/* harmony import */ var _watch_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./watch.function */ "./ts/state/watch.function.ts");


/**
 * Enables the ability to maintain a change to a props value until the prop itself changes
 * @param prop typically the name of an existing prop
 * @returns immediately call the returned function: letProp(y)(x => [y, y=x])
 */
function letProp(prop) {
    return getSetProp => {
        let myProp = (0,_letState_function__WEBPACK_IMPORTED_MODULE_0__.letState)(prop)(getSetProp);
        (0,_watch_function__WEBPACK_IMPORTED_MODULE_1__.watch)([prop], () => getSetProp(myProp = prop));
        getSetProp(myProp);
        return myProp;
    };
}


/***/ }),

/***/ "./ts/state/letState.function.ts":
/*!***************************************!*\
  !*** ./ts/state/letState.function.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   letState: () => (/* binding */ letState)
/* harmony export */ });
/* harmony import */ var _state_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state.utils */ "./ts/state/state.utils.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");


/** Used for variables that need to remain the same variable during render passes */
function letState(defaultValue) {
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig;
    const rearray = config.rearray;
    let getSetMethod;
    const restate = rearray[config.array.length];
    if (restate) {
        let oldValue = (0,_state_utils__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(restate);
        getSetMethod = ((x) => [oldValue, oldValue = x]);
        const push = {
            get: () => (0,_state_utils__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(push),
            callback: getSetMethod,
            lastValue: oldValue,
            defaultValue: restate.defaultValue,
        };
        config.array.push(push);
        return makeStateResult(oldValue, push);
    }
    // State first time run
    const defaultFn = defaultValue instanceof Function ? defaultValue : () => defaultValue;
    let initValue = defaultFn();
    getSetMethod = ((x) => [initValue, initValue = x]);
    const push = {
        get: () => (0,_state_utils__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(push),
        callback: getSetMethod,
        lastValue: initValue,
        defaultValue: initValue,
    };
    config.array.push(push);
    return makeStateResult(initValue, push);
}
function makeStateResult(initValue, push) {
    // return initValue
    const result = (y) => {
        push.callback = y || (x => [initValue, initValue = x]);
        return initValue;
    };
    return result;
}


/***/ }),

/***/ "./ts/state/onDestroy.ts":
/*!*******************************!*\
  !*** ./ts/state/onDestroy.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   onDestroy: () => (/* binding */ onDestroy)
/* harmony export */ });
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");

function setCurrentTagSupport(support) {
    _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.destroyCurrentSupport = support;
}
function onDestroy(callback) {
    const tagSupport = _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.destroyCurrentSupport;
    tagSupport.global.destroyCallback = callback;
}
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse)({
    beforeRender: tagSupport => setCurrentTagSupport(tagSupport),
    beforeRedraw: tagSupport => setCurrentTagSupport(tagSupport),
    beforeDestroy: (tagSupport) => {
        const callback = tagSupport.global.destroyCallback;
        if (callback) {
            callback();
        }
    }
});


/***/ }),

/***/ "./ts/state/onInit.ts":
/*!****************************!*\
  !*** ./ts/state/onInit.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   onInit: () => (/* binding */ onInit)
/* harmony export */ });
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");

function setCurrentTagSupport(support) {
    _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.currentSupport = support;
}
function onInit(callback) {
    const tagSupport = _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.currentSupport;
    if (!tagSupport.global.init) {
        tagSupport.global.init = callback;
        callback(); // fire init
    }
}
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse)({
    beforeRender: tagSupport => setCurrentTagSupport(tagSupport),
    beforeRedraw: tagSupport => setCurrentTagSupport(tagSupport),
});


/***/ }),

/***/ "./ts/state/provider.utils.ts":
/*!************************************!*\
  !*** ./ts/state/provider.utils.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   providersChangeCheck: () => (/* binding */ providersChangeCheck)
/* harmony export */ });
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tag/render/renderTagSupport.function */ "./ts/tag/render/renderTagSupport.function.ts");


function providersChangeCheck(tagSupport) {
    const global = tagSupport.global;
    const providersWithChanges = global.providers.filter(provider => !(0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(provider.instance, provider.clone));
    // reset clones
    for (let index = providersWithChanges.length - 1; index >= 0; --index) {
        const provider = providersWithChanges[index];
        const appSupport = tagSupport.getAppTagSupport();
        handleProviderChanges(appSupport, provider);
        provider.clone = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(provider.instance);
    }
}
function handleProviderChanges(appSupport, provider) {
    const tagsWithProvider = getTagsWithProvider(appSupport, provider);
    for (let index = tagsWithProvider.length - 1; index >= 0; --index) {
        const { tagSupport, renderCount, provider } = tagsWithProvider[index];
        if (tagSupport.global.deleted) {
            continue; // i was deleted after another tag processed
        }
        const notRendered = renderCount === tagSupport.global.renderCount;
        if (notRendered) {
            provider.clone = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(provider.instance);
            (0,_tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__.renderTagSupport)(tagSupport, false);
            continue;
        }
    }
}
/** Updates and returns memory of tag providers */
function getTagsWithProvider(tagSupport, provider, memory = []) {
    const global = tagSupport.global;
    const compare = global.providers;
    const hasProvider = compare.find(xProvider => xProvider.constructMethod.compareTo === provider.constructMethod.compareTo);
    if (hasProvider) {
        memory.push({
            tagSupport,
            renderCount: global.renderCount,
            provider: hasProvider,
        });
    }
    const childTags = tagSupport.childTags;
    for (let index = childTags.length - 1; index >= 0; --index) {
        getTagsWithProvider(childTags[index], provider, memory);
    }
    return memory;
}


/***/ }),

/***/ "./ts/state/providers.ts":
/*!*******************************!*\
  !*** ./ts/state/providers.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   providers: () => (/* binding */ providers)
/* harmony export */ });
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");
/* harmony import */ var _state_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state.function */ "./ts/state/state.function.ts");



_setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig = {
    providers: [],
    ownerSupport: undefined,
};
const providers = {
    create: (constructMethod) => {
        const stateDiffMemory = (0,_state_function__WEBPACK_IMPORTED_MODULE_2__.state)(() => ({ stateDiff: 0, provider: undefined }));
        // mimic how many states were called the first time
        if (stateDiffMemory.stateDiff) {
            for (let x = stateDiffMemory.stateDiff; x > 0; --x) {
                (0,_state_function__WEBPACK_IMPORTED_MODULE_2__.state)(undefined);
            }
            const result = (0,_state_function__WEBPACK_IMPORTED_MODULE_2__.state)(undefined);
            // stateDiffMemory.provider.constructMethod.compareTo = compareTo
            return result;
        }
        const result = (0,_state_function__WEBPACK_IMPORTED_MODULE_2__.state)(() => {
            const memory = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory;
            const stateConfig = memory.stateConfig;
            const oldStateCount = stateConfig.array.length;
            // Providers with provider requirements just need to use providers.create() and providers.inject()
            const instance = 'prototype' in constructMethod ? new constructMethod() : constructMethod();
            const stateDiff = stateConfig.array.length - oldStateCount;
            const config = memory.providerConfig;
            const provider = {
                constructMethod,
                instance,
                clone: (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(instance),
                stateDiff,
            };
            stateDiffMemory.provider = provider;
            config.providers.push(provider);
            stateDiffMemory.stateDiff = stateDiff;
            return instance;
        });
        const cm = constructMethod;
        // const compareTo = cm.compareTo = cm.compareTo || cm.toString()
        const compareTo = cm.compareTo = cm.toString();
        stateDiffMemory.provider.constructMethod.compareTo = compareTo;
        return result;
    },
    /**
     * @template T
     * @param {(new (...args: any[]) => T) | () => T} constructor
     * @returns {T}
     */
    inject: (constructor) => {
        // find once, return same every time after
        return (0,_state_function__WEBPACK_IMPORTED_MODULE_2__.state)(() => {
            const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
            const cm = constructor;
            const compareTo = cm.compareTo = cm.compareTo || constructor.toString();
            let owner = {
                ownerTagSupport: config.ownerSupport
            };
            while (owner.ownerTagSupport) {
                const ownerProviders = owner.ownerTagSupport.global.providers;
                const provider = ownerProviders.find(provider => {
                    const constructorMatch = provider.constructMethod.compareTo === compareTo;
                    if (constructorMatch) {
                        return true;
                    }
                });
                if (provider) {
                    provider.clone = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(provider.instance); // keep a copy of the latest before any change occur
                    config.providers.push(provider);
                    return provider.instance;
                }
                owner = owner.ownerTagSupport; // cause reloop checking next parent
            }
            const msg = `Could not inject provider: ${constructor.name} ${constructor}`;
            console.warn(`${msg}. Available providers`, config.providers);
            throw new Error(msg);
        });
    }
};
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse)({
    beforeRender: (tagSupport, ownerSupport) => {
        run(tagSupport, ownerSupport);
    },
    beforeRedraw: (tagSupport, newTagSupport) => {
        run(tagSupport, newTagSupport.ownerTagSupport);
    },
    afterRender: (tagSupport) => {
        const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
        tagSupport.global.providers = [...config.providers];
        config.providers.length = 0;
    }
});
function run(tagSupport, ownerSupport) {
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
    config.ownerSupport = ownerSupport;
    if (tagSupport.global.providers.length) {
        config.providers.length = 0;
        config.providers.push(...tagSupport.global.providers);
    }
}


/***/ }),

/***/ "./ts/state/setUse.function.ts":
/*!*************************************!*\
  !*** ./ts/state/setUse.function.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setUse: () => (/* binding */ setUse)
/* harmony export */ });
const tagUse = [];
function setUse(use) {
    // must provide defaults
    const useMe = {
        beforeRender: use.beforeRender || (() => undefined),
        beforeRedraw: use.beforeRedraw || (() => undefined),
        afterRender: use.afterRender || (() => undefined),
        beforeDestroy: use.beforeDestroy || (() => undefined),
    };
    setUse.tagUse.push(useMe);
}
setUse.tagUse = tagUse;
setUse.memory = {};


/***/ }),

/***/ "./ts/state/state.function.ts":
/*!************************************!*\
  !*** ./ts/state/state.function.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   state: () => (/* binding */ state)
/* harmony export */ });
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");
/* harmony import */ var _state_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state.utils */ "./ts/state/state.utils.ts");
/* harmony import */ var _syncStates_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./syncStates.function */ "./ts/state/syncStates.function.ts");



/** Used for variables that need to remain the same variable during render passes */
function state(defaultValue) {
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.stateConfig;
    let getSetMethod;
    const rearray = config.rearray;
    const restate = rearray[config.array.length];
    if (restate) {
        let oldValue = (0,_state_utils__WEBPACK_IMPORTED_MODULE_1__.getStateValue)(restate);
        getSetMethod = ((x) => [oldValue, oldValue = x]);
        const push = {
            get: () => (0,_state_utils__WEBPACK_IMPORTED_MODULE_1__.getStateValue)(push),
            callback: getSetMethod,
            lastValue: oldValue,
            defaultValue: restate.defaultValue,
        };
        config.array.push(push);
        return oldValue;
    }
    // State first time run
    const defaultFn = defaultValue instanceof Function ? defaultValue : () => defaultValue;
    let initValue = defaultFn();
    // the state is actually intended to be a function
    if (initValue instanceof Function) {
        const oldState = config.array;
        const tagSupport = config.tagSupport;
        const original = initValue;
        initValue = ((...args) => {
            const global = tagSupport.global;
            const newest = global.newest;
            const newState = newest.memory.state;
            (0,_syncStates_function__WEBPACK_IMPORTED_MODULE_2__.syncStates)(newState, oldState);
            const result = original(...args);
            (0,_syncStates_function__WEBPACK_IMPORTED_MODULE_2__.syncStates)(oldState, newState);
            return result;
        });
        initValue.original = original;
    }
    getSetMethod = ((x) => [initValue, initValue = x]);
    const push = {
        get: () => (0,_state_utils__WEBPACK_IMPORTED_MODULE_1__.getStateValue)(push),
        callback: getSetMethod,
        lastValue: initValue,
        defaultValue: initValue,
    };
    config.array.push(push);
    return initValue;
}


/***/ }),

/***/ "./ts/state/state.utils.ts":
/*!*********************************!*\
  !*** ./ts/state/state.utils.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StateEchoBack: () => (/* binding */ StateEchoBack),
/* harmony export */   getCallbackValue: () => (/* binding */ getCallbackValue),
/* harmony export */   getStateValue: () => (/* binding */ getStateValue)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../errors */ "./ts/errors.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");


_setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig = {
    array: [], // state memory on the first render
    // rearray: [] as State,
};
const beforeRender = (tagSupport) => initState(tagSupport);
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse)({
    beforeRender,
    beforeRedraw: beforeRender,
    afterRender: (tagSupport) => {
        const memory = tagSupport.memory;
        const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig;
        const rearray = config.rearray;
        if (rearray.length) {
            if (rearray.length !== config.array.length) {
                const message = `States lengths have changed ${rearray.length} !== ${config.array.length}. State tracking requires the same amount of function calls every render. Typically this errors is thrown when a state like function call occurs only for certain conditions or when a function is intended to be wrapped with a tag() call`;
                const wrapper = tagSupport.templater?.wrapper;
                const details = {
                    oldStates: config.array,
                    newStates: config.rearray,
                    tagFunction: wrapper.parentWrap.original,
                };
                const error = new _errors__WEBPACK_IMPORTED_MODULE_0__.StateMismatchError(message, details);
                console.warn(message, details);
                throw error;
            }
        }
        delete config.rearray; // clean up any previous runs
        delete config.tagSupport;
        memory.state.length = 0;
        memory.state.push(...config.array);
        const state = memory.state;
        for (let index = state.length - 1; index >= 0; --index) {
            const item = state[index];
            item.lastValue = getStateValue(item); // set last values
        }
        config.array = [];
    }
});
function getStateValue(state) {
    const callback = state.callback;
    if (!callback) {
        return state.defaultValue;
    }
    const [value, checkValue] = getCallbackValue(callback);
    if (checkValue !== StateEchoBack) {
        const message = 'State property not used correctly. Second item in array is not setting value as expected.\n\n' +
            'For "let" state use `let name = state(default)(x => [name, name = x])`\n\n' +
            'For "const" state use `const name = state(default)()`\n\n' +
            'Problem state:\n' + (callback ? callback.toString() : JSON.stringify(state)) + '\n';
        console.error(message, { state, callback, value, checkValue });
        throw new Error(message);
    }
    return value;
}
class StateEchoBack {
}
function initState(tagSupport) {
    const memory = tagSupport.memory;
    const state = memory.state;
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig;
    // TODO: The following two blocks of code are state protects, have a production mode that removes this checks
    /*
    if (config.rearray) {
      checkStateMismatch(tagSupport, config, state)
    }
    */
    config.rearray = [];
    const stateLength = state?.length;
    if (stateLength) {
        for (let index = 0; index < stateLength; ++index) {
            getStateValue(state[index]);
        }
        config.rearray.push(...state);
    }
    config.tagSupport = tagSupport;
}
/*
function checkStateMismatch(
  tagSupport: BaseTagSupport,
  config: Config,
  state: State,
) {
  const wrapper = tagSupport.templater?.wrapper as Wrapper
  const wasWrapper = config.tagSupport?.templater.wrapper as Wrapper
  const message = 'last state not cleared. Possibly in the middle of rendering one component and another is trying to render'

  if(!wasWrapper) {
    return // its not a component or was not a component before
  }

  console.error(message, {
    config,
    tagFunction: wrapper.parentWrap.original,
    wasInMiddleOf: wasWrapper.parentWrap.original,
    state,
    expectedClearArray: config.rearray,
  })

  throw new StateMismatchError(message, {
    config,
    tagFunction: wrapper.parentWrap.original,
    state,
    expectedClearArray: config.rearray,
  })
}
*/
function getCallbackValue(callback) {
    const oldState = callback(StateEchoBack); // get value and set to undefined
    const [value] = oldState;
    const [checkValue] = callback(value); // set back to original value
    return [value, checkValue];
}


/***/ }),

/***/ "./ts/state/subject.function.ts":
/*!**************************************!*\
  !*** ./ts/state/subject.function.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   subject: () => (/* binding */ subject)
/* harmony export */ });
/* harmony import */ var _subject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../subject */ "./ts/subject/index.ts");
/* harmony import */ var _tag_getSupportInCycle_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tag/getSupportInCycle.function */ "./ts/tag/getSupportInCycle.function.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");
/* harmony import */ var _state_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./state.function */ "./ts/state/state.function.ts");
/* harmony import */ var _syncStates_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./syncStates.function */ "./ts/state/syncStates.function.ts");





function subject(value, onSubscription) {
    const oldestState = (0,_state_function__WEBPACK_IMPORTED_MODULE_3__.state)(() => _setUse_function__WEBPACK_IMPORTED_MODULE_2__.setUse.memory.stateConfig.array);
    const nowTagSupport = (0,_tag_getSupportInCycle_function__WEBPACK_IMPORTED_MODULE_1__.getSupportInCycle)();
    return new _subject__WEBPACK_IMPORTED_MODULE_0__.Subject(value, onSubscription).pipe(x => {
        (0,_syncStates_function__WEBPACK_IMPORTED_MODULE_4__.syncStates)(nowTagSupport.memory.state, oldestState);
        return x;
    });
}
function all(args) {
    const oldestState = (0,_state_function__WEBPACK_IMPORTED_MODULE_3__.state)(() => _setUse_function__WEBPACK_IMPORTED_MODULE_2__.setUse.memory.stateConfig.array);
    const nowTagSupport = (0,_tag_getSupportInCycle_function__WEBPACK_IMPORTED_MODULE_1__.getSupportInCycle)();
    return _subject__WEBPACK_IMPORTED_MODULE_0__.Subject.all(args).pipe(x => {
        (0,_syncStates_function__WEBPACK_IMPORTED_MODULE_4__.syncStates)(nowTagSupport.memory.state, oldestState);
        return x;
    });
}
subject.all = all;


/***/ }),

/***/ "./ts/state/syncStates.function.ts":
/*!*****************************************!*\
  !*** ./ts/state/syncStates.function.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   syncStates: () => (/* binding */ syncStates)
/* harmony export */ });
function syncStates(stateFrom, stateTo) {
    for (let index = stateFrom.length - 1; index >= 0; --index) {
        const state = stateFrom[index];
        const fromValue = state.get();
        const callback = stateTo[index].callback;
        if (callback) {
            callback(fromValue); // set the value
        }
        stateTo[index].lastValue = fromValue; // record the value
    }
}


/***/ }),

/***/ "./ts/state/watch.function.ts":
/*!************************************!*\
  !*** ./ts/state/watch.function.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   watch: () => (/* binding */ watch)
/* harmony export */ });
/* harmony import */ var _subject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../subject */ "./ts/subject/index.ts");
/* harmony import */ var _tag_getSupportInCycle_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tag/getSupportInCycle.function */ "./ts/tag/getSupportInCycle.function.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");
/* harmony import */ var _state_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./state.function */ "./ts/state/state.function.ts");
/* harmony import */ var _syncStates_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./syncStates.function */ "./ts/state/syncStates.function.ts");





/**
 * When an item in watch array changes, callback function will be triggered. Triggers on initial watch setup. TIP: try watch.noInit()
 * @param currentValues T[]
 * @param callback WatchCallback
 * @returns T[]
 */
const watch = ((currentValues, callback) => {
    return setupWatch(currentValues, callback);
});
const defaultFinally = (x) => x;
function newWatch(setup) {
    const method = (currentValues, callback) => {
        return setupWatch(currentValues, callback, setup);
    };
    method.setup = setup;
    defineOnMethod(() => method, method);
    return method;
}
/**
 * puts above functionality together
 * @param currentValues values being watched
 * @param callback (currentValue, previousValues) => resolveToValue
 * @param param2
 * @returns
 */
const setupWatch = (currentValues, callback, { init, before = () => true, final = defaultFinally, } = {}) => {
    let previous = (0,_state_function__WEBPACK_IMPORTED_MODULE_3__.state)({
        pastResult: undefined,
        values: undefined,
    });
    const previousValues = previous.values;
    // First time running watch?
    if (previousValues === undefined) {
        if (!before(currentValues)) {
            previous.values = currentValues;
            return previous.pastResult; // do not continue
        }
        const castedInit = init || callback;
        const result = castedInit(currentValues, previousValues);
        previous.pastResult = final(result);
        previous.values = currentValues;
        return previous.pastResult;
    }
    const allExact = currentValues.every((item, index) => item === previousValues[index]);
    if (allExact) {
        return previous.pastResult;
    }
    if (!before(currentValues)) {
        previous.values = currentValues;
        return previous.pastResult; // do not continue
    }
    const result = callback(currentValues, previousValues);
    previous.pastResult = final(result);
    previousValues.length = 0;
    previousValues.push(...currentValues);
    return previous.pastResult;
};
function defineOnMethod(getWatch, attachTo) {
    Object.defineProperty(attachTo, 'noInit', {
        get() {
            const watch = getWatch();
            watch.setup.init = () => undefined;
            return watch;
        },
    });
    Object.defineProperty(attachTo, 'asSubject', {
        get() {
            const oldWatch = getWatch();
            const method = (currentValues, callback) => {
                const originalState = (0,_state_function__WEBPACK_IMPORTED_MODULE_3__.state)(() => (0,_tag_getSupportInCycle_function__WEBPACK_IMPORTED_MODULE_1__.getSupportInCycle)().memory.state);
                const subject = (0,_state_function__WEBPACK_IMPORTED_MODULE_3__.state)(() => new _subject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(undefined));
                setupWatch(currentValues, (currentValues, previousValues) => {
                    const setTo = callback(currentValues, previousValues);
                    if (originalState.length) {
                        const newestState = _setUse_function__WEBPACK_IMPORTED_MODULE_2__.setUse.memory.stateConfig.array;
                        (0,_syncStates_function__WEBPACK_IMPORTED_MODULE_4__.syncStates)(newestState, originalState);
                    }
                    subject.set(setTo);
                }, oldWatch.setup);
                return subject;
            };
            method.setup = oldWatch.setup;
            defineOnMethod(() => method, method);
            return method;
            /*
            method.setup = setup
          
            defineOnMethod(() => method as any, method)
            
            return method as any
      
            
            const oldWatch = getWatch()
            const watch = newWatch( oldWatch.setup )
            // const watch = getWatch()
            
            const subject = state(() => new Subject())
            watch.setup.final = (x: any) => {
              subject.set(x)
              return subject
            }
            return watch
            */
        },
    });
    Object.defineProperty(attachTo, 'truthy', {
        get() {
            const watch = getWatch();
            watch.setup.before = (currentValues) => currentValues.every(x => x);
            return watch;
        },
    });
    return attachTo;
}
defineOnMethod(() => newWatch({}), watch);


/***/ }),

/***/ "./ts/subject/Subject.class.ts":
/*!*************************************!*\
  !*** ./ts/subject/Subject.class.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Subject: () => (/* binding */ Subject)
/* harmony export */ });
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _combineLatest_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./combineLatest.function */ "./ts/subject/combineLatest.function.ts");
/* harmony import */ var _subject_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./subject.utils */ "./ts/subject/subject.utils.ts");



class Subject {
    value;
    onSubscription;
    methods = [];
    isSubject = true;
    subscribers = [];
    subscribeWith;
    // unsubcount = 0 // 🔬 testing
    constructor(value, onSubscription) {
        this.value = value;
        this.onSubscription = onSubscription;
    }
    subscribe(callback) {
        const subscription = (0,_subject_utils__WEBPACK_IMPORTED_MODULE_2__.getSubscription)(this, callback);
        // are we within a pipe?
        const subscribeWith = this.subscribeWith;
        if (subscribeWith) {
            // are we in a pipe?
            if (this.methods.length) {
                const orgCallback = callback;
                callback = (value) => {
                    (0,_subject_utils__WEBPACK_IMPORTED_MODULE_2__.runPipedMethods)(value, this.methods, lastValue => orgCallback(lastValue, subscription));
                };
            }
            return subscribeWith(callback);
        }
        this.subscribers.push(subscription);
        // Subject.globalSubs.push(subscription) // 🔬 testing
        const count = Subject.globalSubCount$.value;
        Subject.globalSubCount$.set(count + 1); // 🔬 testing
        if (this.onSubscription) {
            this.onSubscription(subscription);
        }
        return subscription;
    }
    set(value) {
        this.value = value;
        // Notify all subscribers with the new value
        const subs = [...this.subscribers]; // subs may change as we call callbacks
        const length = subs.length;
        for (let index = 0; index < length; ++index) {
            const sub = subs[index];
            sub.callback(value, sub);
        }
    }
    // next() is available for rxjs compatibility
    next = this.set;
    toPromise() {
        return new Promise(res => {
            this.subscribe((x, subscription) => {
                subscription.unsubscribe();
                res(x);
            });
        });
    }
    /** like toPromise but faster */
    toCallback(callback) {
        this.subscribe((x, subscription) => {
            subscription.unsubscribe();
            callback(x);
        });
        return this;
    }
    pipe(...operations) {
        const subject = new Subject();
        subject.methods = operations;
        subject.subscribeWith = (x) => this.subscribe(x);
        return subject;
    }
    static all(args) {
        const switched = args.map(arg => {
            if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isSubjectInstance)(arg))
                return arg;
            // Call the callback immediately with the current value
            const x = new Subject(arg, subscription => {
                subscription.next(arg);
                return subscription;
            });
            return x;
        });
        return (0,_combineLatest_function__WEBPACK_IMPORTED_MODULE_1__.combineLatest)(switched);
    }
    static globalSubCount$ = new Subject(0); // for ease of debugging
}


/***/ }),

/***/ "./ts/subject/ValueSubject.ts":
/*!************************************!*\
  !*** ./ts/subject/ValueSubject.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValueSubject: () => (/* binding */ ValueSubject)
/* harmony export */ });
/* harmony import */ var _Subject_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Subject.class */ "./ts/subject/Subject.class.ts");

class ValueSubject extends _Subject_class__WEBPACK_IMPORTED_MODULE_0__.Subject {
    value;
    constructor(value) {
        super(value);
        this.value = value;
    }
    subscribe(callback) {
        const subscription = super.subscribe(callback);
        // Call the callback immediately with the current value
        callback(this.value, subscription);
        return subscription;
    }
}


/***/ }),

/***/ "./ts/subject/combineLatest.function.ts":
/*!**********************************************!*\
  !*** ./ts/subject/combineLatest.function.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   combineLatest: () => (/* binding */ combineLatest)
/* harmony export */ });
/* harmony import */ var _Subject_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Subject.class */ "./ts/subject/Subject.class.ts");

function combineLatest(subjects) {
    const output = new _Subject_class__WEBPACK_IMPORTED_MODULE_0__.Subject();
    const subscribe = (callback) => {
        const valuesSeen = [];
        const values = [];
        const setValue = (x, index) => {
            valuesSeen[index] = true;
            values[index] = x;
            const countMatched = valuesSeen.length === subjects.length;
            if (!countMatched) {
                return;
            }
            for (let index = valuesSeen.length - 1; index >= 0; --index) {
                if (!valuesSeen[index]) {
                    return;
                }
            }
            // everyone has reported values
            callback(values, subscription);
        };
        const clones = [...subjects];
        const firstSub = clones.shift();
        const subscription = firstSub.subscribe(x => setValue(x, 0));
        const subscriptions = clones.map((subject, index) => subject.subscribe(x => setValue(x, index + 1)));
        subscription.subscriptions = subscriptions;
        return subscription;
    };
    output.subscribeWith = subscribe;
    return output;
}


/***/ }),

/***/ "./ts/subject/index.ts":
/*!*****************************!*\
  !*** ./ts/subject/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Subject: () => (/* reexport safe */ _Subject_class__WEBPACK_IMPORTED_MODULE_0__.Subject),
/* harmony export */   ValueSubject: () => (/* reexport safe */ _ValueSubject__WEBPACK_IMPORTED_MODULE_1__.ValueSubject),
/* harmony export */   combineLatest: () => (/* reexport safe */ _combineLatest_function__WEBPACK_IMPORTED_MODULE_2__.combineLatest),
/* harmony export */   willCallback: () => (/* reexport safe */ _will_functions__WEBPACK_IMPORTED_MODULE_3__.willCallback),
/* harmony export */   willPromise: () => (/* reexport safe */ _will_functions__WEBPACK_IMPORTED_MODULE_3__.willPromise),
/* harmony export */   willSubscribe: () => (/* reexport safe */ _will_functions__WEBPACK_IMPORTED_MODULE_3__.willSubscribe)
/* harmony export */ });
/* harmony import */ var _Subject_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Subject.class */ "./ts/subject/Subject.class.ts");
/* harmony import */ var _ValueSubject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ValueSubject */ "./ts/subject/ValueSubject.ts");
/* harmony import */ var _combineLatest_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./combineLatest.function */ "./ts/subject/combineLatest.function.ts");
/* harmony import */ var _will_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./will.functions */ "./ts/subject/will.functions.ts");






/***/ }),

/***/ "./ts/subject/subject.utils.ts":
/*!*************************************!*\
  !*** ./ts/subject/subject.utils.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSubscription: () => (/* binding */ getSubscription),
/* harmony export */   runPipedMethods: () => (/* binding */ runPipedMethods)
/* harmony export */ });
/* harmony import */ var _Subject_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Subject.class */ "./ts/subject/Subject.class.ts");

function removeSubFromArray(subscribers, callback) {
    const index = subscribers.findIndex(sub => sub.callback === callback);
    if (index !== -1) {
        subscribers.splice(index, 1);
    }
}
function getSubscription(subject, callback) {
    const countSubject = _Subject_class__WEBPACK_IMPORTED_MODULE_0__.Subject.globalSubCount$;
    _Subject_class__WEBPACK_IMPORTED_MODULE_0__.Subject.globalSubCount$.set(countSubject.value + 1);
    const subscription = () => {
        subscription.unsubscribe();
    };
    subscription.callback = callback;
    subscription.subscriptions = [];
    // Return a function to unsubscribe from the BehaviorSubject
    subscription.unsubscribe = () => {
        removeSubFromArray(subject.subscribers, callback); // each will be called when update comes in
        // removeSubFromArray(Subject.globalSubs, callback) // 🔬 testing
        _Subject_class__WEBPACK_IMPORTED_MODULE_0__.Subject.globalSubCount$.set(countSubject.value - 1);
        // any double unsubscribes will be ignored
        subscription.unsubscribe = () => subscription;
        // unsubscribe from any combined subjects
        const subscriptions = subscription.subscriptions;
        for (let index = subscriptions.length - 1; index >= 0; --index) {
            subscriptions[index].unsubscribe();
        }
        return subscription;
    };
    subscription.add = (sub) => {
        subscription.subscriptions.push(sub);
        return subscription;
    };
    subscription.next = (value) => {
        callback(value, subscription);
    };
    return subscription;
}
function runPipedMethods(value, methods, onComplete) {
    const cloneMethods = [...methods];
    const firstMethod = cloneMethods.shift();
    const next = (newValue) => {
        if (cloneMethods.length) {
            return runPipedMethods(newValue, cloneMethods, onComplete);
        }
        onComplete(newValue);
    };
    let handler = next;
    const setHandler = (x) => handler = x;
    const pipeUtils = { setHandler, next };
    const methodResponse = firstMethod(value, pipeUtils);
    handler(methodResponse);
}


/***/ }),

/***/ "./ts/subject/will.functions.ts":
/*!**************************************!*\
  !*** ./ts/subject/will.functions.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   willCallback: () => (/* binding */ willCallback),
/* harmony export */   willPromise: () => (/* binding */ willPromise),
/* harmony export */   willSubscribe: () => (/* binding */ willSubscribe)
/* harmony export */ });
function willCallback(callback) {
    return ((lastValue, utils) => {
        utils.setHandler(() => {
            return undefined;
        });
        callback(lastValue, utils.next);
    });
}
/** .pipe( promise((x) => Promise.resolve(44)) ) */
function willPromise(callback) {
    return ((lastValue, utils) => {
        utils.setHandler(() => {
            return undefined;
        }); // do nothing on initial return
        const result = callback(lastValue);
        result.then(x => utils.next(x));
    });
}
/** .pipe( willSubscribe((x) => new ValueSubject(44)) ) */
const willSubscribe = (callback) => {
    return ((lastValue, utils) => {
        utils.setHandler(() => {
            return undefined;
        }); // do nothing on initial return
        const result = callback(lastValue);
        const subscription = result.subscribe(x => {
            subscription.unsubscribe();
            utils.next(x);
        });
    });
};


/***/ }),

/***/ "./ts/tag/Tag.class.ts":
/*!*****************************!*\
  !*** ./ts/tag/Tag.class.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tag: () => (/* binding */ Tag),
/* harmony export */   escapeSearch: () => (/* binding */ escapeSearch),
/* harmony export */   escapeVariable: () => (/* binding */ escapeVariable),
/* harmony export */   variablePrefix: () => (/* binding */ variablePrefix)
/* harmony export */ });
const variablePrefix = '__tagvar';
const escapeVariable = '--' + variablePrefix + '--';
const escapeSearch = new RegExp(escapeVariable, 'g');
class Tag {
    strings;
    values;
    isTagClass = true;
    // present only when an array. Populated by Tag.key()
    memory = {};
    templater;
    constructor(strings, values) {
        this.strings = strings;
        this.values = values;
    }
    /** Used for array, such as array.map(), calls aka array.map(x => html``.key(x)) */
    key(arrayValue) {
        this.memory.arrayValue = arrayValue;
        return this;
    }
    // TODO: Is this just a fake function that can be data typed?
    children;
    html(strings, ...values) {
        this.children = { strings, values };
        return this;
    }
}


/***/ }),

/***/ "./ts/tag/TagSupport.class.ts":
/*!************************************!*\
  !*** ./ts/tag/TagSupport.class.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseTagSupport: () => (/* binding */ BaseTagSupport),
/* harmony export */   TagSupport: () => (/* binding */ TagSupport)
/* harmony export */ });
/* harmony import */ var _Tag_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tag.class */ "./ts/tag/Tag.class.ts");
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _cloneValueArray_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cloneValueArray.function */ "./ts/tag/cloneValueArray.function.ts");
/* harmony import */ var _checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./checkDestroyPrevious.function */ "./ts/tag/checkDestroyPrevious.function.ts");
/* harmony import */ var _tagRunner__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tagRunner */ "./ts/tag/tagRunner.ts");
/* harmony import */ var _destroy_support__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./destroy.support */ "./ts/tag/destroy.support.ts");
/* harmony import */ var _elementDestroyCheck_function__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./elementDestroyCheck.function */ "./ts/tag/elementDestroyCheck.function.ts");
/* harmony import */ var _update_updateContextItem_function__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./update/updateContextItem.function */ "./ts/tag/update/updateContextItem.function.ts");
/* harmony import */ var _update_processNewValue_function__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./update/processNewValue.function */ "./ts/tag/update/processNewValue.function.ts");
/* harmony import */ var _setTagPlaceholder_function__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./setTagPlaceholder.function */ "./ts/tag/setTagPlaceholder.function.ts");
/* harmony import */ var _interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../interpolations/interpolateElement */ "./ts/interpolations/interpolateElement.ts");
/* harmony import */ var _interpolations_interpolateTemplate__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../interpolations/interpolateTemplate */ "./ts/interpolations/interpolateTemplate.ts");
/* harmony import */ var _interpolations_afterInterpolateElement_function__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../interpolations/afterInterpolateElement.function */ "./ts/interpolations/afterInterpolateElement.function.ts");














const prefixSearch = new RegExp(_Tag_class__WEBPACK_IMPORTED_MODULE_0__.variablePrefix, 'g');
/** used only for apps, otherwise use TagSupport */
class BaseTagSupport {
    templater;
    subject;
    isApp = true;
    appElement; // only seen on this.getAppTagSupport().appElement
    strings;
    values;
    propsConfig;
    // stays with current render
    memory = {
        state: [],
    };
    clones = []; // elements on document. Needed at destroy process to know what to destroy
    // travels with all rerenderings
    global = {
        context: {}, // populated after reading interpolated.values array converted to an object {variable0, variable:1}
        providers: [],
        /** Indicator of re-rending. Saves from double rending something already rendered */
        renderCount: 0,
        deleted: false,
        subscriptions: [],
    };
    hasLiveElements = false;
    constructor(templater, subject) {
        this.templater = templater;
        this.subject = subject;
        const children = templater.children; // children tags passed in as arguments
        const kidValue = children.value;
        const props = templater.props; // natural props
        const latestCloned = props.map(props => (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_1__.deepClone)(props));
        this.propsConfig = {
            latest: props,
            latestCloned, // assume its HTML children and then detect
            lastClonedKidValues: kidValue.map(kid => {
                const cloneValues = (0,_cloneValueArray_function__WEBPACK_IMPORTED_MODULE_3__.cloneValueArray)(kid.values);
                return cloneValues;
            })
        };
    }
    /** Function that kicks off actually putting tags down as HTML elements */
    buildBeforeElement(insertBefore, options = {
        counts: { added: 0, removed: 0 },
    }) {
        const subject = this.subject;
        const global = this.global;
        global.insertBefore = insertBefore;
        if (!global.placeholder) {
            (0,_setTagPlaceholder_function__WEBPACK_IMPORTED_MODULE_10__.setTagPlaceholder)(global);
        }
        const placeholderElm = global.placeholder;
        global.oldest = this;
        global.newest = this;
        subject.tagSupport = this;
        this.hasLiveElements = true;
        const context = this.update();
        const template = this.getTemplate();
        const elementContainer = document.createDocumentFragment();
        const tempDraw = document.createElement('template');
        tempDraw.innerHTML = template.string;
        elementContainer.appendChild(tempDraw);
        // Search/replace innerHTML variables but don't interpolate tag components just yet
        const { tagComponents } = (0,_interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_11__.interpolateElement)(elementContainer, context, template, this, // ownerSupport,
        {
            counts: options.counts
        });
        (0,_interpolations_afterInterpolateElement_function__WEBPACK_IMPORTED_MODULE_13__.afterInterpolateElement)(elementContainer, placeholderElm, this, // ownerSupport
        context, options);
        // Any tag components that were found should be processed AFTER the owner processes its elements. Avoid double processing of elements attributes like (oninit)=${}
        const length = tagComponents.length;
        for (let index = 0; index < length; ++index) {
            const tagComponent = tagComponents[index];
            (0,_interpolations_interpolateTemplate__WEBPACK_IMPORTED_MODULE_12__.subscribeToTemplate)(tagComponent.insertBefore, tagComponent.subject, tagComponent.ownerSupport, options.counts);
            (0,_interpolations_afterInterpolateElement_function__WEBPACK_IMPORTED_MODULE_13__.afterInterpolateElement)(elementContainer, tagComponent.insertBefore, tagComponent.ownerSupport, context, options);
        }
    }
    getTemplate() {
        const thisTag = this.templater.tag;
        const strings = this.strings || thisTag.strings;
        const values = this.values || thisTag.values;
        const string = strings.map((string, index) => {
            const safeString = string.replace(prefixSearch, _Tag_class__WEBPACK_IMPORTED_MODULE_0__.escapeVariable);
            const endString = safeString + (values.length > index ? `{${_Tag_class__WEBPACK_IMPORTED_MODULE_0__.variablePrefix}${index}}` : '');
            const trimString = endString.replace(/>\s*/g, '>').replace(/\s*</g, '<');
            return trimString;
        }).join('');
        const interpolation = (0,_interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_11__.interpolateString)(string);
        return {
            interpolation,
            string: interpolation.string,
            strings,
            values,
            context: this.global.context || {},
        };
    }
    update() {
        return this.updateContext(this.global.context);
    }
    updateContext(context) {
        const thisTag = this.templater.tag;
        const strings = this.strings || thisTag.strings;
        const values = this.values || thisTag.values;
        strings.map((_string, index) => {
            const hasValue = values.length > index;
            if (!hasValue) {
                return;
            }
            const variableName = _Tag_class__WEBPACK_IMPORTED_MODULE_0__.variablePrefix + index;
            const value = values[index];
            // is something already there?
            const exists = variableName in context;
            if (exists) {
                return (0,_update_updateContextItem_function__WEBPACK_IMPORTED_MODULE_8__.updateContextItem)(context, variableName, value);
            }
            // 🆕 First time values below
            context[variableName] = (0,_update_processNewValue_function__WEBPACK_IMPORTED_MODULE_9__.processNewValue)(value, this);
        });
        return context;
    }
}
class TagSupport extends BaseTagSupport {
    templater;
    ownerTagSupport;
    subject;
    version;
    isApp = false;
    childTags = []; // tags on me
    constructor(templater, // at runtime rendering of a tag, it needs to be married to a new TagSupport()
    ownerTagSupport, subject, version = 0) {
        super(templater, subject);
        this.templater = templater;
        this.ownerTagSupport = ownerTagSupport;
        this.subject = subject;
        this.version = version;
    }
    destroy(options = {
        stagger: 0,
        byParent: false, // Only destroy clones of direct children
    }) {
        const firstDestroy = !options.byParent;
        const global = this.global;
        const subject = this.subject;
        const childTags = options.byParent ? [] : (0,_destroy_support__WEBPACK_IMPORTED_MODULE_6__.getChildTagsToDestroy)(this.childTags);
        if (firstDestroy && (0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isTagComponent)(this.templater)) {
            (0,_tagRunner__WEBPACK_IMPORTED_MODULE_5__.runBeforeDestroy)(this, this);
        }
        this.destroySubscriptions();
        // signify immediately child has been deleted (looked for during event processing)
        for (let index = childTags.length - 1; index >= 0; --index) {
            const child = childTags[index];
            const subGlobal = child.global;
            delete subGlobal.newest;
            subGlobal.deleted = true;
            if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isTagComponent)(child.templater)) {
                (0,_tagRunner__WEBPACK_IMPORTED_MODULE_5__.runBeforeDestroy)(child, child);
            }
        }
        // HTML DOM manipulation. Put back down the template tag
        const insertBefore = global.insertBefore;
        if (insertBefore.nodeName === 'TEMPLATE') {
            const placeholder = global.placeholder;
            if (placeholder && !('arrayValue' in this.memory)) {
                if (!options.byParent) {
                    (0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_4__.restoreTagMarker)(this);
                }
            }
        }
        let mainPromise;
        if (this.ownerTagSupport) {
            this.ownerTagSupport.childTags = this.ownerTagSupport.childTags.filter(child => child !== this);
        }
        if (firstDestroy) {
            const { stagger, promise } = this.destroyClones(options);
            options.stagger = stagger;
            if (promise) {
                mainPromise = promise;
            }
        }
        else {
            this.destroyClones();
        }
        // data reset
        delete global.placeholder;
        global.context = {};
        delete global.oldest;
        delete global.newest;
        global.deleted = true;
        this.childTags.length = 0;
        this.hasLiveElements = false;
        delete subject.tagSupport;
        if (mainPromise) {
            mainPromise = mainPromise.then(async () => {
                const promises = childTags.map(kid => kid.destroy({ stagger: 0, byParent: true }));
                return Promise.all(promises);
            });
        }
        else {
            mainPromise = Promise.all(childTags.map(kid => kid.destroy({ stagger: 0, byParent: true })));
        }
        return mainPromise.then(() => options.stagger);
    }
    destroySubscriptions() {
        const subs = this.global.subscriptions;
        for (let index = subs.length - 1; index >= 0; --index) {
            subs[index].unsubscribe();
        }
        subs.length = 0;
    }
    destroyClones({ stagger } = {
        stagger: 0,
    }) {
        const oldClones = [...this.clones];
        this.clones.length = 0; // tag maybe used for something else
        const promises = oldClones.map(clone => this.checkCloneRemoval(clone, stagger)).filter(x => x); // only return promises
        // check subjects that may have clones attached to them
        const oldContext = this.global.context;
        for (const name in oldContext) {
            const value = oldContext[name];
            const clone = value.clone;
            if (clone?.parentNode) {
                clone.parentNode.removeChild(clone);
            }
        }
        if (promises.length) {
            return { promise: Promise.all(promises), stagger };
        }
        return { stagger };
    }
    /** Reviews elements for the presences of ondestroy */
    checkCloneRemoval(clone, stagger) {
        let promise;
        const customElm = clone;
        if (customElm.ondestroy) {
            promise = (0,_elementDestroyCheck_function__WEBPACK_IMPORTED_MODULE_7__.elementDestroyCheck)(customElm, stagger);
        }
        const next = () => {
            const parentNode = clone.parentNode;
            if (parentNode) {
                parentNode.removeChild(clone);
            }
            const ownerSupport = this.ownerTagSupport;
            if (ownerSupport) {
                // Sometimes my clones were first registered to my owner, remove them from owner
                ownerSupport.clones = ownerSupport.clones.filter(compareClone => compareClone !== clone);
            }
        };
        if (promise instanceof Promise) {
            return promise.then(next);
        }
        else {
            next();
        }
        return promise;
    }
    updateBy(tagSupport) {
        const tempTag = tagSupport.templater.tag;
        this.updateConfig(tempTag.strings, tempTag.values);
    }
    updateConfig(strings, values) {
        this.strings = strings;
        this.updateValues(values);
    }
    updateValues(values) {
        this.values = values;
        return this.updateContext(this.global.context);
    }
    getAppTagSupport() {
        let tag = this;
        while (tag.ownerTagSupport) {
            tag = tag.ownerTagSupport;
        }
        return tag;
    }
}
function restoreTagMarkers(support) {
    (0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_4__.restoreTagMarker)(support);
    const childTags = support.childTags;
    for (let index = childTags.length - 1; index >= 0; --index) {
        restoreTagMarkers(childTags[index].global.oldest);
    }
}


/***/ }),

/***/ "./ts/tag/checkDestroyPrevious.function.ts":
/*!*************************************************!*\
  !*** ./ts/tag/checkDestroyPrevious.function.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkDestroyPrevious: () => (/* binding */ checkDestroyPrevious),
/* harmony export */   destroyArrayTag: () => (/* binding */ destroyArrayTag),
/* harmony export */   isSimpleType: () => (/* binding */ isSimpleType),
/* harmony export */   restoreTagMarker: () => (/* binding */ restoreTagMarker)
/* harmony export */ });
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isLikeTags.function */ "./ts/tag/isLikeTags.function.ts");
/* harmony import */ var _destroyTag_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./destroyTag.function */ "./ts/tag/destroyTag.function.ts");
/* harmony import */ var _insertAfter_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../insertAfter.function */ "./ts/insertAfter.function.ts");




function checkDestroyPrevious(subject, // existing.value is the old value
newValue, insertBefore) {
    const displaySubject = subject;
    const hasLastValue = 'lastValue' in displaySubject;
    const lastValue = displaySubject.lastValue; // TODO: we maybe able to use displaySubject.value and remove concept of lastValue
    // was simple value but now something bigger
    if (hasLastValue && lastValue !== newValue) {
        const newType = typeof (newValue);
        if (isSimpleType(newType) && typeof (lastValue) === newType) {
            return false;
        }
        if (newValue instanceof Function && lastValue instanceof Function) {
            return false;
        }
        destroySimpleValue(insertBefore, displaySubject);
        return 'changed-simple-value';
    }
    const arraySubject = subject;
    const wasArray = arraySubject.lastArray;
    // no longer an array
    if (wasArray && !(0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagArray)(newValue)) {
        const placeholderElm = arraySubject.placeholder;
        delete arraySubject.lastArray;
        delete arraySubject.placeholder;
        (0,_insertAfter_function__WEBPACK_IMPORTED_MODULE_3__.insertAfter)(insertBefore, placeholderElm);
        for (let index = wasArray.length - 1; index >= 0; --index) {
            const { tagSupport } = wasArray[index];
            destroyArrayTag(tagSupport, { added: 0, removed: 0 });
        }
        return 'array';
    }
    const tagSubject = subject;
    const lastSupport = tagSubject.tagSupport;
    // no longer tag or component?
    if (lastSupport) {
        const isValueTag = (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTag)(newValue);
        const isSubjectTag = (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTag)(subject.value);
        if (isSubjectTag && isValueTag) {
            const newTag = newValue;
            // its a different tag now
            if (!(0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_1__.isLikeTags)(newTag, lastSupport)) {
                // put template back down
                restoreTagMarker(lastSupport);
                (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(lastSupport);
                return 2;
            }
            return false;
        }
        const isValueTagComponent = (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagComponent)(newValue);
        if (isValueTagComponent) {
            return false; // its still a tag component
        }
        // put template back down
        restoreTagMarker(lastSupport);
        // destroy old component, value is not a component
        (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(lastSupport);
        return 'different-tag';
    }
    return false;
}
function isSimpleType(value) {
    return ['string', 'number', 'boolean'].includes(value);
}
function destroyArrayTag(tagSupport, counts) {
    (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagSupportPast)(tagSupport);
    tagSupport.destroy({
        stagger: counts.removed++,
    });
    const insertBefore = tagSupport.global.insertBefore;
    const parentNode = insertBefore.parentNode;
    parentNode.removeChild(insertBefore);
}
function destroySimpleValue(insertBefore, // always a template tag
subject) {
    const clone = subject.clone;
    const parent = clone.parentNode;
    // 1 put the template back down
    parent.insertBefore(insertBefore, clone);
    parent.removeChild(clone);
    delete subject.clone;
    delete subject.lastValue;
}
function restoreTagMarker(lastSupport) {
    const insertBefore = lastSupport.global.insertBefore;
    const global = lastSupport.global;
    const placeholderElm = global.placeholder;
    if (placeholderElm) {
        (0,_insertAfter_function__WEBPACK_IMPORTED_MODULE_3__.insertAfter)(insertBefore, placeholderElm);
        delete global.placeholder;
    }
}


/***/ }),

/***/ "./ts/tag/cloneValueArray.function.ts":
/*!********************************************!*\
  !*** ./ts/tag/cloneValueArray.function.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cloneValueArray: () => (/* binding */ cloneValueArray)
/* harmony export */ });
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../isInstance */ "./ts/isInstance.ts");


function cloneValueArray(values) {
    return values.map((value) => {
        const tag = value;
        if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagComponent)(value)) {
            const tagComponent = value;
            return (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(tagComponent.props);
        }
        if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagClass)(tag) || (0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagTemplater)(tag)) {
            return cloneValueArray(tag.values);
        }
        if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagArray)(tag)) {
            return cloneValueArray(tag);
        }
        return (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(value);
    });
}


/***/ }),

/***/ "./ts/tag/destroy.support.ts":
/*!***********************************!*\
  !*** ./ts/tag/destroy.support.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getChildTagsToDestroy: () => (/* binding */ getChildTagsToDestroy)
/* harmony export */ });
function getChildTagsToDestroy(childTags, allTags = []) {
    for (let index = childTags.length - 1; index >= 0; --index) {
        const cTag = childTags[index];
        allTags.push(cTag);
        childTags.splice(index, 1);
        getChildTagsToDestroy(cTag.childTags, allTags);
    }
    return allTags;
}


/***/ }),

/***/ "./ts/tag/destroyTag.function.ts":
/*!***************************************!*\
  !*** ./ts/tag/destroyTag.function.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   destroyTagMemory: () => (/* binding */ destroyTagMemory),
/* harmony export */   destroyTagSupportPast: () => (/* binding */ destroyTagSupportPast)
/* harmony export */ });
function destroyTagMemory(oldTagSupport) {
    // must destroy oldest which is tag with elements on stage
    const oldest = oldTagSupport.global.oldest;
    oldest.destroy();
    destroyTagSupportPast(oldTagSupport);
    oldTagSupport.global.context = {};
}
function destroyTagSupportPast(oldTagSupport) {
    delete oldTagSupport.global.oldest;
    delete oldTagSupport.global.newest;
}


/***/ }),

/***/ "./ts/tag/elementDestroyCheck.function.ts":
/*!************************************************!*\
  !*** ./ts/tag/elementDestroyCheck.function.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   elementDestroyCheck: () => (/* binding */ elementDestroyCheck)
/* harmony export */ });
function elementDestroyCheck(nextSibling, stagger) {
    const onDestroyDoubleWrap = nextSibling.ondestroy;
    if (!onDestroyDoubleWrap) {
        return;
    }
    const onDestroyWrap = onDestroyDoubleWrap.tagFunction;
    if (!onDestroyWrap) {
        return;
    }
    const onDestroy = onDestroyWrap.tagFunction;
    if (!onDestroy) {
        return;
    }
    const event = { target: nextSibling, stagger };
    return onDestroy(event);
}


/***/ }),

/***/ "./ts/tag/getSupportInCycle.function.ts":
/*!**********************************************!*\
  !*** ./ts/tag/getSupportInCycle.function.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSupportInCycle: () => (/* binding */ getSupportInCycle)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ "./ts/state/index.ts");

function getSupportInCycle() {
    return _state__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.stateConfig.tagSupport;
}


/***/ }),

/***/ "./ts/tag/hasPropChanges.function.ts":
/*!*******************************************!*\
  !*** ./ts/tag/hasPropChanges.function.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasPropChanges: () => (/* binding */ hasPropChanges)
/* harmony export */ });
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../deepFunctions */ "./ts/deepFunctions.ts");

/**
 *
 * @param props
 * @param pastCloneProps
 * @returns WHEN number then props have changed. WHEN false props have not changed
 */
function hasPropChanges(props, // natural props
pastCloneProps) {
    /*
    const isCommonEqual = props === undefined && props === compareToProps
    if(isCommonEqual) {
      return false
    }
    */
    let castedProps = props;
    let castedPastProps = pastCloneProps;
    // check all prop functions match
    if (typeof (props) === 'object') {
        if (!pastCloneProps) {
            return 3;
        }
        // castedProps = {...props}
        castedProps = [...props];
        // castedPastProps = {...(pastCloneProps || {})}
        castedPastProps = [...(pastCloneProps || [])];
        const allFunctionsMatch = castedProps.every((value, index) => {
            let compare = castedPastProps[index];
            if (value && typeof (value) === 'object') {
                const subCastedProps = { ...value };
                const subCompareProps = { ...compare || {} };
                const matched = Object.entries(subCastedProps).every(([key, value]) => {
                    return compareProps(value, subCompareProps[key], () => {
                        delete subCastedProps[key]; // its a function and not needed to be compared
                        delete subCompareProps[key]; // its a function and not needed to be compared
                    });
                });
                return matched;
            }
            return compareProps(value, compare, () => {
                castedProps.splice(index, 1);
                castedPastProps.splice(index, 1);
            });
        });
        if (!allFunctionsMatch) {
            return 6; // a change has been detected by function comparisons
        }
    }
    // const isEqual = deepEqual(castedPastProps, castedProps)
    // return isEqual ? false : 7 // if equal then no changes
    return false;
}
/** returning a number means true good comparison */
function compareProps(value, compare, onDelete) {
    if (!(value instanceof Function)) {
        return (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(value, compare) ? 4 : false;
    }
    const compareFn = compare;
    if (!(compareFn instanceof Function)) {
        return false; // its a function now but was not before
    }
    // ensure we are comparing apples to apples as function get wrapped
    const compareOriginal = compare?.original;
    if (compareOriginal) {
        compare = compareOriginal;
    }
    const original = value.original;
    if (original) {
        value = value.original;
    }
    const valueString = value.toString();
    const compareString = compare.toString();
    if (valueString === compareString) {
        onDelete();
        return 3; // both are function the same
    }
    onDelete();
    return 5;
}


/***/ }),

/***/ "./ts/tag/hasTagSupportChanged.function.ts":
/*!*************************************************!*\
  !*** ./ts/tag/hasTagSupportChanged.function.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasKidsChanged: () => (/* binding */ hasKidsChanged),
/* harmony export */   hasTagSupportChanged: () => (/* binding */ hasTagSupportChanged)
/* harmony export */ });
/* harmony import */ var _hasPropChanges_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hasPropChanges.function */ "./ts/tag/hasPropChanges.function.ts");

function hasTagSupportChanged(oldTagSupport, newTagSupport, newTemplater) {
    const latestProps = newTemplater.props; // newTagSupport.propsConfig.latest
    const pastCloneProps = oldTagSupport.propsConfig.latestCloned;
    const propsChanged = (0,_hasPropChanges_function__WEBPACK_IMPORTED_MODULE_0__.hasPropChanges)(latestProps, pastCloneProps);
    // if no changes detected, no need to continue to rendering further tags
    if (propsChanged) {
        return propsChanged;
    }
    const kidsChanged = hasKidsChanged(oldTagSupport, newTagSupport);
    // we already know props didn't change and if kids didn't either, than don't render
    return kidsChanged;
}
function hasKidsChanged(oldTagSupport, newTagSupport) {
    const oldCloneKidValues = oldTagSupport.propsConfig.lastClonedKidValues;
    const newClonedKidValues = newTagSupport.propsConfig.lastClonedKidValues;
    const everySame = oldCloneKidValues.every((set, index) => {
        const x = newClonedKidValues[index];
        return set.every((item, index) => item === x[index]);
    });
    return everySame ? false : 9;
}


/***/ }),

/***/ "./ts/tag/html.ts":
/*!************************!*\
  !*** ./ts/tag/html.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* binding */ html)
/* harmony export */ });
/* harmony import */ var _Tag_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tag.class */ "./ts/tag/Tag.class.ts");

function html(strings, ...values) {
    return new _Tag_class__WEBPACK_IMPORTED_MODULE_0__.Tag(strings, values);
}


/***/ }),

/***/ "./ts/tag/isLikeTags.function.ts":
/*!***************************************!*\
  !*** ./ts/tag/isLikeTags.function.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isLikeTags: () => (/* binding */ isLikeTags),
/* harmony export */   isLikeValueSets: () => (/* binding */ isLikeValueSets)
/* harmony export */ });
function isLikeTags(tagSupport0, // new
tagSupport1) {
    const templater0 = tagSupport0.templater;
    const templater1 = tagSupport1.templater;
    const tag0 = templater0?.tag || tagSupport0;
    const tag1 = templater1.tag;
    const strings0 = tag0.strings;
    const strings1 = tagSupport1.strings || tag1.strings;
    if (strings0.length !== strings1.length) {
        return false;
    }
    const everyStringMatched = strings0.every((string, index) => strings1[index] === string);
    if (!everyStringMatched) {
        return false;
    }
    const values0 = tagSupport0.values || tag0.values;
    const values1 = tagSupport1.values || tag1.values;
    return isLikeValueSets(values0, values1);
}
function isLikeValueSets(values0, values1) {
    const valuesLengthsMatch = values0.length === values1.length;
    if (!valuesLengthsMatch) {
        return false;
    }
    const allVarsMatch = values1.every((value, index) => {
        const compareTo = values0[index];
        const isFunctions = value instanceof Function && compareTo instanceof Function;
        if (isFunctions) {
            const stringMatch = value.toString() === compareTo.toString();
            if (stringMatch) {
                return true;
            }
            return false;
        }
        return true; // deepEqual(value, compareTo)
    });
    if (allVarsMatch) {
        return true;
    }
    return false;
}


/***/ }),

/***/ "./ts/tag/render/renderExistingTag.function.ts":
/*!*****************************************************!*\
  !*** ./ts/tag/render/renderExistingTag.function.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderExistingTag: () => (/* binding */ renderExistingTag)
/* harmony export */ });
/* harmony import */ var _state_provider_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../state/provider.utils */ "./ts/state/provider.utils.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../isLikeTags.function */ "./ts/tag/isLikeTags.function.ts");
/* harmony import */ var _renderWithSupport_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderWithSupport.function */ "./ts/tag/render/renderWithSupport.function.ts");



/** Returns true when rendering owner is not needed. Returns false when rendering owner should occur */
function renderExistingTag(oldestSupport, // oldest with elements on html
newSupport, // new to be rendered
ownerSupport, // ownerSupport
subject) {
    const lastSupport = subject.tagSupport;
    const global = lastSupport.global;
    // share point between renders
    newSupport.global = global;
    const preRenderCount = global.renderCount;
    (0,_state_provider_utils__WEBPACK_IMPORTED_MODULE_0__.providersChangeCheck)(oldestSupport);
    // When the providers were checked, a render to myself occurred and I do not need to re-render again
    const prevSupport = global.newest;
    if (preRenderCount !== global.renderCount) {
        oldestSupport.updateBy(prevSupport);
        return prevSupport; // already rendered during triggered events
    }
    const toRedrawTag = prevSupport || lastSupport || global.oldest;
    const reSupport = (0,_renderWithSupport_function__WEBPACK_IMPORTED_MODULE_2__.renderWithSupport)(newSupport, toRedrawTag, subject, ownerSupport);
    const oldest = global.oldest || oldestSupport;
    reSupport.global.oldest = oldest;
    // TODO: renderWithSupport already does an isLikeTags compare
    if ((0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_1__.isLikeTags)(prevSupport, reSupport)) {
        subject.tagSupport = reSupport;
        oldest.updateBy(reSupport);
    }
    return reSupport;
}


/***/ }),

/***/ "./ts/tag/render/renderSubjectComponent.function.ts":
/*!**********************************************************!*\
  !*** ./ts/tag/render/renderSubjectComponent.function.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSubjectComponent: () => (/* binding */ renderSubjectComponent)
/* harmony export */ });
/* harmony import */ var _renderWithSupport_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderWithSupport.function */ "./ts/tag/render/renderWithSupport.function.ts");

function renderSubjectComponent(subject, reSupport, ownerSupport) {
    const preClones = ownerSupport.clones.map(clone => clone);
    reSupport = (0,_renderWithSupport_function__WEBPACK_IMPORTED_MODULE_0__.renderWithSupport)(reSupport, subject.tagSupport, // existing tag
    subject, ownerSupport);
    reSupport.global.newest = reSupport;
    if (ownerSupport.clones.length > preClones.length) {
        const myClones = ownerSupport.clones.filter(fClone => !preClones.find(clone => clone === fClone));
        reSupport.clones.push(...myClones);
    }
    ownerSupport.childTags.push(reSupport);
    return reSupport;
}


/***/ }),

/***/ "./ts/tag/render/renderTagOnly.function.ts":
/*!*************************************************!*\
  !*** ./ts/tag/render/renderTagOnly.function.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTagOnly: () => (/* binding */ renderTagOnly)
/* harmony export */ });
/* harmony import */ var _tagRunner__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tagRunner */ "./ts/tag/tagRunner.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../state */ "./ts/state/index.ts");



function renderTagOnly(newTagSupport, lastSupport, subject, ownerSupport) {
    const oldRenderCount = newTagSupport.global.renderCount;
    beforeWithRender(newTagSupport, ownerSupport, lastSupport);
    const templater = newTagSupport.templater;
    // NEW TAG CREATED HERE
    const wrapper = templater.wrapper;
    let reSupport = wrapper(newTagSupport, subject);
    /* AFTER */
    (0,_tagRunner__WEBPACK_IMPORTED_MODULE_0__.runAfterRender)(newTagSupport, ownerSupport);
    // When we rendered, only 1 render should have taken place OTHERWISE rendering caused another render and that is the latest instead
    if (reSupport.global.renderCount > oldRenderCount + 1) {
        return newTagSupport.global.newest;
    }
    newTagSupport.global.newest = reSupport;
    return reSupport;
}
function beforeWithRender(tagSupport, // new
ownerSupport, lastSupport) {
    const lastOwnerSupport = lastSupport?.ownerTagSupport;
    const runtimeOwnerSupport = lastOwnerSupport || ownerSupport;
    if (lastSupport) {
        const lastState = lastSupport.memory.state;
        const memory = tagSupport.memory;
        // memory.state.length = 0
        // memory.state.push(...lastState)
        memory.state = [...lastState];
        tagSupport.global = lastSupport.global;
        (0,_tagRunner__WEBPACK_IMPORTED_MODULE_0__.runBeforeRedraw)(tagSupport, lastSupport);
    }
    else {
        // first time render
        (0,_tagRunner__WEBPACK_IMPORTED_MODULE_0__.runBeforeRender)(tagSupport, runtimeOwnerSupport);
        // TODO: Logic below most likely could live within providers.ts inside the runBeforeRender function
        const providers = _state__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
        providers.ownerSupport = runtimeOwnerSupport;
    }
}


/***/ }),

/***/ "./ts/tag/render/renderTagSupport.function.ts":
/*!****************************************************!*\
  !*** ./ts/tag/render/renderTagSupport.function.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTagSupport: () => (/* binding */ renderTagSupport)
/* harmony export */ });
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _renderExistingTag_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderExistingTag.function */ "./ts/tag/render/renderExistingTag.function.ts");


/** Main function used by all other callers to render/update display of a tag component */
function renderTagSupport(tagSupport, // must be latest/newest state render
renderUp) {
    const global = tagSupport.global;
    const templater = tagSupport.templater;
    // is it just a vanilla tag, not component?
    if (!templater.wrapper) { // || isTagTemplater(templater) 
        const ownerTag = tagSupport.ownerTagSupport;
        ++global.renderCount;
        return renderTagSupport(ownerTag, true);
    }
    const subject = tagSupport.subject;
    let ownerSupport;
    let selfPropChange = false;
    const shouldRenderUp = renderUp && tagSupport;
    if (shouldRenderUp) {
        ownerSupport = tagSupport.ownerTagSupport;
        if (ownerSupport) {
            const nowProps = templater.props;
            const latestProps = tagSupport.propsConfig.latestCloned;
            selfPropChange = !nowProps.every((props, index) => (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(props, latestProps[index]));
        }
    }
    const oldest = tagSupport.global.oldest;
    const tag = (0,_renderExistingTag_function__WEBPACK_IMPORTED_MODULE_1__.renderExistingTag)(oldest, tagSupport, ownerSupport, // useTagSupport,
    subject);
    const renderOwner = ownerSupport && selfPropChange;
    if (renderOwner) {
        const ownerTagSupport = ownerSupport;
        renderTagSupport(ownerTagSupport, true);
        return tag;
    }
    return tag;
}


/***/ }),

/***/ "./ts/tag/render/renderWithSupport.function.ts":
/*!*****************************************************!*\
  !*** ./ts/tag/render/renderWithSupport.function.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderWithSupport: () => (/* binding */ renderWithSupport)
/* harmony export */ });
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../isLikeTags.function */ "./ts/tag/isLikeTags.function.ts");
/* harmony import */ var _destroyTag_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../destroyTag.function */ "./ts/tag/destroyTag.function.ts");
/* harmony import */ var _renderTagOnly_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderTagOnly.function */ "./ts/tag/render/renderTagOnly.function.ts");



function renderWithSupport(newTagSupport, lastSupport, // previous
subject, // events & memory
ownerSupport) {
    const reSupport = (0,_renderTagOnly_function__WEBPACK_IMPORTED_MODULE_2__.renderTagOnly)(newTagSupport, lastSupport, subject, ownerSupport);
    const isLikeTag = !lastSupport || (0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_0__.isLikeTags)(lastSupport, reSupport);
    if (!isLikeTag) {
        destroyUnlikeTags(lastSupport, reSupport, subject);
    }
    const lastOwnerSupport = lastSupport?.ownerTagSupport;
    reSupport.ownerTagSupport = (ownerSupport || lastOwnerSupport);
    return reSupport;
}
function destroyUnlikeTags(lastSupport, // old
reSupport, // new
subject) {
    const oldGlobal = lastSupport.global;
    const insertBefore = oldGlobal.insertBefore;
    (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_1__.destroyTagMemory)(lastSupport);
    // when a tag is destroyed, disconnect the globals
    reSupport.global = { ...oldGlobal }; // break memory references
    const global = reSupport.global;
    global.insertBefore = insertBefore;
    global.deleted = false;
    delete global.oldest;
    delete global.newest;
    delete subject.tagSupport;
}


/***/ }),

/***/ "./ts/tag/setTagPlaceholder.function.ts":
/*!**********************************************!*\
  !*** ./ts/tag/setTagPlaceholder.function.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setTagPlaceholder: () => (/* binding */ setTagPlaceholder),
/* harmony export */   swapInsertBefore: () => (/* binding */ swapInsertBefore)
/* harmony export */ });
function setTagPlaceholder(global) {
    const insertBefore = global.insertBefore;
    return global.placeholder = swapInsertBefore(insertBefore);
}
function swapInsertBefore(insertBefore) {
    const placeholder = document.createTextNode('');
    const parentNode = insertBefore.parentNode;
    parentNode.insertBefore(placeholder, insertBefore);
    parentNode.removeChild(insertBefore);
    return placeholder;
}


/***/ }),

/***/ "./ts/tag/tag.ts":
/*!***********************!*\
  !*** ./ts/tag/tag.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   kidsToTagArraySubject: () => (/* binding */ kidsToTagArraySubject),
/* harmony export */   tag: () => (/* binding */ tag),
/* harmony export */   tags: () => (/* binding */ tags)
/* harmony export */ });
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../state */ "./ts/state/index.ts");
/* harmony import */ var _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../TemplaterResult.class */ "./ts/TemplaterResult.class.ts");
/* harmony import */ var _interpolations_bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../interpolations/bindSubjectCallback.function */ "./ts/interpolations/bindSubjectCallback.function.ts");
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/tag/TagSupport.class.ts");
/* harmony import */ var _alterProps_function__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../alterProps.function */ "./ts/alterProps.function.ts");
/* harmony import */ var _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../subject/ValueSubject */ "./ts/subject/ValueSubject.ts");








// export const tags: TagComponentBase<any>[] = []
const tags = [];
let tagCount = 0;
/** Wraps a tag component in a state manager and always push children to last argument as an array */
// export function tag<T>(a: T): T;
function tag(tagComponent) {
    /** function developer triggers */
    const parentWrap = (function tagWrapper(...props) {
        const templater = new _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_2__.TemplaterResult(props);
        // attach memory back to original function that contains developer display logic
        const innerTagWrap = getTagWrap(templater, parentWrap);
        if (!innerTagWrap.parentWrap) {
            innerTagWrap.parentWrap = parentWrap;
        }
        templater.tagged = true;
        templater.wrapper = innerTagWrap;
        return templater;
    }) // we override the function provided and pretend original is what's returned
    ;
    parentWrap.original = tagComponent;
    parentWrap.compareTo = tagComponent.toString();
    updateResult(parentWrap, tagComponent);
    // group tags together and have hmr pickup
    updateComponent(tagComponent);
    tags.push(parentWrap);
    return parentWrap;
}
function kidsToTagArraySubject(children) {
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isSubjectInstance)(children)) {
        return { childSubject: children, madeSubject: false };
    }
    const kidArray = children;
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagArray)(kidArray)) {
        return { childSubject: new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_7__.ValueSubject(children), madeSubject: true };
    }
    const kid = children;
    if (kid) {
        kid.memory.arrayValue = 0;
        return { childSubject: new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_7__.ValueSubject([kid]), madeSubject: true };
    }
    return {
        childSubject: new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_7__.ValueSubject([]),
        madeSubject: true // was converted into a subject
    };
}
function updateResult(result, tagComponent) {
    result.isTag = true;
    result.original = tagComponent;
}
function updateComponent(tagComponent) {
    tagComponent.tags = tags;
    tagComponent.setUse = _state__WEBPACK_IMPORTED_MODULE_1__.setUse;
    tagComponent.tagIndex = tagCount++; // needed for things like HMR
}
/** creates/returns a function that when called then calls the original component function
 * Gets used as templater.wrapper()
 */
function getTagWrap(templater, result) {
    // this function gets called by taggedjs
    const wrapper = function (newTagSupport, subject) {
        const global = newTagSupport.global;
        ++global.renderCount;
        const childSubject = templater.children;
        const lastArray = global.oldest?.templater.children.lastArray;
        if (lastArray) {
            childSubject.lastArray = lastArray;
        }
        // result.original
        const originalFunction = result.original; // (innerTagWrap as any).original as unknown as TagComponent
        let props = templater.props;
        let castedProps = props.map(props => (0,_alterProps_function__WEBPACK_IMPORTED_MODULE_6__.alterProps)(props, newTagSupport.ownerTagSupport));
        const latestCloned = props.map(props => (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_4__.deepClone)(props)); // castedProps
        // CALL ORIGINAL COMPONENT FUNCTION
        let tag = originalFunction(...castedProps);
        if (tag instanceof Function) {
            tag = tag();
        }
        tag.templater = templater;
        templater.tag = tag;
        const tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_5__.TagSupport(templater, newTagSupport.ownerTagSupport, subject, global.renderCount);
        tagSupport.global = global;
        tagSupport.propsConfig = {
            latest: props,
            latestCloned,
            lastClonedKidValues: tagSupport.propsConfig.lastClonedKidValues,
        };
        tagSupport.memory = newTagSupport.memory; // state handover
        if (templater.madeChildIntoSubject) {
            const value = childSubject.value;
            for (let index = value.length - 1; index >= 0; --index) {
                const kid = value[index];
                const values = kid.values;
                for (let index = values.length - 1; index >= 0; --index) {
                    const value = values[index];
                    if (!(value instanceof Function)) {
                        continue;
                    }
                    const valuesValue = kid.values[index];
                    if (valuesValue.isChildOverride) {
                        continue; // already overwritten
                    }
                    // all functions need to report to me
                    kid.values[index] = function (...args) {
                        const ownerSupport = tagSupport.ownerTagSupport;
                        return (0,_interpolations_bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_3__.runTagCallback)(value, // callback
                        ownerSupport, this, // bindTo
                        args);
                    };
                    valuesValue.isChildOverride = true;
                }
            }
        }
        return tagSupport;
    };
    return wrapper;
}


/***/ }),

/***/ "./ts/tag/tagElement.ts":
/*!******************************!*\
  !*** ./ts/tag/tagElement.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runWrapper: () => (/* binding */ runWrapper),
/* harmony export */   tagElement: () => (/* binding */ tagElement)
/* harmony export */ });
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/tag/TagSupport.class.ts");
/* harmony import */ var _tagRunner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tagRunner */ "./ts/tag/tagRunner.ts");
/* harmony import */ var _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../subject/ValueSubject */ "./ts/subject/ValueSubject.ts");



const appElements = [];
/**
 *
 * @param app taggedjs tag
 * @param element HTMLElement
 * @param props object
 * @returns
 */
function tagElement(app, // (...args: unknown[]) => TemplaterResult,
element, props) {
    const appElmIndex = appElements.findIndex(appElm => appElm.element === element);
    if (appElmIndex >= 0) {
        appElements[appElmIndex].tagSupport.destroy();
        appElements.splice(appElmIndex, 1);
        // an element already had an app on it
        console.warn('Found and destroyed app element already rendered to element', { element });
    }
    // Create the app which returns [props, runOneTimeFunction]
    const wrapper = app(props);
    // have a function setup and call the tagWrapper with (props, {update, async, on})
    const tagSupport = runWrapper(wrapper);
    // TODO: is the below needed?
    tagSupport.appElement = element;
    tagSupport.isApp = true;
    tagSupport.global.isApp = true;
    const templateElm = document.createElement('template');
    templateElm.setAttribute('id', 'app-tag-' + appElements.length);
    templateElm.setAttribute('app-tag-detail', appElements.length.toString());
    const fragment = document.createDocumentFragment();
    fragment.appendChild(templateElm);
    element.destroy = async () => {
        await tagSupport.destroy();
        const insertBefore = tagSupport.global.insertBefore;
        const parentNode = insertBefore.parentNode;
        parentNode.removeChild(insertBefore);
    };
    tagSupport.buildBeforeElement(templateElm);
    tagSupport.global.oldest = tagSupport;
    tagSupport.global.newest = tagSupport;
    element.setUse = app.original.setUse;
    appElements.push({ element, tagSupport });
    element.appendChild(fragment);
    return {
        tagSupport,
        tags: app.original.tags,
    };
}
function runWrapper(templater) {
    let newSupport = {};
    const subject = new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_2__.ValueSubject(newSupport);
    newSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__.BaseTagSupport(templater, subject);
    subject.set(templater);
    subject.tagSupport = newSupport;
    (0,_tagRunner__WEBPACK_IMPORTED_MODULE_1__.runBeforeRender)(newSupport, undefined);
    // Call the apps function for our tag templater
    const wrapper = templater.wrapper;
    const tagSupport = wrapper(newSupport, subject);
    (0,_tagRunner__WEBPACK_IMPORTED_MODULE_1__.runAfterRender)(newSupport, tagSupport);
    return tagSupport;
}


/***/ }),

/***/ "./ts/tag/tagRunner.ts":
/*!*****************************!*\
  !*** ./ts/tag/tagRunner.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runAfterRender: () => (/* binding */ runAfterRender),
/* harmony export */   runBeforeDestroy: () => (/* binding */ runBeforeDestroy),
/* harmony export */   runBeforeRedraw: () => (/* binding */ runBeforeRedraw),
/* harmony export */   runBeforeRender: () => (/* binding */ runBeforeRender)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ "./ts/state/index.ts");
/* harmony import */ var _subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../subject */ "./ts/subject/index.ts");
/* harmony import */ var _getSupportInCycle_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getSupportInCycle.function */ "./ts/tag/getSupportInCycle.function.ts");



// Emits event at the end of a tag being rendered. Use tagClosed$.toPromise() to render a tag after a current tag is done rendering
_state__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.tagClosed$ = new _subject__WEBPACK_IMPORTED_MODULE_1__.Subject(undefined, subscription => {
    if (!(0,_getSupportInCycle_function__WEBPACK_IMPORTED_MODULE_2__.getSupportInCycle)()) {
        subscription.next(); // we are not currently processing so process now
    }
});
// Life cycle 1
function runBeforeRender(tagSupport, ownerSupport) {
    const tagUse = _state__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse;
    const length = tagUse.length;
    for (let index = 0; index < length; ++index) {
        tagUse[index].beforeRender(tagSupport, ownerSupport);
    }
}
// Life cycle 2
function runAfterRender(tagSupport, ownerTagSupport) {
    const tagUse = _state__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse;
    const length = tagUse.length;
    for (let index = 0; index < length; ++index) {
        tagUse[index].afterRender(tagSupport, ownerTagSupport);
    }
    _state__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.tagClosed$.next(ownerTagSupport);
}
// Life cycle 3
function runBeforeRedraw(tagSupport, ownerTagSupport) {
    const tagUse = _state__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse;
    const length = tagUse.length;
    for (let index = 0; index < length; ++index) {
        tagUse[index].beforeRedraw(tagSupport, ownerTagSupport);
    }
}
// Life cycle 4 - end of life
function runBeforeDestroy(tagSupport, ownerTagSupport) {
    const tagUse = _state__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse;
    const length = tagUse.length;
    for (let index = 0; index < length; ++index) {
        tagUse[index].beforeDestroy(tagSupport, ownerTagSupport);
    }
}


/***/ }),

/***/ "./ts/tag/update/processFirstSubject.utils.ts":
/*!****************************************************!*\
  !*** ./ts/tag/update/processFirstSubject.utils.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValueTypes: () => (/* binding */ ValueTypes),
/* harmony export */   getValueType: () => (/* binding */ getValueType)
/* harmony export */ });
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../checkDestroyPrevious.function */ "./ts/tag/checkDestroyPrevious.function.ts");


var ValueTypes;
(function (ValueTypes) {
    ValueTypes["unknown"] = "unknown";
    ValueTypes["tag"] = "tag";
    ValueTypes["templater"] = "templater";
    ValueTypes["tagArray"] = "tag-array";
    ValueTypes["tagComponent"] = "tag-component";
    ValueTypes["subject"] = "subject";
    ValueTypes["date"] = "date";
    ValueTypes["string"] = "string";
    ValueTypes["boolean"] = "boolean";
    ValueTypes["function"] = "function";
    ValueTypes["undefined"] = "undefined";
})(ValueTypes || (ValueTypes = {}));
function getValueType(value) {
    if (value === undefined || value === null) {
        return ValueTypes.undefined;
    }
    if (value instanceof Date) {
        return ValueTypes.date;
    }
    if (value instanceof Function) {
        return ValueTypes.function;
    }
    const type = typeof (value);
    if ((0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_1__.isSimpleType)(type)) {
        return type;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagComponent)(value)) {
        return ValueTypes.tagComponent;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagTemplater)(value)) {
        return ValueTypes.templater;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagClass)(value)) {
        return ValueTypes.tag;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagArray)(value)) {
        return ValueTypes.tagArray;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isSubjectInstance)(value)) {
        return ValueTypes.subject;
    }
    return ValueTypes.unknown;
}


/***/ }),

/***/ "./ts/tag/update/processFirstSubjectValue.function.ts":
/*!************************************************************!*\
  !*** ./ts/tag/update/processFirstSubjectValue.function.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processFirstSubjectValue: () => (/* binding */ processFirstSubjectValue)
/* harmony export */ });
/* harmony import */ var _processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./processSubjectComponent.function */ "./ts/tag/update/processSubjectComponent.function.ts");
/* harmony import */ var _processTagArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./processTagArray */ "./ts/tag/update/processTagArray.ts");
/* harmony import */ var _processRegularValue_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./processRegularValue.function */ "./ts/tag/update/processRegularValue.function.ts");
/* harmony import */ var _processTag_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./processTag.function */ "./ts/tag/update/processTag.function.ts");
/* harmony import */ var _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./processFirstSubject.utils */ "./ts/tag/update/processFirstSubject.utils.ts");





function processFirstSubjectValue(value, subject, // could be tag via result.tag
insertBefore, // <template end interpolate /> (will be removed)
ownerSupport, // owner
options) {
    const valueType = (0,_processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_4__.getValueType)(value);
    switch (valueType) {
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_4__.ValueTypes.templater:
            (0,_processTag_function__WEBPACK_IMPORTED_MODULE_3__.processTag)(value, insertBefore, ownerSupport, subject);
            return;
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_4__.ValueTypes.tag:
            const tag = value;
            let templater = tag.templater;
            if (!templater) {
                templater = (0,_processTag_function__WEBPACK_IMPORTED_MODULE_3__.tagFakeTemplater)(tag);
            }
            (0,_processTag_function__WEBPACK_IMPORTED_MODULE_3__.processTag)(templater, insertBefore, ownerSupport, subject);
            return;
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_4__.ValueTypes.tagArray:
            return (0,_processTagArray__WEBPACK_IMPORTED_MODULE_1__.processTagArray)(subject, value, insertBefore, ownerSupport, options);
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_4__.ValueTypes.tagComponent:
            (0,_processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_0__.processSubjectComponent)(value, subject, insertBefore, ownerSupport, options);
            return;
    }
    (0,_processRegularValue_function__WEBPACK_IMPORTED_MODULE_2__.processFirstRegularValue)(value, subject, insertBefore);
}


/***/ }),

/***/ "./ts/tag/update/processNewValue.function.ts":
/*!***************************************************!*\
  !*** ./ts/tag/update/processNewValue.function.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processNewValue: () => (/* binding */ processNewValue)
/* harmony export */ });
/* harmony import */ var _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../subject/ValueSubject */ "./ts/subject/ValueSubject.ts");
/* harmony import */ var _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../TemplaterResult.class */ "./ts/TemplaterResult.class.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../TagSupport.class */ "./ts/tag/TagSupport.class.ts");
/* harmony import */ var _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./processFirstSubject.utils */ "./ts/tag/update/processFirstSubject.utils.ts");




function processNewValue(value, ownerSupport) {
    const valueType = (0,_processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.getValueType)(value);
    switch (valueType) {
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.ValueTypes.tagComponent:
            const tagSubject = new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(value);
            return tagSubject;
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.ValueTypes.templater:
            const templater = value;
            const tag = templater.tag;
            return processNewTag(tag, ownerSupport);
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.ValueTypes.tag:
            return processNewTag(value, ownerSupport);
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.ValueTypes.subject:
            return value;
    }
    return new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(value);
}
function processNewTag(value, ownerSupport) {
    const tag = value;
    let templater = tag.templater;
    if (!templater) {
        templater = new _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_1__.TemplaterResult([]);
        templater.tag = tag;
        tag.templater = templater;
    }
    const subject = new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(templater);
    subject.tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_2__.TagSupport(templater, ownerSupport, subject);
    return subject;
}


/***/ }),

/***/ "./ts/tag/update/processRegularValue.function.ts":
/*!*******************************************************!*\
  !*** ./ts/tag/update/processRegularValue.function.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processFirstRegularValue: () => (/* binding */ processFirstRegularValue),
/* harmony export */   processRegularValue: () => (/* binding */ processRegularValue)
/* harmony export */ });
/* harmony import */ var _updateBeforeTemplate_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../updateBeforeTemplate.function */ "./ts/updateBeforeTemplate.function.ts");

function processRegularValue(value, subject, // could be tag via subject.tag
insertBefore) {
    subject.insertBefore = insertBefore;
    const before = subject.clone || insertBefore; // Either the template is on the doc OR its the first element we last put on doc
    // matches but also was defined at some point
    if (subject.lastValue === value && 'lastValue' in subject) {
        return; // no need to update display, its the same
    }
    subject.lastValue = value;
    const castedValue = (0,_updateBeforeTemplate_function__WEBPACK_IMPORTED_MODULE_0__.castTextValue)(value);
    // replace existing string?
    const oldClone = subject.clone;
    if (oldClone) {
        oldClone.textContent = castedValue;
        return;
    }
    // Processing of regular values
    const clone = (0,_updateBeforeTemplate_function__WEBPACK_IMPORTED_MODULE_0__.updateBeforeTemplate)(castedValue, before);
    subject.clone = clone; // remember single element put down, for future updates
}
function processFirstRegularValue(value, subject, // could be tag via subject.tag
insertBefore) {
    subject.lastValue = value;
    const castedValue = (0,_updateBeforeTemplate_function__WEBPACK_IMPORTED_MODULE_0__.castTextValue)(value);
    // Processing of regular values
    const clone = (0,_updateBeforeTemplate_function__WEBPACK_IMPORTED_MODULE_0__.updateBeforeTemplate)(castedValue, insertBefore);
    subject.clone = clone; // remember single element put down, for future updates 
}


/***/ }),

/***/ "./ts/tag/update/processSubjectComponent.function.ts":
/*!***********************************************************!*\
  !*** ./ts/tag/update/processSubjectComponent.function.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processSubjectComponent: () => (/* binding */ processSubjectComponent)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../state */ "./ts/state/index.ts");
/* harmony import */ var _processTagResult_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./processTagResult.function */ "./ts/tag/update/processTagResult.function.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../TagSupport.class */ "./ts/tag/TagSupport.class.ts");
/* harmony import */ var _render_renderSubjectComponent_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../render/renderSubjectComponent.function */ "./ts/tag/render/renderSubjectComponent.function.ts");




function processSubjectComponent(templater, subject, insertBefore, ownerSupport, options) {
    // Check if function component is wrapped in a tag() call
    // TODO: This below check not needed in production mode
    if (templater.tagged !== true) {
        const wrapper = templater.wrapper;
        const original = wrapper.parentWrap.original;
        let name = original.name || original.constructor?.name;
        if (name === 'Function') {
            name = undefined;
        }
        const label = name || original.toString().substring(0, 120);
        const error = new Error(`Not a tag component. Wrap your function with tag(). Example tag(props => html\`\`) on component:\n\n${label}\n\n`);
        throw error;
    }
    const tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_2__.TagSupport(templater, ownerSupport, subject);
    let reSupport = subject.tagSupport;
    const global = tagSupport.global = reSupport?.global || tagSupport.global;
    global.insertBefore = insertBefore;
    const providers = _state__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.providerConfig;
    providers.ownerSupport = ownerSupport;
    const isRender = !reSupport;
    if (isRender) {
        const support = reSupport || tagSupport;
        reSupport = (0,_render_renderSubjectComponent_function__WEBPACK_IMPORTED_MODULE_3__.renderSubjectComponent)(subject, support, ownerSupport);
    }
    (0,_processTagResult_function__WEBPACK_IMPORTED_MODULE_1__.processTagResult)(reSupport, subject, // The element set here will be removed from document. Also result.tag will be added in here
    insertBefore, // <template end interpolate /> (will be removed)
    options);
    return reSupport;
}


/***/ }),

/***/ "./ts/tag/update/processTag.function.ts":
/*!**********************************************!*\
  !*** ./ts/tag/update/processTag.function.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFakeTemplater: () => (/* binding */ getFakeTemplater),
/* harmony export */   processTag: () => (/* binding */ processTag),
/* harmony export */   setupNewTemplater: () => (/* binding */ setupNewTemplater),
/* harmony export */   tagFakeTemplater: () => (/* binding */ tagFakeTemplater)
/* harmony export */ });
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TagSupport.class */ "./ts/tag/TagSupport.class.ts");
/* harmony import */ var _subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../subject */ "./ts/subject/index.ts");


/** Could be a regular tag or a component. Both are Tag.class */
function processTag(templater, insertBefore, ownerSupport, // owner
subject) {
    let tagSupport = subject.tagSupport;
    // first time seeing this tag?
    if (!tagSupport) {
        tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__.TagSupport(templater, ownerSupport, subject);
        setupNewTemplater(tagSupport, ownerSupport, subject);
        ownerSupport.childTags.push(tagSupport);
    }
    subject.tagSupport = tagSupport;
    tagSupport.ownerTagSupport = ownerSupport;
    tagSupport.buildBeforeElement(insertBefore, {
        counts: { added: 0, removed: 0 },
    });
}
function setupNewTemplater(tagSupport, ownerSupport, subject) {
    tagSupport.global.oldest = tagSupport;
    tagSupport.global.newest = tagSupport;
    // asking me to render will cause my parent to render
    tagSupport.ownerTagSupport = ownerSupport;
    subject.tagSupport = tagSupport;
}
function tagFakeTemplater(tag) {
    const templater = getFakeTemplater();
    templater.tag = tag;
    tag.templater = templater;
    return templater;
}
function getFakeTemplater() {
    const fake = {
        children: new _subject__WEBPACK_IMPORTED_MODULE_1__.ValueSubject([]), // no children
        // props: {} as Props,
        props: [],
        isTag: true,
        isTemplater: false,
        tagged: false,
        madeChildIntoSubject: false,
        html: () => fake
    };
    return fake;
}


/***/ }),

/***/ "./ts/tag/update/processTagArray.ts":
/*!******************************************!*\
  !*** ./ts/tag/update/processTagArray.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processTagArray: () => (/* binding */ processTagArray)
/* harmony export */ });
/* harmony import */ var _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../subject/ValueSubject */ "./ts/subject/ValueSubject.ts");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors */ "./ts/errors.ts");
/* harmony import */ var _checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../checkDestroyPrevious.function */ "./ts/tag/checkDestroyPrevious.function.ts");
/* harmony import */ var _processTag_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./processTag.function */ "./ts/tag/update/processTag.function.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../TagSupport.class */ "./ts/tag/TagSupport.class.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../isInstance */ "./ts/isInstance.ts");






function processTagArray(subject, value, // arry of Tag classes
insertBefore, // <template end interpolate />
ownerSupport, options) {
    const clones = ownerSupport.clones; // []
    let lastArray = subject.lastArray = subject.lastArray || [];
    if (!subject.placeholder) {
        setPlaceholderElm(insertBefore, subject);
    }
    const runtimeInsertBefore = subject.placeholder; // || insertBefore
    let removed = 0;
    /** 🗑️ remove previous items first */
    lastArray = subject.lastArray = subject.lastArray.filter((item, index) => {
        const newLength = value.length - 1;
        const at = index - removed;
        const lessLength = newLength < at;
        const subValue = value[index - removed];
        const subTag = subValue;
        // const tag = subTag?.templater.tag as Tag
        const lastTag = item.tagSupport.templater.tag;
        const newArrayValue = subTag?.memory.arrayValue;
        const lastArrayValue = lastTag.memory.arrayValue;
        const destroyItem = lessLength || !areLikeValues(newArrayValue, lastArrayValue);
        if (destroyItem) {
            const last = lastArray[index];
            const tagSupport = last.tagSupport;
            (0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_2__.destroyArrayTag)(tagSupport, options.counts);
            last.deleted = true;
            ++removed;
            ++options.counts.removed;
            return false;
        }
        return true;
    });
    const length = value.length;
    for (let index = 0; index < length; ++index) {
        const item = value[index];
        const previous = lastArray[index];
        const previousSupport = previous?.tagSupport;
        const subTag = item;
        if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_5__.isTagClass)(subTag) && !subTag.templater) {
            (0,_processTag_function__WEBPACK_IMPORTED_MODULE_3__.tagFakeTemplater)(subTag);
        }
        const tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_4__.TagSupport(subTag.templater, ownerSupport, new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(undefined));
        if (previousSupport) {
            (0,_processTag_function__WEBPACK_IMPORTED_MODULE_3__.setupNewTemplater)(tagSupport, ownerSupport, previousSupport.subject);
            const global = previousSupport.global;
            tagSupport.global = global;
            global.newest = tagSupport;
        }
        // check for html``.key()
        const keySet = 'arrayValue' in subTag.memory;
        if (!keySet) {
            const details = {
                template: tagSupport.getTemplate().string,
                array: value,
            };
            const message = 'Use html`...`.key(item) instead of html`...` to template an Array';
            console.error(message, details);
            const err = new _errors__WEBPACK_IMPORTED_MODULE_1__.ArrayNoKeyError(message, details);
            throw err;
        }
        const couldBeSame = lastArray.length > index;
        if (couldBeSame) {
            const prevSupport = previous.tagSupport;
            const prevGlobal = prevSupport.global;
            // subTag.tagSupport = subTag.tagSupport || prevSupport
            const oldest = prevGlobal.oldest;
            oldest.updateBy(tagSupport);
            // return []
            continue;
        }
        processAddTagArrayItem(runtimeInsertBefore, tagSupport, index, options, lastArray);
        ownerSupport.childTags.push(tagSupport);
    }
    return clones;
}
function setPlaceholderElm(insertBefore, subject) {
    if (insertBefore.nodeName !== 'TEMPLATE') {
        subject.placeholder = insertBefore;
        return;
    }
    const placeholder = subject.placeholder = document.createTextNode('');
    const parentNode = insertBefore.parentNode;
    parentNode.insertBefore(placeholder, insertBefore);
    parentNode.removeChild(insertBefore);
}
function processAddTagArrayItem(before, tagSupport, index, options, lastArray) {
    const lastValue = {
        tagSupport, index
    };
    // Added to previous array
    lastArray.push(lastValue);
    const counts = {
        added: options.counts.added + index,
        removed: options.counts.removed,
    };
    const fragment = document.createDocumentFragment();
    const newTempElm = document.createElement('template');
    fragment.appendChild(newTempElm);
    tagSupport.buildBeforeElement(newTempElm, // before,
    { counts });
    const parent = before.parentNode;
    parent.insertBefore(fragment, before);
}
/** compare two values. If both values are arrays then the items will be compared */
function areLikeValues(valueA, valueB) {
    if (valueA === valueB) {
        return true;
    }
    const bothArrays = valueA instanceof Array && valueB instanceof Array;
    const matchLengths = bothArrays && valueA.length == valueB.length;
    if (matchLengths) {
        return valueA.every((item, index) => item == valueB[index]);
    }
    return false;
}


/***/ }),

/***/ "./ts/tag/update/processTagResult.function.ts":
/*!****************************************************!*\
  !*** ./ts/tag/update/processTagResult.function.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processTagResult: () => (/* binding */ processTagResult)
/* harmony export */ });
function processTagResult(tagSupport, subject, // used for recording past and current value
insertBefore, // <template end interpolate />
{ counts, }) {
    // *if appears we already have seen
    const subjectTag = subject;
    const lastSupport = subjectTag.tagSupport;
    const prevSupport = lastSupport?.global.oldest || undefined;
    const justUpdate = prevSupport;
    if (prevSupport && justUpdate) {
        return processTagResultUpdate(tagSupport, subjectTag, prevSupport);
    }
    tagSupport.buildBeforeElement(insertBefore, {
        counts,
    });
}
function processTagResultUpdate(tagSupport, subject, // used for recording past and current value
prevSupport) {
    // components
    if (subject instanceof Function) {
        const newSupport = subject(prevSupport);
        prevSupport.updateBy(newSupport);
        subject.tagSupport = newSupport;
        return;
    }
    prevSupport.updateBy(tagSupport);
    subject.tagSupport = tagSupport;
    return;
}


/***/ }),

/***/ "./ts/tag/update/updateContextItem.function.ts":
/*!*****************************************************!*\
  !*** ./ts/tag/update/updateContextItem.function.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateContextItem: () => (/* binding */ updateContextItem)
/* harmony export */ });
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../TagSupport.class */ "./ts/tag/TagSupport.class.ts");


function updateContextItem(context, variableName, value) {
    const subject = context[variableName];
    const tagSubject = subject;
    const tagSupport = tagSubject.tagSupport;
    if (tagSupport) {
        if (value) {
            if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagComponent)(value)) {
                const templater = value;
                let newSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_1__.TagSupport(templater, tagSupport.ownerTagSupport, subject);
                if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagComponent)(tagSupport)) {
                    shareTemplaterGlobal(tagSupport, newSupport);
                }
            }
        }
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isSubjectInstance)(value)) {
        return; // emits on its own
    }
    // listeners will evaluate updated values to possibly update display(s)
    subject.set(value);
    return;
}
function shareTemplaterGlobal(oldTagSupport, tagSupport) {
    const oldTemp = oldTagSupport.templater;
    const oldWrap = oldTemp.wrapper; // tag versus component
    const oldValueFn = oldWrap.parentWrap.original;
    const templater = tagSupport.templater;
    const newWrapper = templater.wrapper;
    const newValueFn = newWrapper?.parentWrap.original;
    const fnMatched = oldValueFn === newValueFn;
    if (fnMatched) {
        tagSupport.global = oldTagSupport.global;
        const newest = oldTagSupport.global.newest;
        if (newest) {
            const prevState = newest.memory.state;
            tagSupport.memory.state.length = 0;
            tagSupport.memory.state.push(...prevState);
            // tagSupport.memory.state = [...prevState]
        }
    }
}


/***/ }),

/***/ "./ts/tag/update/updateExistingTagComponent.function.ts":
/*!**************************************************************!*\
  !*** ./ts/tag/update/updateExistingTagComponent.function.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateExistingTagComponent: () => (/* binding */ updateExistingTagComponent)
/* harmony export */ });
/* harmony import */ var _hasTagSupportChanged_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hasTagSupportChanged.function */ "./ts/tag/hasTagSupportChanged.function.ts");
/* harmony import */ var _processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./processSubjectComponent.function */ "./ts/tag/update/processSubjectComponent.function.ts");
/* harmony import */ var _destroyTag_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../destroyTag.function */ "./ts/tag/destroyTag.function.ts");
/* harmony import */ var _render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../render/renderTagSupport.function */ "./ts/tag/render/renderTagSupport.function.ts");
/* harmony import */ var _alterProps_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../alterProps.function */ "./ts/alterProps.function.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../isLikeTags.function */ "./ts/tag/isLikeTags.function.ts");






function updateExistingTagComponent(ownerSupport, tagSupport, // lastest
subject, insertBefore) {
    let lastSupport = subject.tagSupport?.global.newest; // || subject.tagSupport
    let oldestTag = lastSupport.global.oldest;
    const oldWrapper = lastSupport.templater.wrapper;
    const newWrapper = tagSupport.templater.wrapper;
    let isSameTag = false;
    if (oldWrapper && newWrapper) {
        const oldFunction = oldWrapper.parentWrap.original;
        const newFunction = newWrapper.parentWrap.original;
        // string compare both functions
        isSameTag = oldFunction === newFunction;
    }
    const templater = tagSupport.templater;
    if (!isSameTag) {
        const oldestSupport = lastSupport.global.oldest;
        (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(oldestSupport);
        return (0,_processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_1__.processSubjectComponent)(templater, subject, insertBefore, ownerSupport, {
            counts: { added: 0, removed: 0 },
        });
    }
    else {
        const hasChanged = (0,_hasTagSupportChanged_function__WEBPACK_IMPORTED_MODULE_0__.hasTagSupportChanged)(lastSupport, tagSupport, templater);
        if (!hasChanged) {
            // if the new props are an object then implicitly since no change, the old props are an object
            const newProps = templater.props;
            syncFunctionProps(lastSupport, ownerSupport, newProps);
            return lastSupport; // its the same tag component
        }
    }
    const previous = lastSupport.global.newest;
    const newSupport = (0,_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_3__.renderTagSupport)(tagSupport, false);
    lastSupport = subject.tagSupport;
    const newOldest = newSupport.global.oldest;
    const hasOldest = newOldest ? true : false;
    if (!hasOldest) {
        return buildNewTag(newSupport, insertBefore, lastSupport, subject);
    }
    if (newOldest && templater.children.value.length) {
        const oldKidsSub = newOldest.templater.children;
        oldKidsSub.set(templater.children.value);
    }
    // detect if both the function is the same and the return is the same
    const isLikeTag = isSameTag && (0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_5__.isLikeTags)(previous, newSupport);
    if (isLikeTag) {
        subject.tagSupport = newSupport;
        oldestTag.updateBy(newSupport); // the oldest tag has element references
        return newSupport;
    }
    else {
        // Although function looked the same it returned a different html result
        if (isSameTag && lastSupport) {
            (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(lastSupport);
            newSupport.global.context = {}; // do not share previous outputs
        }
        oldestTag = undefined;
    }
    if (!oldestTag) {
        lastSupport = newSupport;
        buildNewTag(newSupport, lastSupport.global.insertBefore, lastSupport, subject);
    }
    lastSupport.global.newest = newSupport;
    return newSupport;
}
function buildNewTag(newSupport, oldInsertBefore, oldTagSupport, subject) {
    newSupport.buildBeforeElement(oldInsertBefore, {
        counts: { added: 0, removed: 0 },
    });
    newSupport.global.oldest = newSupport;
    newSupport.global.newest = newSupport;
    oldTagSupport.global.oldest = newSupport;
    oldTagSupport.global.newest = newSupport;
    subject.tagSupport = newSupport;
    return newSupport;
}
function syncFunctionProps(lastSupport, ownerSupport, newPropsArray) {
    lastSupport = lastSupport.global.newest || lastSupport;
    const priorPropConfig = lastSupport.propsConfig;
    const priorPropsArray = priorPropConfig.latestCloned;
    const prevSupport = ownerSupport.global.newest;
    for (let index = newPropsArray.length - 1; index >= 0; --index) {
        const argPosition = newPropsArray[index];
        if (typeof (argPosition) !== 'object') {
            return;
        }
        const priorProps = priorPropsArray[index];
        if (typeof (priorProps) !== 'object') {
            return;
        }
        for (const name in argPosition) {
            const value = argPosition[name];
            if (!(value instanceof Function)) {
                continue;
            }
            const newCallback = argPosition[name]; // || value
            const original = newCallback instanceof Function && newCallback.toCall;
            if (original) {
                continue; // already previously converted
            }
            // Currently, call self but over parent state changes, I may need to call a newer parent tag owner
            priorProps[name].toCall = (...args) => {
                return (0,_alterProps_function__WEBPACK_IMPORTED_MODULE_4__.callbackPropOwner)(newCallback, // value, // newOriginal,
                args, prevSupport);
            };
        }
    }
}


/***/ }),

/***/ "./ts/tag/update/updateExistingValue.function.ts":
/*!*******************************************************!*\
  !*** ./ts/tag/update/updateExistingValue.function.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateExistingValue: () => (/* binding */ updateExistingValue)
/* harmony export */ });
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TagSupport.class */ "./ts/tag/TagSupport.class.ts");
/* harmony import */ var _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../TemplaterResult.class */ "./ts/TemplaterResult.class.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./processFirstSubject.utils */ "./ts/tag/update/processFirstSubject.utils.ts");
/* harmony import */ var _processTagArray__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./processTagArray */ "./ts/tag/update/processTagArray.ts");
/* harmony import */ var _updateExistingTagComponent_function__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./updateExistingTagComponent.function */ "./ts/tag/update/updateExistingTagComponent.function.ts");
/* harmony import */ var _processRegularValue_function__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./processRegularValue.function */ "./ts/tag/update/processRegularValue.function.ts");
/* harmony import */ var _checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../checkDestroyPrevious.function */ "./ts/tag/checkDestroyPrevious.function.ts");
/* harmony import */ var _processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./processSubjectComponent.function */ "./ts/tag/update/processSubjectComponent.function.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../isLikeTags.function */ "./ts/tag/isLikeTags.function.ts");
/* harmony import */ var _processTag_function__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./processTag.function */ "./ts/tag/update/processTag.function.ts");
/* harmony import */ var _setTagPlaceholder_function__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../setTagPlaceholder.function */ "./ts/tag/setTagPlaceholder.function.ts");












function updateExistingValue(subject, value, ownerSupport, insertBefore) {
    const subjectTag = subject;
    const valueType = (0,_processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.getValueType)(value);
    (0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_7__.checkDestroyPrevious)(subject, value, insertBefore);
    // handle already seen tag components
    if (valueType === _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.ValueTypes.tagComponent) {
        return prepareUpdateToComponent(value, subjectTag, insertBefore, ownerSupport);
    }
    // was component but no longer
    const tagSupport = subjectTag.tagSupport;
    if (tagSupport) {
        handleStillTag(subject, value, ownerSupport);
        return subjectTag;
    }
    switch (valueType) {
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.ValueTypes.tagArray:
            (0,_processTagArray__WEBPACK_IMPORTED_MODULE_4__.processTagArray)(subject, value, insertBefore, // oldInsertBefore as InsertBefore,
            ownerSupport, { counts: {
                    added: 0,
                    removed: 0,
                } });
            return subject;
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.ValueTypes.templater:
            (0,_processTag_function__WEBPACK_IMPORTED_MODULE_10__.processTag)(value, insertBefore, ownerSupport, subjectTag);
            return subjectTag;
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.ValueTypes.tag:
            const tag = value;
            let templater = tag.templater;
            if (!templater) {
                templater = (0,_processTag_function__WEBPACK_IMPORTED_MODULE_10__.getFakeTemplater)();
                tag.templater = templater;
                templater.tag = tag;
            }
            (0,_processTag_function__WEBPACK_IMPORTED_MODULE_10__.processTag)(templater, insertBefore, ownerSupport, subjectTag);
            return subjectTag;
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.ValueTypes.subject:
            return value;
        // now its a useless function (we don't automatically call functions)
        case _processFirstSubject_utils__WEBPACK_IMPORTED_MODULE_3__.ValueTypes.function:
            // const bound = bindSubjectCallback(value as Callback, ownerSupport)
            // subject.set(bound)
            if (!subject.clone) {
                subject.clone = (0,_setTagPlaceholder_function__WEBPACK_IMPORTED_MODULE_11__.swapInsertBefore)(insertBefore);
            }
            return subject;
    }
    // This will cause all other values to render
    (0,_processRegularValue_function__WEBPACK_IMPORTED_MODULE_6__.processRegularValue)(value, subject, insertBefore);
    return subjectTag;
}
function handleStillTag(subject, value, ownerSupport) {
    const lastSupport = subject.tagSupport;
    let templater = value;
    const isClass = (0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isTagClass)(value);
    if (isClass) {
        const tag = value;
        templater = tag.templater;
        if (!templater) {
            templater = new _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_1__.TemplaterResult([]);
            templater.tag = tag;
            tag.templater = templater;
        }
    }
    const valueSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__.TagSupport(templater, ownerSupport, subject);
    if (isClass) {
        valueSupport.global = lastSupport.global;
    }
    const isSameTag = value && (0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_9__.isLikeTags)(lastSupport, valueSupport);
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isTagTemplater)(value)) {
        (0,_processTag_function__WEBPACK_IMPORTED_MODULE_10__.setupNewTemplater)(valueSupport, ownerSupport, subject);
    }
    if (isSameTag) {
        lastSupport.updateBy(valueSupport);
        return;
    }
    if (isSameTag) {
        // const subjectTag = subject as TagSubject
        const global = lastSupport.global;
        const insertBefore = global.insertBefore;
        return (0,_processTag_function__WEBPACK_IMPORTED_MODULE_10__.processTag)(templater, insertBefore, ownerSupport, subject);
    }
    return (0,_processRegularValue_function__WEBPACK_IMPORTED_MODULE_6__.processRegularValue)(value, subject, subject.insertBefore);
}
function prepareUpdateToComponent(templater, subjectTag, insertBefore, ownerSupport) {
    // When last value was not a component
    if (!subjectTag.tagSupport) {
        (0,_processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_8__.processSubjectComponent)(templater, subjectTag, insertBefore, // oldInsertBefore as InsertBefore,
        ownerSupport, {
            counts: { added: 0, removed: 0 },
        });
        return subjectTag;
    }
    const tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__.TagSupport(templater, ownerSupport, subjectTag);
    const subjectSup = subjectTag.tagSupport;
    const prevSupport = subjectSup.global.newest;
    if (prevSupport) {
        const newestState = prevSupport.memory.state;
        tagSupport.memory.state.length = 0;
        tagSupport.memory.state.push(...newestState);
    }
    else {
        (0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_7__.restoreTagMarker)(subjectSup);
        (0,_processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_8__.processSubjectComponent)(templater, subjectTag, insertBefore, ownerSupport, {
            counts: { added: 0, removed: 0 },
        });
        return subjectTag;
    }
    tagSupport.global = subjectSup.global;
    subjectTag.tagSupport = tagSupport;
    (0,_updateExistingTagComponent_function__WEBPACK_IMPORTED_MODULE_5__.updateExistingTagComponent)(ownerSupport, tagSupport, // latest value
    subjectTag, insertBefore);
    return subjectTag;
}


/***/ }),

/***/ "./ts/updateBeforeTemplate.function.ts":
/*!*********************************************!*\
  !*** ./ts/updateBeforeTemplate.function.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   castTextValue: () => (/* binding */ castTextValue),
/* harmony export */   updateBeforeTemplate: () => (/* binding */ updateBeforeTemplate)
/* harmony export */ });
// Function to update the value of x
function updateBeforeTemplate(value, // value should be casted before calling here
lastFirstChild) {
    const parent = lastFirstChild.parentNode;
    // Insert the new value (never use innerHTML here)
    const textNode = document.createTextNode(value); // never innerHTML
    parent.insertBefore(textNode, lastFirstChild);
    /* remove existing nodes */
    parent.removeChild(lastFirstChild);
    return textNode;
}
function castTextValue(value) {
    // mimic React skipping to display EXCEPT for true does display on page
    if ([undefined, false, null].includes(value)) { // || value === true
        return '';
    }
    return value;
}


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./ts/index.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArrayNoKeyError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_2__.ArrayNoKeyError),
/* harmony export */   BaseTagSupport: () => (/* reexport safe */ _tag_TagSupport_class__WEBPACK_IMPORTED_MODULE_6__.BaseTagSupport),
/* harmony export */   StateMismatchError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_2__.StateMismatchError),
/* harmony export */   Subject: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.Subject),
/* harmony export */   SyncCallbackError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_2__.SyncCallbackError),
/* harmony export */   Tag: () => (/* reexport safe */ _tag_Tag_class__WEBPACK_IMPORTED_MODULE_10__.Tag),
/* harmony export */   TagError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_2__.TagError),
/* harmony export */   TagSupport: () => (/* reexport safe */ _tag_TagSupport_class__WEBPACK_IMPORTED_MODULE_6__.TagSupport),
/* harmony export */   ValueSubject: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.ValueSubject),
/* harmony export */   callback: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.callback),
/* harmony export */   callbackMaker: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.callbackMaker),
/* harmony export */   children: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.children),
/* harmony export */   combineLatest: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.combineLatest),
/* harmony export */   hmr: () => (/* binding */ hmr),
/* harmony export */   html: () => (/* reexport safe */ _tag_html__WEBPACK_IMPORTED_MODULE_1__.html),
/* harmony export */   interpolateElement: () => (/* reexport safe */ _interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_8__.interpolateElement),
/* harmony export */   interpolateString: () => (/* reexport safe */ _interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_8__.interpolateString),
/* harmony export */   isLikeValueSets: () => (/* reexport safe */ _tag_isLikeTags_function__WEBPACK_IMPORTED_MODULE_14__.isLikeValueSets),
/* harmony export */   isSubjectInstance: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_3__.isSubjectInstance),
/* harmony export */   isTag: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_3__.isTag),
/* harmony export */   isTagArray: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_3__.isTagArray),
/* harmony export */   isTagClass: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_3__.isTagClass),
/* harmony export */   isTagComponent: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_3__.isTagComponent),
/* harmony export */   isTagTemplater: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_3__.isTagTemplater),
/* harmony export */   kidsToTagArraySubject: () => (/* reexport safe */ _tag_tag__WEBPACK_IMPORTED_MODULE_0__.kidsToTagArraySubject),
/* harmony export */   letProp: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.letProp),
/* harmony export */   letState: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.letState),
/* harmony export */   onDestroy: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.onDestroy),
/* harmony export */   onInit: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.onInit),
/* harmony export */   providers: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.providers),
/* harmony export */   renderTagSupport: () => (/* reexport safe */ _tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_12__.renderTagSupport),
/* harmony export */   renderWithSupport: () => (/* reexport safe */ _tag_render_renderWithSupport_function__WEBPACK_IMPORTED_MODULE_13__.renderWithSupport),
/* harmony export */   runBeforeRender: () => (/* reexport safe */ _tag_tagRunner__WEBPACK_IMPORTED_MODULE_11__.runBeforeRender),
/* harmony export */   setUse: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.setUse),
/* harmony export */   state: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.state),
/* harmony export */   subject: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.subject),
/* harmony export */   tag: () => (/* reexport safe */ _tag_tag__WEBPACK_IMPORTED_MODULE_0__.tag),
/* harmony export */   tagElement: () => (/* reexport safe */ _tag_tagElement__WEBPACK_IMPORTED_MODULE_9__.tagElement),
/* harmony export */   tags: () => (/* reexport safe */ _tag_tag__WEBPACK_IMPORTED_MODULE_0__.tags),
/* harmony export */   watch: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_4__.watch),
/* harmony export */   willCallback: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.willCallback),
/* harmony export */   willPromise: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.willPromise),
/* harmony export */   willSubscribe: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.willSubscribe)
/* harmony export */ });
/* harmony import */ var _tag_tag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tag/tag */ "./ts/tag/tag.ts");
/* harmony import */ var _tag_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tag/html */ "./ts/tag/html.ts");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors */ "./ts/errors.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _state_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./state/index */ "./ts/state/index.ts");
/* harmony import */ var _subject_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./subject/index */ "./ts/subject/index.ts");
/* harmony import */ var _tag_TagSupport_class__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tag/TagSupport.class */ "./ts/tag/TagSupport.class.ts");
/* harmony import */ var _interpolations_ElementTargetEvent_interface__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./interpolations/ElementTargetEvent.interface */ "./ts/interpolations/ElementTargetEvent.interface.ts");
/* harmony import */ var _interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./interpolations/interpolateElement */ "./ts/interpolations/interpolateElement.ts");
/* harmony import */ var _tag_tagElement__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./tag/tagElement */ "./ts/tag/tagElement.ts");
/* harmony import */ var _tag_Tag_class__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./tag/Tag.class */ "./ts/tag/Tag.class.ts");
/* harmony import */ var _tag_tagRunner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./tag/tagRunner */ "./ts/tag/tagRunner.ts");
/* harmony import */ var _tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./tag/render/renderTagSupport.function */ "./ts/tag/render/renderTagSupport.function.ts");
/* harmony import */ var _tag_render_renderWithSupport_function__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./tag/render/renderWithSupport.function */ "./ts/tag/render/renderWithSupport.function.ts");
/* harmony import */ var _tag_isLikeTags_function__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./tag/isLikeTags.function */ "./ts/tag/isLikeTags.function.ts");
/* harmony import */ var _tag_render_renderTagOnly_function__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./tag/render/renderTagOnly.function */ "./ts/tag/render/renderTagOnly.function.ts");



















const hmr = {
    tagElement: _tag_tagElement__WEBPACK_IMPORTED_MODULE_9__.tagElement, renderWithSupport: _tag_render_renderWithSupport_function__WEBPACK_IMPORTED_MODULE_13__.renderWithSupport, renderTagSupport: _tag_render_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_12__.renderTagSupport,
    renderTagOnly: _tag_render_renderTagOnly_function__WEBPACK_IMPORTED_MODULE_15__.renderTagOnly,
};

})();

var __webpack_exports__ArrayNoKeyError = __webpack_exports__.ArrayNoKeyError;
var __webpack_exports__BaseTagSupport = __webpack_exports__.BaseTagSupport;
var __webpack_exports__StateMismatchError = __webpack_exports__.StateMismatchError;
var __webpack_exports__Subject = __webpack_exports__.Subject;
var __webpack_exports__SyncCallbackError = __webpack_exports__.SyncCallbackError;
var __webpack_exports__Tag = __webpack_exports__.Tag;
var __webpack_exports__TagError = __webpack_exports__.TagError;
var __webpack_exports__TagSupport = __webpack_exports__.TagSupport;
var __webpack_exports__ValueSubject = __webpack_exports__.ValueSubject;
var __webpack_exports__callback = __webpack_exports__.callback;
var __webpack_exports__callbackMaker = __webpack_exports__.callbackMaker;
var __webpack_exports__children = __webpack_exports__.children;
var __webpack_exports__combineLatest = __webpack_exports__.combineLatest;
var __webpack_exports__hmr = __webpack_exports__.hmr;
var __webpack_exports__html = __webpack_exports__.html;
var __webpack_exports__interpolateElement = __webpack_exports__.interpolateElement;
var __webpack_exports__interpolateString = __webpack_exports__.interpolateString;
var __webpack_exports__isLikeValueSets = __webpack_exports__.isLikeValueSets;
var __webpack_exports__isSubjectInstance = __webpack_exports__.isSubjectInstance;
var __webpack_exports__isTag = __webpack_exports__.isTag;
var __webpack_exports__isTagArray = __webpack_exports__.isTagArray;
var __webpack_exports__isTagClass = __webpack_exports__.isTagClass;
var __webpack_exports__isTagComponent = __webpack_exports__.isTagComponent;
var __webpack_exports__isTagTemplater = __webpack_exports__.isTagTemplater;
var __webpack_exports__kidsToTagArraySubject = __webpack_exports__.kidsToTagArraySubject;
var __webpack_exports__letProp = __webpack_exports__.letProp;
var __webpack_exports__letState = __webpack_exports__.letState;
var __webpack_exports__onDestroy = __webpack_exports__.onDestroy;
var __webpack_exports__onInit = __webpack_exports__.onInit;
var __webpack_exports__providers = __webpack_exports__.providers;
var __webpack_exports__renderTagSupport = __webpack_exports__.renderTagSupport;
var __webpack_exports__renderWithSupport = __webpack_exports__.renderWithSupport;
var __webpack_exports__runBeforeRender = __webpack_exports__.runBeforeRender;
var __webpack_exports__setUse = __webpack_exports__.setUse;
var __webpack_exports__state = __webpack_exports__.state;
var __webpack_exports__subject = __webpack_exports__.subject;
var __webpack_exports__tag = __webpack_exports__.tag;
var __webpack_exports__tagElement = __webpack_exports__.tagElement;
var __webpack_exports__tags = __webpack_exports__.tags;
var __webpack_exports__watch = __webpack_exports__.watch;
var __webpack_exports__willCallback = __webpack_exports__.willCallback;
var __webpack_exports__willPromise = __webpack_exports__.willPromise;
var __webpack_exports__willSubscribe = __webpack_exports__.willSubscribe;
export { __webpack_exports__ArrayNoKeyError as ArrayNoKeyError, __webpack_exports__BaseTagSupport as BaseTagSupport, __webpack_exports__StateMismatchError as StateMismatchError, __webpack_exports__Subject as Subject, __webpack_exports__SyncCallbackError as SyncCallbackError, __webpack_exports__Tag as Tag, __webpack_exports__TagError as TagError, __webpack_exports__TagSupport as TagSupport, __webpack_exports__ValueSubject as ValueSubject, __webpack_exports__callback as callback, __webpack_exports__callbackMaker as callbackMaker, __webpack_exports__children as children, __webpack_exports__combineLatest as combineLatest, __webpack_exports__hmr as hmr, __webpack_exports__html as html, __webpack_exports__interpolateElement as interpolateElement, __webpack_exports__interpolateString as interpolateString, __webpack_exports__isLikeValueSets as isLikeValueSets, __webpack_exports__isSubjectInstance as isSubjectInstance, __webpack_exports__isTag as isTag, __webpack_exports__isTagArray as isTagArray, __webpack_exports__isTagClass as isTagClass, __webpack_exports__isTagComponent as isTagComponent, __webpack_exports__isTagTemplater as isTagTemplater, __webpack_exports__kidsToTagArraySubject as kidsToTagArraySubject, __webpack_exports__letProp as letProp, __webpack_exports__letState as letState, __webpack_exports__onDestroy as onDestroy, __webpack_exports__onInit as onInit, __webpack_exports__providers as providers, __webpack_exports__renderTagSupport as renderTagSupport, __webpack_exports__renderWithSupport as renderWithSupport, __webpack_exports__runBeforeRender as runBeforeRender, __webpack_exports__setUse as setUse, __webpack_exports__state as state, __webpack_exports__subject as subject, __webpack_exports__tag as tag, __webpack_exports__tagElement as tagElement, __webpack_exports__tags as tags, __webpack_exports__watch as watch, __webpack_exports__willCallback as willCallback, __webpack_exports__willPromise as willPromise, __webpack_exports__willSubscribe as willSubscribe };

//# sourceMappingURL=bundle.js.map