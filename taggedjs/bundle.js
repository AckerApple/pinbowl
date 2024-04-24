/******/ var __webpack_modules__ = ({

/***/ "./ts/ElementTargetEvent.interface.ts":
/*!********************************************!*\
  !*** ./ts/ElementTargetEvent.interface.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./ts/Tag.class.ts":
/*!*************************!*\
  !*** ./ts/Tag.class.ts ***!
  \*************************/
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
}


/***/ }),

/***/ "./ts/TagSupport.class.ts":
/*!********************************!*\
  !*** ./ts/TagSupport.class.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseTagSupport: () => (/* binding */ BaseTagSupport),
/* harmony export */   TagSupport: () => (/* binding */ TagSupport)
/* harmony export */ });
/* harmony import */ var _Tag_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tag.class */ "./ts/Tag.class.ts");
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _cloneValueArray_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cloneValueArray.function */ "./ts/cloneValueArray.function.ts");
/* harmony import */ var _checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./checkDestroyPrevious.function */ "./ts/checkDestroyPrevious.function.ts");
/* harmony import */ var _tagRunner__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tagRunner */ "./ts/tagRunner.ts");
/* harmony import */ var _destroy_support__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./destroy.support */ "./ts/destroy.support.ts");
/* harmony import */ var _elementDestroyCheck_function__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./elementDestroyCheck.function */ "./ts/elementDestroyCheck.function.ts");
/* harmony import */ var _updateContextItem_function__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./updateContextItem.function */ "./ts/updateContextItem.function.ts");
/* harmony import */ var _processNewValue_function__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./processNewValue.function */ "./ts/processNewValue.function.ts");
/* harmony import */ var _setTagPlaceholder_function__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./setTagPlaceholder.function */ "./ts/setTagPlaceholder.function.ts");
/* harmony import */ var _interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./interpolations/interpolateElement */ "./ts/interpolations/interpolateElement.ts");
/* harmony import */ var _interpolations_interpolateTemplate__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./interpolations/interpolateTemplate */ "./ts/interpolations/interpolateTemplate.ts");
/* harmony import */ var _afterInterpolateElement_function__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./afterInterpolateElement.function */ "./ts/afterInterpolateElement.function.ts");














const prefixSearch = new RegExp(_Tag_class__WEBPACK_IMPORTED_MODULE_0__.variablePrefix, 'g');
/** used only for apps, otherwise use TagSupport */
class BaseTagSupport {
    templater;
    subject;
    isApp = true;
    appElement; // only seen on this.getAppElement().appElement
    propsConfig;
    // stays with current render
    memory = {
        // context: {}, // populated after reading interpolated.values array converted to an object {variable0, variable:1}
        state: [],
    };
    // travels with all rerenderings
    global = {
        context: {}, // populated after reading interpolated.values array converted to an object {variable0, variable:1}
        providers: [],
        /** Indicator of re-rending. Saves from double rending something already rendered */
        renderCount: 0,
        deleted: false,
        subscriptions: []
    };
    constructor(templater, subject) {
        this.templater = templater;
        this.subject = subject;
        const children = templater.children; // children tags passed in as arguments
        const kidValue = children.value;
        const props = templater.props; // natural props
        const latestCloned = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_1__.deepClone)(props);
        this.propsConfig = {
            latest: props,
            latestCloned, // assume its HTML children and then detect
            lastClonedKidValues: kidValue.map(kid => {
                const cloneValues = (0,_cloneValueArray_function__WEBPACK_IMPORTED_MODULE_3__.cloneValueArray)(kid.values);
                return cloneValues;
            })
        };
        // if the latest props are not HTML children, then clone the props for later render cycles to compare
        if (!(0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isTagTemplater)(props) && !(0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isTagClass)(props)) {
            this.propsConfig.latestCloned = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_1__.deepClone)(latestCloned);
        }
    }
}
class TagSupport extends BaseTagSupport {
    templater;
    ownerTagSupport;
    subject;
    version;
    isApp = false;
    hasLiveElements = false;
    childTags = []; // tags on me
    clones = []; // elements on document. Needed at destroy process to know what to destroy
    // may not be needed anymore?
    strings;
    values;
    lastTemplateString = undefined; // used to compare templates for updates
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
        const global = this.global;
        const subject = this.subject;
        // put back down the template tag
        const insertBefore = global.insertBefore;
        if (insertBefore.nodeName === 'TEMPLATE') {
            const placeholder = global.placeholder;
            if (placeholder && !('arrayValue' in this.memory)) {
                if (!options.byParent) {
                    (0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_4__.restoreTagMarker)(this, insertBefore);
                }
            }
        }
        delete global.placeholder;
        // the isComponent check maybe able to be removed
        const isComponent = (0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isTagComponent)(this) ? true : false;
        if (isComponent) {
            (0,_tagRunner__WEBPACK_IMPORTED_MODULE_5__.runBeforeDestroy)(this, this);
        }
        const childTags = options.byParent ? [] : (0,_destroy_support__WEBPACK_IMPORTED_MODULE_6__.getChildTagsToDestroy)(this.childTags);
        // signify that no further event rendering should take place by making logic think a render occurred during event
        // signify immediately child has been deleted (looked for during event processing)
        childTags.forEach(child => {
            const subGlobal = child.global;
            delete subGlobal.newest;
            subGlobal.deleted = true;
        });
        delete global.oldest;
        delete global.newest;
        global.deleted = true;
        this.hasLiveElements = false;
        delete subject.tagSupport;
        this.destroySubscriptions();
        let mainPromise;
        if (this.ownerTagSupport) {
            this.ownerTagSupport.childTags = this.ownerTagSupport.childTags.filter(child => child !== this);
        }
        if (!options.byParent) {
            const { stagger, promise } = this.destroyClones(options);
            options.stagger = stagger;
            if (promise) {
                mainPromise = promise;
            }
        }
        else {
            this.destroyClones();
        }
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
        const global = this.global;
        global.subscriptions.forEach(cloneSub => cloneSub.unsubscribe());
        global.subscriptions.length = 0;
    }
    destroyClones({ stagger } = {
        stagger: 0,
    }) {
        //const promises = this.clones.reverse().map(
        const promises = this.clones.map(clone => this.checkCloneRemoval(clone, stagger)).filter(x => x); // only return promises
        this.clones.length = 0; // tag maybe used for something else
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
            clone.parentNode?.removeChild(clone);
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
    update() {
        return this.updateContext(this.global.context);
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
    updateContext(context) {
        const thisTag = this.templater.tag;
        const strings = this.strings || thisTag.strings;
        const values = this.values || thisTag.values;
        strings.map((_string, index) => {
            const variableName = _Tag_class__WEBPACK_IMPORTED_MODULE_0__.variablePrefix + index;
            const hasValue = values.length > index;
            const value = values[index];
            // is something already there?
            const exists = variableName in context;
            if (exists) {
                return (0,_updateContextItem_function__WEBPACK_IMPORTED_MODULE_8__.updateContextItem)(context, variableName, value);
            }
            if (!hasValue) {
                return;
            }
            // 🆕 First time values below
            context[variableName] = (0,_processNewValue_function__WEBPACK_IMPORTED_MODULE_9__.processNewValue)(hasValue, value, this);
        });
        return context;
    }
    /** Function that kicks off actually putting tags down as HTML elements */
    buildBeforeElement(insertBefore, options = {
        forceElement: false,
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
        // remove old clones
        if (this.clones.length) {
            this.clones.forEach(clone => this.checkCloneRemoval(clone, 0));
        }
        global.insertBefore = insertBefore;
        const context = this.update();
        const template = this.getTemplate();
        const elementContainer = document.createElement('div');
        elementContainer.id = 'tag-temp-holder';
        // render content with a first child that we can know is our first element
        elementContainer.innerHTML = `<template id="temp-template-tag-wrap">${template.string}</template>`;
        // Search/replace innerHTML variables but don't interpolate tag components just yet
        const { tagComponents } = (0,_interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_11__.interpolateElement)(elementContainer, context, template, this, // ownerSupport,
        {
            forceElement: options.forceElement,
            counts: options.counts
        });
        (0,_afterInterpolateElement_function__WEBPACK_IMPORTED_MODULE_13__.afterInterpolateElement)(elementContainer, placeholderElm, this, // ownerSupport
        context, options);
        // Any tag components that were found should be processed AFTER the owner processes its elements. Avoid double processing of elements attributes like (oninit)=${}
        let isForceElement = options.forceElement;
        tagComponents.forEach(tagComponent => {
            (0,_interpolations_interpolateTemplate__WEBPACK_IMPORTED_MODULE_12__.subscribeToTemplate)(tagComponent.insertBefore, tagComponent.subject, tagComponent.ownerSupport, options.counts, { isForceElement });
            (0,_afterInterpolateElement_function__WEBPACK_IMPORTED_MODULE_13__.afterInterpolateElement)(elementContainer, tagComponent.insertBefore, tagComponent.ownerSupport, // this, // ownerTag
            context, options);
        });
    }
    getTemplate() {
        const thisTag = this.templater.tag;
        const strings = this.strings || thisTag.strings;
        const values = this.values || thisTag.values;
        const string = strings.map((string, index) => {
            const safeString = string.replace(prefixSearch, _Tag_class__WEBPACK_IMPORTED_MODULE_0__.escapeVariable);
            const endString = safeString + (values.length > index ? `{${_Tag_class__WEBPACK_IMPORTED_MODULE_0__.variablePrefix}${index}}` : '');
            // const trimString = index === 0 || index === this.strings.length-1 ? endString.trim() : endString
            const trimString = endString.replace(/>\s*/g, '>').replace(/\s*</g, '<');
            return trimString;
        }).join('');
        const interpolation = (0,_interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_11__.interpolateString)(string);
        this.lastTemplateString = interpolation.string;
        return {
            interpolation,
            // string,
            string: interpolation.string,
            strings,
            values,
            context: this.global.context || {},
        };
    }
    /** Used during HMR only where static content itself could have been edited */
    rebuild() {
        // const insertBefore = this.insertBefore
        const insertBefore = this.global.insertBefore;
        if (!insertBefore) {
            const err = new Error('Cannot rebuild. Previous insertBefore element is not defined on tag');
            err.tag = this;
            throw err;
        }
        this.buildBeforeElement(insertBefore, {
            forceElement: true,
            counts: { added: 0, removed: 0 },
        });
    }
    getAppElement() {
        let tag = this;
        while (tag.ownerTagSupport) {
            tag = tag.ownerTagSupport;
        }
        return tag;
    }
}


/***/ }),

/***/ "./ts/TemplaterResult.class.ts":
/*!*************************************!*\
  !*** ./ts/TemplaterResult.class.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplaterResult: () => (/* binding */ TemplaterResult),
/* harmony export */   renderWithSupport: () => (/* binding */ renderWithSupport)
/* harmony export */ });
/* harmony import */ var _tagRunner__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tagRunner */ "./ts/tagRunner.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./ts/state/index.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLikeTags.function */ "./ts/isLikeTags.function.ts");
/* harmony import */ var _destroyTag_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./destroyTag.function */ "./ts/destroyTag.function.ts");




class TemplaterResult {
    props;
    children;
    isTemplater = true;
    tagged;
    wrapper;
    tag;
    constructor(props, children) {
        this.props = props;
        this.children = children;
    }
}
function renderWithSupport(tagSupport, // new
lastSupport, // previous
subject, // events & memory
ownerSupport) {
    /* BEFORE RENDER */
    const lastOwnerSupport = lastSupport?.ownerTagSupport;
    const runtimeOwnerSupport = lastOwnerSupport || ownerSupport;
    if (lastSupport) {
        const lastState = lastSupport.memory.state;
        const memory = tagSupport.memory;
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
    /* END: BEFORE RENDER */
    const templater = tagSupport.templater;
    const subTag = subject.tagSupport;
    // NEW TAG CREATED HERE
    const wrapper = templater.wrapper;
    const reSupport = wrapper(tagSupport, subject);
    /* AFTER */
    (0,_tagRunner__WEBPACK_IMPORTED_MODULE_0__.runAfterRender)(tagSupport, reSupport);
    const isLikeTag = !lastSupport || (0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_2__.isLikeTags)(lastSupport, reSupport);
    if (!isLikeTag) {
        destroyUnlikeTags(lastSupport, reSupport, subject);
    }
    reSupport.ownerTagSupport = (ownerSupport || lastOwnerSupport);
    tagSupport.global.newest = reSupport;
    return reSupport;
}
function destroyUnlikeTags(lastSupport, // old
reSupport, // new
subject) {
    const oldGlobal = lastSupport.global;
    const insertBefore = oldGlobal.insertBefore;
    (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_3__.destroyTagMemory)(lastSupport, subject);
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

/***/ "./ts/afterInterpolateElement.function.ts":
/*!************************************************!*\
  !*** ./ts/afterInterpolateElement.function.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterInterpolateElement: () => (/* binding */ afterInterpolateElement)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./ts/render.ts");
/* harmony import */ var _interpolations_interpolateTemplate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interpolations/interpolateTemplate */ "./ts/interpolations/interpolateTemplate.ts");


function afterInterpolateElement(container, insertBefore, tagSupport, 
// preClones: Clones,
context, options) {
    const clones = (0,_render__WEBPACK_IMPORTED_MODULE_0__.buildClones)(container, insertBefore);
    if (!clones.length) {
        return clones;
    }
    clones.forEach(clone => (0,_interpolations_interpolateTemplate__WEBPACK_IMPORTED_MODULE_1__.afterElmBuild)(clone, options, context, tagSupport));
    tagSupport.clones.push(...clones);
    return clones;
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
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderTagSupport.function */ "./ts/renderTagSupport.function.ts");


/* Used to rewrite props that are functions. When they are called it should cause parent rendering */
function alterProps(props, ownerSupport) {
    function callback(toCall, callWith) {
        return callbackPropOwner(toCall, callWith, ownerSupport);
    }
    const isPropTag = (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTag)(props);
    const watchProps = isPropTag ? 0 : props;
    const newProps = resetFunctionProps(watchProps, callback);
    return newProps;
}
function resetFunctionProps(props, callback) {
    if (typeof (props) !== 'object') {
        return props;
    }
    const newProps = props;
    // BELOW: Do not clone because if first argument is object, the memory ref back is lost
    // const newProps = {...props} 
    Object.entries(newProps).forEach(([name, value]) => {
        if (value instanceof Function) {
            const original = newProps[name].original;
            if (original) {
                return; // already previously converted
            }
            newProps[name] = (...args) => {
                return newProps[name].toCall(...args); // what gets called can switch over parent state changes
            };
            // Currently, call self but over parent state changes, I may need to call a newer parent tag owner
            newProps[name].toCall = (...args) => callback(value, args);
            newProps[name].original = value;
            return;
        }
    });
    return newProps;
}
function callbackPropOwner(toCall, callWith, ownerSupport) {
    const callbackResult = toCall(...callWith);
    const lastestOwner = ownerSupport.global.newest;
    (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__.renderTagSupport)(lastestOwner, true);
    return callbackResult;
}


/***/ }),

/***/ "./ts/checkDestroyPrevious.function.ts":
/*!*********************************************!*\
  !*** ./ts/checkDestroyPrevious.function.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkDestroyPrevious: () => (/* binding */ checkDestroyPrevious),
/* harmony export */   destroyArrayTag: () => (/* binding */ destroyArrayTag),
/* harmony export */   restoreTagMarker: () => (/* binding */ restoreTagMarker)
/* harmony export */ });
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isLikeTags.function */ "./ts/isLikeTags.function.ts");
/* harmony import */ var _destroyTag_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./destroyTag.function */ "./ts/destroyTag.function.ts");
/* harmony import */ var _insertAfter_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./insertAfter.function */ "./ts/insertAfter.function.ts");




function checkDestroyPrevious(subject, // existing.value is the old value
newValue, insertBefore) {
    const arraySubject = subject;
    const wasArray = arraySubject.lastArray;
    // no longer an array
    if (wasArray && !(0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagArray)(newValue)) {
        const placeholderElm = arraySubject.placeholder;
        delete arraySubject.lastArray;
        delete arraySubject.placeholder;
        (0,_insertAfter_function__WEBPACK_IMPORTED_MODULE_3__.insertAfter)(insertBefore, placeholderElm);
        wasArray.forEach(({ tagSupport }) => destroyArrayTag(tagSupport, { added: 0, removed: 0 }));
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
                restoreTagMarker(lastSupport, insertBefore);
                (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(lastSupport, tagSubject);
                return 2;
            }
            return false;
        }
        const isValueTagComponent = (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagComponent)(newValue);
        if (isValueTagComponent) {
            return false; // its still a tag component
        }
        // put template back down
        restoreTagMarker(lastSupport, insertBefore);
        // destroy old component, value is not a component
        (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(lastSupport, tagSubject);
        return 'different-tag';
    }
    const displaySubject = subject;
    const hasLastValue = 'lastValue' in displaySubject;
    const lastValue = displaySubject.lastValue; // TODO: we maybe able to use displaySubject.value and remove concept of lastValue
    // was simple value but now something bigger
    if (hasLastValue && lastValue !== newValue) {
        destroySimpleValue(insertBefore, displaySubject);
        return 'changed-simple-value';
    }
    return false;
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
function restoreTagMarker(lastSupport, insertBefore) {
    const global = lastSupport.global;
    const placeholderElm = global.placeholder;
    if (placeholderElm) {
        (0,_insertAfter_function__WEBPACK_IMPORTED_MODULE_3__.insertAfter)(insertBefore, placeholderElm);
    }
}


/***/ }),

/***/ "./ts/cloneValueArray.function.ts":
/*!****************************************!*\
  !*** ./ts/cloneValueArray.function.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cloneValueArray: () => (/* binding */ cloneValueArray)
/* harmony export */ });
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");


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
            return false;
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

/***/ "./ts/destroy.support.ts":
/*!*******************************!*\
  !*** ./ts/destroy.support.ts ***!
  \*******************************/
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

/***/ "./ts/destroyTag.function.ts":
/*!***********************************!*\
  !*** ./ts/destroyTag.function.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   destroyTagMemory: () => (/* binding */ destroyTagMemory),
/* harmony export */   destroyTagSupportPast: () => (/* binding */ destroyTagSupportPast)
/* harmony export */ });
function destroyTagMemory(oldTagSupport, subject) {
    delete subject.tagSupport;
    delete oldTagSupport.subject.tagSupport; // TODO: this line maybe not needed
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

/***/ "./ts/elementDestroyCheck.function.ts":
/*!********************************************!*\
  !*** ./ts/elementDestroyCheck.function.ts ***!
  \********************************************/
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

/***/ "./ts/hasTagSupportChanged.function.ts":
/*!*********************************************!*\
  !*** ./ts/hasTagSupportChanged.function.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasKidsChanged: () => (/* binding */ hasKidsChanged),
/* harmony export */   hasPropChanges: () => (/* binding */ hasPropChanges),
/* harmony export */   hasTagSupportChanged: () => (/* binding */ hasTagSupportChanged)
/* harmony export */ });
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deepFunctions */ "./ts/deepFunctions.ts");

function hasTagSupportChanged(oldTagSupport, newTagSupport, newTemplater) {
    const latestProps = newTemplater.props; // newTagSupport.propsConfig.latest
    const pastCloneProps = oldTagSupport.propsConfig.latestCloned;
    const propsChanged = hasPropChanges(latestProps, pastCloneProps);
    // if no changes detected, no need to continue to rendering further tags
    if (propsChanged) {
        return propsChanged;
    }
    const kidsChanged = hasKidsChanged(oldTagSupport, newTagSupport);
    // we already know props didn't change and if kids didn't either, than don't render
    return kidsChanged;
}
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
        castedProps = { ...props };
        castedPastProps = { ...(pastCloneProps || {}) };
        const allFunctionsMatch = Object.entries(castedProps).every(([key, value]) => {
            let compare = castedPastProps[key];
            if (!(value instanceof Function)) {
                return 4; // this will be checked in deepEqual
            }
            if (!(compare instanceof Function)) {
                return false; // its a function now but was not before
            }
            // ensure we are comparing apples to apples as function get wrapped
            if (compare.original) {
                compare = compare.original;
            }
            const original = value.original;
            if (original) {
                value = value.original;
            }
            if (value.toString() !== compare.toString()) {
                return false; // both are function but not the same
            }
            delete castedProps[key]; // its a function and not needed to be compared
            delete castedPastProps[key]; // its a function and not needed to be compared
            return 5;
        });
        if (!allFunctionsMatch) {
            return 6; // a change has been detected by function comparisons
        }
    }
    const isEqual = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(castedPastProps, castedProps);
    return isEqual ? false : 7; // if equal then no changes
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

/***/ "./ts/html.ts":
/*!********************!*\
  !*** ./ts/html.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* binding */ html)
/* harmony export */ });
/* harmony import */ var _Tag_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tag.class */ "./ts/Tag.class.ts");

function html(strings, ...values) {
    return new _Tag_class__WEBPACK_IMPORTED_MODULE_0__.Tag(strings, values);
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
/* harmony import */ var _renderTagSupport_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../renderTagSupport.function */ "./ts/renderTagSupport.function.ts");
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
    const renderCount = tagSupport.global.renderCount;
    const method = value.bind(bindTo);
    const callbackResult = method(...args);
    const sameRenderCount = renderCount === tagSupport.global.renderCount;
    // already rendered OR tag was deleted before event processing
    if (!sameRenderCount || tagSupport.global.deleted) {
        if (callbackResult instanceof Promise) {
            return callbackResult.then(() => {
                return 'promise-no-data-ever'; // tag was deleted during event processing
            });
        }
        return 'no-data-ever'; // already rendered
    }
    (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_0__.renderTagSupport)(tagSupport, true);
    if (callbackResult instanceof Promise) {
        return callbackResult.then(() => {
            if (tagSupport.global.deleted) {
                return 'promise-no-data-ever'; // tag was deleted during event processing
            }
            (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_0__.renderTagSupport)(tagSupport, true);
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
            names.forEach(name => element.classList.add(name));
        }
        else {
            names.forEach(name => element.classList.remove(name));
        }
        return;
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
    attrNames.forEach(attrName => {
        if (child.nodeName === 'INPUT' && attrName === 'value') {
            howToSet = howToSetInputValue;
        }
        const value = child.getAttribute(attrName);
        (0,_processAttribute_function__WEBPACK_IMPORTED_MODULE_0__.processAttribute)(attrName, value, child, scope, ownerSupport, howToSet);
        howToSet = howToSetAttribute; // put back
    });
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

function interpolateContentTemplates(element, context, tagSupport, options, children) {
    if (!children || element.tagName === 'TEMPLATE') {
        return { clones: [], tagComponents: [] }; // done
    }
    // counting for animation stagger computing
    const counts = options.counts;
    const clones = [];
    const tagComponents = [];
    const childArray = new Array(...children);
    childArray.forEach(child => {
        const { clones: nextClones, tagComponent } = (0,_interpolateTemplate__WEBPACK_IMPORTED_MODULE_0__.interpolateTemplate)(child, context, tagSupport, counts, options);
        clones.push(...nextClones);
        if (tagComponent) {
            tagComponents.push(tagComponent);
            return;
        }
        if (child.children) {
            const nextKids = new Array(...child.children);
            nextKids.forEach((subChild, index) => {
                // IF <template end /> its a variable to be processed
                if (isRenderEndTemplate(subChild)) {
                    const { tagComponent } = (0,_interpolateTemplate__WEBPACK_IMPORTED_MODULE_0__.interpolateTemplate)(subChild, context, tagSupport, counts, options);
                    if (tagComponent) {
                        tagComponents.push(tagComponent);
                    }
                }
                const { clones: nextClones, tagComponents: nextTagComponent } = interpolateContentTemplates(subChild, context, tagSupport, options, subChild.children);
                clones.push(...nextClones);
                tagComponents.push(...nextTagComponent);
            });
        }
    });
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
/* harmony import */ var _Tag_class__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Tag.class */ "./ts/Tag.class.ts");




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
        const { clones: nextClones, tagComponents: nextTagComponents } = (0,_interpolateContentTemplates__WEBPACK_IMPORTED_MODULE_2__.interpolateContentTemplates)(container, context, ownerSupport, options, children);
        clones.push(...nextClones);
        tagComponents.push(...nextTagComponents);
    }
    (0,_interpolateAttributes__WEBPACK_IMPORTED_MODULE_0__.interpolateAttributes)(container, context, ownerSupport);
    processChildrenAttributes(children, context, ownerSupport);
    return { clones, tagComponents };
}
function processChildrenAttributes(children, context, ownerSupport) {
    new Array(...children).forEach(child => {
        (0,_interpolateAttributes__WEBPACK_IMPORTED_MODULE_0__.interpolateAttributes)(child, context, ownerSupport);
        if (child.children) {
            processChildrenAttributes(child.children, context, ownerSupport);
        }
    });
}
function interpolateString(string) {
    const result = (0,_interpolations__WEBPACK_IMPORTED_MODULE_1__.interpolateToTemplates)(string);
    result.string = result.string.replace(_Tag_class__WEBPACK_IMPORTED_MODULE_3__.escapeSearch, _Tag_class__WEBPACK_IMPORTED_MODULE_3__.variablePrefix);
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
/* harmony import */ var _Tag_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Tag.class */ "./ts/Tag.class.ts");
/* harmony import */ var _elementInitCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./elementInitCheck */ "./ts/interpolations/elementInitCheck.ts");
/* harmony import */ var _processSubjectValue_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../processSubjectValue.function */ "./ts/processSubjectValue.function.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _scanTextAreaValue_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scanTextAreaValue.function */ "./ts/interpolations/scanTextAreaValue.function.ts");
/* harmony import */ var _updateExistingValue_function__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../updateExistingValue.function */ "./ts/updateExistingValue.function.ts");






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
    if (variableName?.substring(0, _Tag_class__WEBPACK_IMPORTED_MODULE_0__.variablePrefix.length) !== _Tag_class__WEBPACK_IMPORTED_MODULE_0__.variablePrefix) {
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
    let isForceElement = options.forceElement;
    subscribeToTemplate(insertBefore, existingSubject, ownerSupport, counts, { isForceElement });
    return { clones };
}
function subscribeToTemplate(insertBefore, subject, ownerSupport, counts, // used for animation stagger computing
{ isForceElement }) {
    let called = false;
    const callback = (value) => {
        if (called) {
            (0,_updateExistingValue_function__WEBPACK_IMPORTED_MODULE_5__.updateExistingValue)(subject, value, ownerSupport, insertBefore);
            return;
        }
        const templater = value;
        (0,_processSubjectValue_function__WEBPACK_IMPORTED_MODULE_2__.processSubjectValue)(templater, subject, insertBefore, ownerSupport, {
            counts: { ...counts },
            forceElement: isForceElement,
        });
        if (isForceElement) {
            isForceElement = false; // only can happen once
        }
        called = true;
    };
    const sub = subject.subscribe(callback);
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
        new Array(...elm.children).forEach((child, index) => {
            const subOptions = {
                ...options,
                counts: options.counts,
            };
            return afterElmBuild(child, subOptions, context, ownerSupport);
        });
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
            Object.entries(lastValue).forEach(([name]) => child.removeAttribute(name));
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
        Object.entries(attrValue).forEach(([name, value]) => processNameValueAttr(name, value, child, ownerSupport, howToSet));
        return;
    }
}
function processNameValueAttr(attrName, result, child, ownerSupport, howToSet) {
    const isSpecial = isSpecialAttr(attrName);
    // attach as callback?
    if (result instanceof Function) {
        const action = function (...args) {
            const result2 = result(child, args);
            return result2;
        };
        child[attrName].action = action;
        // child.addEventListener(attrName, action)
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
function isTagComponent(value) {
    return value?.wrapper?.original instanceof Function;
}
function isTag(value) {
    return isTagTemplater(value) || isTagClass(value);
}
function isTagTemplater(value) {
    const templater = value;
    return templater?.isTemplater === true && templater.wrapper === undefined;
}
function isTagClass(value) {
    const templater = value;
    return templater?.isTagClass === true;
}
function isSubjectInstance(subject) {
    return (subject?.isSubject === true || subject?.subscribe) ? true : false; // subject?.isSubject === true || 
}
function isTagArray(value) {
    return value instanceof Array && value.every(x => isTagClass(x) || isTagTemplater(x));
}


/***/ }),

/***/ "./ts/isLikeTags.function.ts":
/*!***********************************!*\
  !*** ./ts/isLikeTags.function.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isLikeTags: () => (/* binding */ isLikeTags)
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

/***/ "./ts/processNewValue.function.ts":
/*!****************************************!*\
  !*** ./ts/processNewValue.function.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processNewValue: () => (/* binding */ processNewValue)
/* harmony export */ });
/* harmony import */ var _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subject/ValueSubject */ "./ts/subject/ValueSubject.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TemplaterResult.class */ "./ts/TemplaterResult.class.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");




function processNewValue(hasValue, value, ownerSupport) {
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagComponent)(value)) {
        const tagSubject = new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(value);
        return tagSubject;
    }
    if (value instanceof Function) {
        return new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(value);
    }
    if (!hasValue) {
        return new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(undefined);
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagTemplater)(value)) {
        const templater = value;
        const tag = templater.tag;
        return processNewTag(tag, ownerSupport);
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagClass)(value)) {
        return processNewTag(value, ownerSupport);
    }
    // is already a value subject?
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isSubjectInstance)(value)) {
        return value;
    }
    return new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(value);
}
function processNewTag(value, ownerSupport) {
    const tag = value;
    let templater = tag.templater;
    if (!templater) {
        const children = new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject([]);
        templater = new _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_2__.TemplaterResult(undefined, children);
        templater.tag = tag;
        tag.templater = templater;
    }
    const subject = new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(templater);
    const tagSupport = subject.tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_3__.TagSupport(templater, ownerSupport, subject);
    return subject;
}


/***/ }),

/***/ "./ts/processRegularValue.function.ts":
/*!********************************************!*\
  !*** ./ts/processRegularValue.function.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processRegularValue: () => (/* binding */ processRegularValue)
/* harmony export */ });
/* harmony import */ var _updateBeforeTemplate_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./updateBeforeTemplate.function */ "./ts/updateBeforeTemplate.function.ts");

function processRegularValue(value, subject, // could be tag via subject.tag
insertBefore) {
    subject.insertBefore = insertBefore;
    const before = subject.clone || insertBefore; // Either the template is on the doc OR its the first element we last put on doc
    // matches but also was defined at some point
    if (subject.lastValue === value && 'lastValue' in subject) {
        return; // no need to update display, its the same
    }
    subject.lastValue = value;
    // Processing of regular values
    const clone = (0,_updateBeforeTemplate_function__WEBPACK_IMPORTED_MODULE_0__.updateBeforeTemplate)(value, before);
    subject.clone = clone; // remember single element put down, for future updates
}


/***/ }),

/***/ "./ts/processSubjectComponent.function.ts":
/*!************************************************!*\
  !*** ./ts/processSubjectComponent.function.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processSubjectComponent: () => (/* binding */ processSubjectComponent)
/* harmony export */ });
/* harmony import */ var _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemplaterResult.class */ "./ts/TemplaterResult.class.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./ts/state/index.ts");
/* harmony import */ var _processTagResult_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./processTagResult.function */ "./ts/processTagResult.function.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");




function processSubjectComponent(templater, subject, insertBefore, ownerSupport, options) {
    // Check if function component is wrapped in a tag() call
    // TODO: This below check not needed in production mode
    if (templater.tagged !== true) {
        const wrapper = templater.wrapper;
        const original = wrapper.original;
        let name = original.name || original.constructor?.name;
        if (name === 'Function') {
            name = undefined;
        }
        const label = name || original.toString().substring(0, 120);
        const error = new Error(`Not a tag component. Wrap your function with tag(). Example tag(props => html\`\`) on component:\n\n${label}\n\n`);
        throw error;
    }
    const tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_3__.TagSupport(templater, ownerSupport, subject);
    let reSupport = subject.tagSupport;
    const global = tagSupport.global = reSupport?.global || tagSupport.global;
    global.insertBefore = insertBefore;
    const providers = _state__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
    providers.ownerSupport = ownerSupport;
    const isRender = !reSupport || options.forceElement;
    if (isRender) {
        const support = reSupport || tagSupport;
        reSupport = renderSubjectComponent(subject, support, ownerSupport);
    }
    (0,_processTagResult_function__WEBPACK_IMPORTED_MODULE_2__.processTagResult)(reSupport, subject, // The element set here will be removed from document. Also result.tag will be added in here
    insertBefore, // <template end interpolate /> (will be removed)
    options);
    return reSupport;
}
function renderSubjectComponent(subject, reSupport, ownerSupport) {
    const preClones = ownerSupport.clones.map(clone => clone);
    reSupport = (0,_TemplaterResult_class__WEBPACK_IMPORTED_MODULE_0__.renderWithSupport)(reSupport, subject.tagSupport, // existing tag
    subject, ownerSupport);
    reSupport.global.newest = reSupport;
    // ??? - mirroring add 0
    // reSupport.ownerTagSupport = ownerSupport
    if (ownerSupport.clones.length > preClones.length) {
        const myClones = ownerSupport.clones.filter(fClone => !preClones.find(clone => clone === fClone));
        reSupport.clones.push(...myClones);
    }
    ownerSupport.childTags.push(reSupport);
    return reSupport;
}


/***/ }),

/***/ "./ts/processSubjectValue.function.ts":
/*!********************************************!*\
  !*** ./ts/processSubjectValue.function.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processSubjectValue: () => (/* binding */ processSubjectValue)
/* harmony export */ });
/* harmony import */ var _processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./processSubjectComponent.function */ "./ts/processSubjectComponent.function.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _processTagArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./processTagArray */ "./ts/processTagArray.ts");
/* harmony import */ var _processRegularValue_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./processRegularValue.function */ "./ts/processRegularValue.function.ts");
/* harmony import */ var _processTag_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./processTag.function */ "./ts/processTag.function.ts");





var ValueTypes;
(function (ValueTypes) {
    ValueTypes["tag"] = "tag";
    ValueTypes["templater"] = "templater";
    ValueTypes["tagArray"] = "tag-array";
    ValueTypes["tagComponent"] = "tag-component";
    ValueTypes["value"] = "value";
})(ValueTypes || (ValueTypes = {}));
function getValueType(value) {
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagComponent)(value)) {
        return ValueTypes.tagComponent;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagTemplater)(value)) {
        return ValueTypes.templater;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagClass)(value)) {
        return ValueTypes.tag;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagArray)(value)) {
        return ValueTypes.tagArray;
    }
    return ValueTypes.value;
}
// export type ExistingValue = TemplaterResult | Tag[] | TagSupport | Function | Subject<unknown> | RegularValue | Tag
function processSubjectValue(value, subject, // could be tag via result.tag
insertBefore, // <template end interpolate /> (will be removed)
ownerSupport, // owner
options) {
    const valueType = getValueType(value);
    switch (valueType) {
        case ValueTypes.templater:
            (0,_processTag_function__WEBPACK_IMPORTED_MODULE_4__.processTag)(value, insertBefore, ownerSupport, subject);
            return;
        case ValueTypes.tag:
            const tag = value;
            let templater = tag.templater;
            if (!templater) {
                templater = (0,_processTag_function__WEBPACK_IMPORTED_MODULE_4__.tagFakeTemplater)(tag);
            }
            (0,_processTag_function__WEBPACK_IMPORTED_MODULE_4__.processTag)(templater, insertBefore, ownerSupport, subject);
            return;
        case ValueTypes.tagArray:
            return (0,_processTagArray__WEBPACK_IMPORTED_MODULE_2__.processTagArray)(subject, value, insertBefore, ownerSupport, options);
        case ValueTypes.tagComponent:
            (0,_processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_0__.processSubjectComponent)(value, subject, insertBefore, ownerSupport, options);
            return;
    }
    (0,_processRegularValue_function__WEBPACK_IMPORTED_MODULE_3__.processRegularValue)(value, subject, insertBefore);
}


/***/ }),

/***/ "./ts/processTag.function.ts":
/*!***********************************!*\
  !*** ./ts/processTag.function.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFakeTemplater: () => (/* binding */ getFakeTemplater),
/* harmony export */   processTag: () => (/* binding */ processTag),
/* harmony export */   setupNewTemplater: () => (/* binding */ setupNewTemplater),
/* harmony export */   tagFakeTemplater: () => (/* binding */ tagFakeTemplater)
/* harmony export */ });
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");
/* harmony import */ var _subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subject */ "./ts/subject/index.ts");


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
        forceElement: true,
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
    return {
        children: new _subject__WEBPACK_IMPORTED_MODULE_1__.ValueSubject([]), // no children
        props: {},
        isTag: true,
        isTemplater: false,
        tagged: false,
        // wrapper: (() => undefined) as unknown as Wrapper,
    };
}


/***/ }),

/***/ "./ts/processTagArray.ts":
/*!*******************************!*\
  !*** ./ts/processTagArray.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processTagArray: () => (/* binding */ processTagArray)
/* harmony export */ });
/* harmony import */ var _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subject/ValueSubject */ "./ts/subject/ValueSubject.ts");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors */ "./ts/errors.ts");
/* harmony import */ var _checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./checkDestroyPrevious.function */ "./ts/checkDestroyPrevious.function.ts");
/* harmony import */ var _processTag_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./processTag.function */ "./ts/processTag.function.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");






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
    value.forEach((item, index) => {
        const previous = lastArray[index];
        const previousSupport = previous?.tagSupport;
        const subTag = item;
        if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_5__.isTagClass)(subTag) && !subTag.templater) {
            (0,_processTag_function__WEBPACK_IMPORTED_MODULE_3__.tagFakeTemplater)(subTag);
        }
        const tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_4__.TagSupport(subTag.templater, ownerSupport, new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(undefined));
        // tagSupport.templater = subTag.templater
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
                ownerTagContent: ownerSupport.lastTemplateString,
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
            return [];
        }
        processAddTagArrayItem(runtimeInsertBefore, tagSupport, index, options, lastArray);
        ownerSupport.childTags.push(tagSupport);
    });
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
    const newTempElm = document.createElement('template');
    const parent = before.parentNode;
    parent.insertBefore(newTempElm, before);
    tagSupport.buildBeforeElement(newTempElm, // before,
    { counts, forceElement: options.forceElement });
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

/***/ "./ts/processTagResult.function.ts":
/*!*****************************************!*\
  !*** ./ts/processTagResult.function.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processTagResult: () => (/* binding */ processTagResult)
/* harmony export */ });
function processTagResult(tagSupport, subject, // used for recording past and current value
insertBefore, // <template end interpolate />
{ counts, forceElement, }) {
    // *if appears we already have seen
    const subjectTag = subject;
    const lastSupport = subjectTag.tagSupport;
    const prevSupport = lastSupport?.global.oldest || undefined; // || tag.tagSupport.oldest // subjectTag.tag
    const justUpdate = prevSupport; // && !forceElement
    if (prevSupport && justUpdate) {
        return processTagResultUpdate(tagSupport, subjectTag, prevSupport);
    }
    tagSupport.buildBeforeElement(insertBefore, {
        counts,
        forceElement,
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
    while (nextSibling) {
        const nextNextSibling = nextSibling.nextSibling;
        buildSibling(nextSibling, insertBefore);
        clones.push(nextSibling);
        nextSibling = nextNextSibling;
    }
    return clones;
}
function buildSibling(nextSibling, insertBefore) {
    const parentNode = insertBefore.parentNode;
    parentNode.insertBefore(nextSibling, insertBefore);
}


/***/ }),

/***/ "./ts/renderExistingTag.function.ts":
/*!******************************************!*\
  !*** ./ts/renderExistingTag.function.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderExistingTag: () => (/* binding */ renderExistingTag)
/* harmony export */ });
/* harmony import */ var _state_provider_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state/provider.utils */ "./ts/state/provider.utils.ts");
/* harmony import */ var _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TemplaterResult.class */ "./ts/TemplaterResult.class.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLikeTags.function */ "./ts/isLikeTags.function.ts");



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
    // ??? changed during mirroring - lastSupport keeps having less info than newest
    // const toRedrawTag = lastSupport || prevSupport || tagSupport.global.oldest
    const toRedrawTag = prevSupport || lastSupport || global.oldest;
    const reSupport = (0,_TemplaterResult_class__WEBPACK_IMPORTED_MODULE_1__.renderWithSupport)(newSupport, toRedrawTag, subject, 
    // oldestSupport,
    ownerSupport);
    const oldest = global.oldest || oldestSupport;
    reSupport.global.oldest = oldest;
    if ((0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_2__.isLikeTags)(prevSupport, reSupport)) {
        subject.tagSupport = reSupport;
        oldest.updateBy(reSupport);
    }
    return reSupport;
}


/***/ }),

/***/ "./ts/renderTagSupport.function.ts":
/*!*****************************************!*\
  !*** ./ts/renderTagSupport.function.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTagSupport: () => (/* binding */ renderTagSupport)
/* harmony export */ });
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _renderExistingTag_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderExistingTag.function */ "./ts/renderExistingTag.function.ts");


/** Main function used by all other callers to render/update display of a tag component */
function renderTagSupport(tagSupport, renderUp) {
    const global = tagSupport.global;
    const templater = tagSupport.templater;
    // is it just a vanilla tag, not component?
    if (!templater.wrapper) { // || isTagTemplater(templater) 
        const newTag = global.newest;
        const ownerTag = newTag.ownerTagSupport;
        ++global.renderCount;
        return renderTagSupport(ownerTag, true);
    }
    const subject = tagSupport.subject;
    const newest = global.newest;
    let ownerSupport;
    let selfPropChange = false;
    const shouldRenderUp = renderUp && newest;
    if (shouldRenderUp) {
        ownerSupport = newest.ownerTagSupport;
        if (ownerSupport) {
            const nowProps = templater.props;
            const latestProps = newest.propsConfig.latestCloned;
            selfPropChange = !(0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(nowProps, latestProps);
        }
    }
    // const useTagSupport = global.newest as TagSupport // oldTagSetup
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

/***/ "./ts/setTagPlaceholder.function.ts":
/*!******************************************!*\
  !*** ./ts/setTagPlaceholder.function.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setTagPlaceholder: () => (/* binding */ setTagPlaceholder)
/* harmony export */ });
function setTagPlaceholder(global) {
    const insertBefore = global.insertBefore;
    const placeholder = global.placeholder = document.createTextNode('');
    const parentNode = insertBefore.parentNode;
    parentNode.insertBefore(placeholder, insertBefore);
    parentNode.removeChild(insertBefore);
}


/***/ }),

/***/ "./ts/state/callbackMaker.function.ts":
/*!********************************************!*\
  !*** ./ts/state/callbackMaker.function.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   callbackMaker: () => (/* binding */ callbackMaker)
/* harmony export */ });
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");
/* harmony import */ var _state_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state.utils */ "./ts/state/state.utils.ts");
/* harmony import */ var _renderTagSupport_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../renderTagSupport.function */ "./ts/renderTagSupport.function.ts");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../errors */ "./ts/errors.ts");




let innerCallback = (callback) => (a, b, c, d, e, f) => {
    throw new _errors__WEBPACK_IMPORTED_MODULE_3__.SyncCallbackError('Callback function was called immediately in sync and must instead be call async');
};
const callbackMaker = () => innerCallback;
const originalGetter = innerCallback; // callbackMaker
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse)({
    beforeRender: (tagSupport) => initMemory(tagSupport),
    beforeRedraw: (tagSupport) => initMemory(tagSupport),
    afterRender: (_tagSupport) => {
        innerCallback = originalGetter; // prevent crossing callbacks with another tag
    },
});
function updateState(stateFrom, stateTo) {
    stateFrom.forEach((state, index) => {
        const fromValue = (0,_state_utils__WEBPACK_IMPORTED_MODULE_1__.getStateValue)(state);
        const callback = stateTo[index].callback;
        if (callback) {
            callback(fromValue); // set the value
        }
        stateTo[index].lastValue = fromValue; // record the value
    });
}
function initMemory(tagSupport) {
    const oldState = _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.stateConfig.array;
    innerCallback = (callback) => {
        const trigger = (...args) => triggerStateUpdate(tagSupport, callback, oldState, ...args);
        return trigger;
    };
}
function triggerStateUpdate(tagSupport, callback, oldState, ...args) {
    const state = tagSupport.memory.state;
    // ensure that the oldest has the latest values first
    updateState(state, oldState);
    // run the callback
    const promise = callback(...args);
    // send the oldest state changes into the newest
    updateState(oldState, state);
    (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_2__.renderTagSupport)(tagSupport, false);
    if (promise instanceof Promise) {
        promise.finally(() => {
            // send the oldest state changes into the newest
            updateState(oldState, state);
            (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_2__.renderTagSupport)(tagSupport, false);
        });
    }
}


/***/ }),

/***/ "./ts/state/index.ts":
/*!***************************!*\
  !*** ./ts/state/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   callbackMaker: () => (/* reexport safe */ _callbackMaker_function__WEBPACK_IMPORTED_MODULE_6__.callbackMaker),
/* harmony export */   letState: () => (/* reexport safe */ _letState_function__WEBPACK_IMPORTED_MODULE_3__.letState),
/* harmony export */   onDestroy: () => (/* reexport safe */ _onDestroy__WEBPACK_IMPORTED_MODULE_8__.onDestroy),
/* harmony export */   onInit: () => (/* reexport safe */ _onInit__WEBPACK_IMPORTED_MODULE_7__.onInit),
/* harmony export */   providers: () => (/* reexport safe */ _providers__WEBPACK_IMPORTED_MODULE_5__.providers),
/* harmony export */   setProp: () => (/* reexport safe */ _setProp_function__WEBPACK_IMPORTED_MODULE_4__.setProp),
/* harmony export */   setUse: () => (/* reexport safe */ _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse),
/* harmony export */   state: () => (/* reexport safe */ _state_function__WEBPACK_IMPORTED_MODULE_2__.state),
/* harmony export */   watch: () => (/* reexport safe */ _watch_function__WEBPACK_IMPORTED_MODULE_0__.watch)
/* harmony export */ });
/* harmony import */ var _watch_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watch.function */ "./ts/state/watch.function.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");
/* harmony import */ var _state_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state.function */ "./ts/state/state.function.ts");
/* harmony import */ var _letState_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./letState.function */ "./ts/state/letState.function.ts");
/* harmony import */ var _setProp_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./setProp.function */ "./ts/state/setProp.function.ts");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./providers */ "./ts/state/providers.ts");
/* harmony import */ var _callbackMaker_function__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./callbackMaker.function */ "./ts/state/callbackMaker.function.ts");
/* harmony import */ var _onInit__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./onInit */ "./ts/state/onInit.ts");
/* harmony import */ var _onDestroy__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./onDestroy */ "./ts/state/onDestroy.ts");











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

/** When undefined, it means a tag is being built for the first time so do run destroy(s) */
let destroyCurrentTagSupport;
function onDestroy(callback) {
    destroyCurrentTagSupport.global.destroyCallback = callback;
}
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse)({
    beforeRender: tagSupport => destroyCurrentTagSupport = tagSupport,
    beforeRedraw: tagSupport => destroyCurrentTagSupport = tagSupport,
    beforeDestroy: (tagSupport, tag) => {
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
    _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.initCurrentSupport = support;
}
function onInit(callback) {
    const tagSupport = _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.initCurrentSupport;
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
/* harmony import */ var _renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../renderTagSupport.function */ "./ts/renderTagSupport.function.ts");


function providersChangeCheck(tagSupport) {
    const global = tagSupport.global;
    const providersWithChanges = global.providers.filter(provider => !(0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(provider.instance, provider.clone));
    // reset clones
    providersWithChanges.forEach(provider => {
        const appElement = tagSupport.getAppElement();
        handleProviderChanges(appElement, provider);
        provider.clone = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(provider.instance);
    });
}
function handleProviderChanges(appElement, provider) {
    const tagsWithProvider = getTagsWithProvider(appElement, provider);
    tagsWithProvider.forEach(({ tagSupport, renderCount, provider }) => {
        if (tagSupport.global.deleted) {
            return; // i was deleted after another tag processed
        }
        const notRendered = renderCount === tagSupport.global.renderCount;
        if (notRendered) {
            provider.clone = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(provider.instance);
            (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__.renderTagSupport)(tagSupport, false);
        }
    });
}
function getTagsWithProvider(tagSupport, provider, memory = []) {
    const global = tagSupport.global;
    const compare = global.providers;
    const hasProvider = compare.find(xProvider => xProvider.constructMethod === provider.constructMethod);
    if (hasProvider) {
        memory.push({
            tagSupport,
            renderCount: global.renderCount,
            provider: hasProvider,
        });
    }
    tagSupport.childTags.forEach(child => getTagsWithProvider(child, provider, memory));
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


_setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig = {
    providers: [],
    ownerSupport: undefined,
};
function get(constructMethod) {
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
    const providers = config.providers;
    return providers.find(provider => provider.constructMethod === constructMethod);
}
const providers = {
    create: (constructMethod) => {
        const existing = get(constructMethod);
        if (existing) {
            existing.clone = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(existing.instance);
            return existing.instance;
        }
        // Providers with provider requirements just need to use providers.create() and providers.inject()
        const instance = constructMethod.constructor ? new constructMethod() : constructMethod();
        const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
        config.providers.push({
            constructMethod,
            instance,
            clone: (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(instance)
        });
        return instance;
    },
    /**
     * @template T
     * @param {(new (...args: any[]) => T) | () => T} constructor
     * @returns {T}
     */
    inject: (constructor) => {
        const oldValue = get(constructor);
        if (oldValue) {
            return oldValue.instance;
        }
        const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
        let owner = {
            ownerTagSupport: config.ownerSupport
        };
        while (owner.ownerTagSupport) {
            const ownerProviders = owner.ownerTagSupport.global.providers;
            const provider = ownerProviders.find(provider => {
                if (provider.constructMethod === constructor) {
                    return true;
                }
            });
            if (provider) {
                provider.clone = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(provider.instance); // keep a copy of the latest before any change occur
                config.providers.push(provider);
                return provider.instance;
            }
            owner = owner.ownerTagSupport; // cause reloop
        }
        const msg = `Could not inject provider: ${constructor.name} ${constructor}`;
        console.warn(`${msg}. Available providers`, config.providers);
        throw new Error(msg);
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

/***/ "./ts/state/setProp.function.ts":
/*!**************************************!*\
  !*** ./ts/state/setProp.function.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setProp: () => (/* binding */ setProp)
/* harmony export */ });
/* harmony import */ var _state_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state.utils */ "./ts/state/state.utils.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");


/** Used for variables that need to remain the same variable during render passes */
function setProp(getSet) {
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig;
    const rearray = config.rearray;
    const [propValue] = getSet(undefined);
    getSet(propValue); // restore original value instead of undefined
    const restate = rearray[config.array.length];
    if (restate) {
        let watchValue = restate.watch;
        let oldValue = (0,_state_utils__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(restate);
        const push = {
            get: () => (0,_state_utils__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(push),
            callback: getSet,
            lastValue: oldValue,
            watch: restate.watch,
        };
        // has the prop value changed?
        if (propValue != watchValue) {
            push.watch = propValue;
            oldValue = push.lastValue = propValue;
        }
        config.array.push(push);
        getSet(oldValue);
        return oldValue;
    }
    const push = {
        get: () => (0,_state_utils__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(push),
        callback: getSet,
        lastValue: propValue,
        watch: propValue,
    };
    config.array.push(push);
    return propValue;
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
/* harmony export */   getStateValue: () => (/* binding */ getStateValue)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../errors */ "./ts/errors.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/state/setUse.function.ts");


// TODO: rename
_setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig = {
    array: [], // state memory on the first render
    // rearray: [] as StateConfigArray, // state memory to be used before the next render
};
const beforeRender = (tagSupport) => initState(tagSupport);
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse)({
    beforeRender,
    beforeRedraw: beforeRender,
    afterRender: (tagSupport) => {
        const memory = tagSupport.memory;
        const state = memory.state;
        const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig;
        const rearray = config.rearray;
        if (rearray.length) {
            if (rearray.length !== config.array.length) {
                const message = `States lengths has changed ${rearray.length} !== ${config.array.length}. Typically occurs when a function is intended to be wrapped with a tag() call`;
                const wrapper = tagSupport.templater?.wrapper;
                const details = {
                    oldStates: config.array,
                    newStates: config.rearray,
                    tagFunction: wrapper.original,
                };
                const error = new _errors__WEBPACK_IMPORTED_MODULE_0__.StateMismatchError(message, details);
                console.warn(message, details);
                throw error;
            }
        }
        delete config.rearray; // clean up any previous runs
        memory.state = config.array; // [...config.array]
        memory.state.forEach(item => item.lastValue = getStateValue(item)); // set last values
        config.array = [];
    }
});
function getStateValue(
// state: StateConfig,
state) {
    const callback = state.callback;
    if (!callback) {
        return state.defaultValue;
    }
    const oldState = callback(StateEchoBack); // get value and set to undefined
    const [oldValue] = oldState;
    const [checkValue] = callback(oldValue); // set back to original value
    if (checkValue !== StateEchoBack) {
        const message = 'State property not used correctly. Second item in array is not setting value as expected.\n\n' +
            'For "let" state use `let name = state(default)(x => [name, name = x])`\n\n' +
            'For "const" state use `const name = state(default)()`\n\n' +
            'Problem state:\n' + (callback ? callback.toString() : JSON.stringify(state)) + '\n';
        console.error(message, { state, callback, oldState, oldValue, checkValue });
        throw new Error(message);
    }
    // state.lastValue = oldValue
    return oldValue;
}
class StateEchoBack {
}
function initState(tagSupport) {
    const memory = tagSupport.memory;
    const state = memory.state;
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig;
    // TODO: This guard may no longer be needed
    if (config.rearray) {
        const wrapper = tagSupport.templater?.wrapper;
        const wasWrapper = config.tagSupport?.templater.wrapper;
        const message = 'last state not cleared. Possibly in the middle of rendering one component and another is trying to render';
        console.error(message, {
            config,
            tagFunction: wrapper.original,
            wasInMiddleOf: wasWrapper.original,
            state,
            expectedClearArray: config.rearray,
        });
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.StateMismatchError(message, {
            config,
            tagFunction: wrapper.original,
            state,
            expectedClearArray: config.rearray,
        });
    }
    // TODO: this maybe redundant and not needed
    config.rearray = []; // .length = 0
    if (state?.length) {
        state.forEach(state => getStateValue(state));
        config.rearray.push(...state);
    }
    config.tagSupport = tagSupport;
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
/* harmony import */ var _letState_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./letState.function */ "./ts/state/letState.function.ts");

/**
 * When an item in watch array changes, callback function will be triggered. Does not trigger on initial watch setup.
 * @param currentValues T[]
 * @param callback WatchCallback
 * @returns T[]
 */
function watch(currentValues, callback) {
    let previousValues = (0,_letState_function__WEBPACK_IMPORTED_MODULE_0__.letState)(undefined)(x => [previousValues, previousValues = x]);
    // First time running watch?
    if (previousValues === undefined) {
        // callback(currentValues, previousValues) // do not call during init
        previousValues = currentValues;
        return currentValues;
    }
    const allExact = currentValues.every((item, index) => item === previousValues[index]);
    if (allExact) {
        return currentValues;
    }
    callback(currentValues, previousValues);
    previousValues.length = 0;
    previousValues.push(...currentValues);
    return currentValues;
}


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
        const subscription = getSubscription(this, callback);
        // are we within a pipe?
        const subscribeWith = this.subscribeWith;
        if (subscribeWith) {
            // are we in a pipe?
            if (this.methods.length) {
                const orgCallback = callback;
                callback = (value) => {
                    runPipedMethods(value, this.methods, lastValue => orgCallback(lastValue, subscription));
                };
            }
            return subscribeWith(callback);
        }
        this.subscribers.push(subscription);
        SubjectClass.globalSubs.push(subscription); // 🔬 testing
        if (this.onSubscription) {
            this.onSubscription(subscription);
        }
        return subscription;
    }
    set(value) {
        this.value = value;
        // Notify all subscribers with the new value
        this.subscribers.forEach(sub => {
            // (sub.callback as any).value = value
            sub.callback(value, sub);
        });
    }
    next = this.set;
    toPromise() {
        return new Promise((res, rej) => {
            this.subscribe((x, subscription) => {
                subscription.unsubscribe();
                res(x);
            });
        });
    }
    // like toPromise but faster
    toCallback(callback) {
        this.subscribe((x, subscription) => {
            subscription.unsubscribe();
            callback(x);
        });
    }
    pipe(...operations) {
        const subject = new Subject();
        subject.methods = operations;
        subject.subscribeWith = (x) => this.subscribe(x);
        return subject;
    }
}
function removeSubFromArray(subscribers, callback) {
    const index = subscribers.findIndex(sub => sub.callback === callback);
    if (index !== -1) {
        subscribers.splice(index, 1);
    }
}
const SubjectClass = Subject;
SubjectClass.globalSubs = []; // 🔬 for testing
SubjectClass.globalSubCount$ = new Subject(); // for ease of debugging
SubjectClass.globalSubCount$.set(0);
function getSubscription(subject, callback) {
    const countSubject = SubjectClass.globalSubCount$;
    SubjectClass.globalSubCount$.set(countSubject.value + 1);
    const subscription = () => {
        subscription.unsubscribe();
    };
    subscription.callback = callback;
    subscription.subscriptions = [];
    // Return a function to unsubscribe from the BehaviorSubject
    subscription.unsubscribe = () => {
        removeSubFromArray(subject.subscribers, callback); // each will be called when update comes in
        removeSubFromArray(SubjectClass.globalSubs, callback); // 🔬 testing
        SubjectClass.globalSubCount$.set(countSubject.value - 1);
        // any double unsubscribes will be ignored
        subscription.unsubscribe = () => subscription;
        // unsubscribe from any combined subjects
        subscription.subscriptions.forEach(subscription => subscription.unsubscribe());
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
        // return newValue = next
    };
    let handler = next;
    const setHandler = (x) => handler = x;
    const pipeUtils = { setHandler, next };
    const methodResponse = firstMethod(value, pipeUtils);
    handler(methodResponse);
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
            if (valuesSeen.length === subjects.length && valuesSeen.every(x => x)) {
                callback(values, subscription);
            }
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

/***/ "./ts/tag.ts":
/*!*******************!*\
  !*** ./ts/tag.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tag: () => (/* binding */ tag),
/* harmony export */   tags: () => (/* binding */ tags)
/* harmony export */ });
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./ts/state/index.ts");
/* harmony import */ var _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TemplaterResult.class */ "./ts/TemplaterResult.class.ts");
/* harmony import */ var _interpolations_bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interpolations/bindSubjectCallback.function */ "./ts/interpolations/bindSubjectCallback.function.ts");
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");
/* harmony import */ var _alterProps_function__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./alterProps.function */ "./ts/alterProps.function.ts");
/* harmony import */ var _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./subject/ValueSubject */ "./ts/subject/ValueSubject.ts");








const tags = [];
let tagCount = 0;
/** Wraps a tag component in a state manager and always push children to last argument as an array */
// export function tag<T>(a: T): T;
function tag(tagComponent) {
    /** function developer triggers */
    const result = (function tagWrapper(props, children) {
        // is the props argument actually children?
        const isPropTag = (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagClass)(props) || (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagTemplater)(props) || (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagArray)(props);
        if (isPropTag) {
            children = props;
            props = undefined;
        }
        const { childSubject, madeSubject } = kidsToTagArraySubject(children);
        childSubject.isChildSubject = true;
        const templater = new _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_2__.TemplaterResult(props, childSubject);
        // attach memory back to original function that contains developer display logic
        const innerTagWrap = getTagWrap(templater, madeSubject);
        innerTagWrap.original = tagComponent;
        templater.tagged = true;
        templater.wrapper = innerTagWrap;
        return templater;
    }); // we override the function provided and pretend original is what's returned
    updateResult(result, tagComponent);
    // group tags together and have hmr pickup
    updateComponent(tagComponent);
    tags.push(tagComponent);
    // fake the return as being (props?, children?) => TemplaterResult
    return result;
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
        madeSubject: true
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
function getTagWrap(templater, madeSubject) {
    // this function gets called by taggedjs
    const innerTagWrap = function (oldTagSetup, subject) {
        const global = oldTagSetup.global;
        ++global.renderCount;
        const childSubject = templater.children;
        const lastArray = global.oldest?.templater.children.lastArray;
        if (lastArray) {
            childSubject.lastArray = lastArray;
        }
        const originalFunction = innerTagWrap.original;
        let props = templater.props;
        let castedProps = (0,_alterProps_function__WEBPACK_IMPORTED_MODULE_6__.alterProps)(props, oldTagSetup.ownerTagSupport);
        const clonedProps = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_4__.deepClone)(props); // castedProps
        // CALL ORIGINAL COMPONENT FUNCTION
        const tag = originalFunction(castedProps, childSubject);
        tag.templater = templater;
        templater.tag = tag;
        const tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_5__.TagSupport(templater, oldTagSetup.ownerTagSupport, subject, global.renderCount);
        tagSupport.global = global;
        tagSupport.propsConfig = {
            latest: props,
            latestCloned: clonedProps,
            lastClonedKidValues: tagSupport.propsConfig.lastClonedKidValues,
        };
        tagSupport.memory = oldTagSetup.memory; // state handover
        if (madeSubject) {
            childSubject.value.forEach(kid => {
                kid.values.forEach((value, index) => {
                    if (!(value instanceof Function)) {
                        return;
                    }
                    const valuesValue = kid.values[index];
                    if (valuesValue.isChildOverride) {
                        return; // already overwritten
                    }
                    // all functions need to report to me
                    kid.values[index] = function (...args) {
                        const ownerSupport = tagSupport.ownerTagSupport;
                        (0,_interpolations_bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_3__.runTagCallback)(value, // callback
                        ownerSupport, this, // bindTo
                        args);
                    };
                    valuesValue.isChildOverride = true;
                });
            });
        }
        return tagSupport;
    };
    return innerTagWrap;
}


/***/ }),

/***/ "./ts/tagElement.ts":
/*!**************************!*\
  !*** ./ts/tagElement.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runWrapper: () => (/* binding */ runWrapper),
/* harmony export */   tagElement: () => (/* binding */ tagElement)
/* harmony export */ });
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");
/* harmony import */ var _tagRunner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tagRunner */ "./ts/tagRunner.ts");
/* harmony import */ var _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./subject/ValueSubject */ "./ts/subject/ValueSubject.ts");



const appElements = [];
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
    element.appendChild(templateElm);
    tagSupport.buildBeforeElement(templateElm);
    tagSupport.global.oldest = tagSupport;
    tagSupport.global.newest = tagSupport;
    element.setUse = app.original.setUse;
    appElements.push({ element, tagSupport });
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

/***/ "./ts/tagRunner.ts":
/*!*************************!*\
  !*** ./ts/tagRunner.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runAfterRender: () => (/* binding */ runAfterRender),
/* harmony export */   runBeforeDestroy: () => (/* binding */ runBeforeDestroy),
/* harmony export */   runBeforeRedraw: () => (/* binding */ runBeforeRedraw),
/* harmony export */   runBeforeRender: () => (/* binding */ runBeforeRender),
/* harmony export */   tagClosed$: () => (/* binding */ tagClosed$)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ "./ts/state/index.ts");
/* harmony import */ var _subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subject */ "./ts/subject/index.ts");
// TODO: This should be more like `new TaggedJs().use({})`


// Emits event at the end of a tag being rendered. Use tagClosed$.toPromise() to render a tag after a current tag is done rendering
const tagClosed$ = new _subject__WEBPACK_IMPORTED_MODULE_1__.Subject(undefined, subscription => {
    if (!_state__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.stateConfig.rearray) {
        subscription.next(); // we are not currently processing so process now
    }
});
// Life cycle 1
function runBeforeRender(tagSupport, ownerSupport) {
    _state__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse.forEach(tagUse => tagUse.beforeRender(tagSupport, ownerSupport));
}
// Life cycle 2
function runAfterRender(tagSupport, ownerTagSupport) {
    _state__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse.forEach(tagUse => tagUse.afterRender(tagSupport, ownerTagSupport));
    tagClosed$.next(ownerTagSupport);
}
// Life cycle 3
function runBeforeRedraw(tagSupport, ownerTagSupport) {
    _state__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse.forEach(tagUse => tagUse.beforeRedraw(tagSupport, ownerTagSupport));
}
// Life cycle 4 - end of life
function runBeforeDestroy(tagSupport, ownerTagSupport) {
    _state__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse.forEach(tagUse => tagUse.beforeDestroy(tagSupport, ownerTagSupport));
}


/***/ }),

/***/ "./ts/updateBeforeTemplate.function.ts":
/*!*********************************************!*\
  !*** ./ts/updateBeforeTemplate.function.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateBeforeTemplate: () => (/* binding */ updateBeforeTemplate)
/* harmony export */ });
// Function to update the value of x
function updateBeforeTemplate(value, lastFirstChild) {
    const parent = lastFirstChild.parentNode;
    let castedValue = value;
    // mimic React skipping to display EXCEPT for true does display on page
    if ([undefined, false, null].includes(value)) { // || value === true
        castedValue = '';
    }
    // Insert the new value (never use innerHTML here)
    const textNode = document.createTextNode(castedValue); // never innerHTML
    parent.insertBefore(textNode, lastFirstChild);
    /* remove existing nodes */
    parent.removeChild(lastFirstChild);
    return textNode;
}


/***/ }),

/***/ "./ts/updateContextItem.function.ts":
/*!******************************************!*\
  !*** ./ts/updateContextItem.function.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateContextItem: () => (/* binding */ updateContextItem)
/* harmony export */ });
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");


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
        return;
    }
    // listeners will evaluate updated values to possibly update display(s)
    subject.set(value);
    return;
}
function shareTemplaterGlobal(oldTagSupport, tagSupport) {
    const oldTemp = oldTagSupport.templater;
    const oldWrap = oldTemp.wrapper; // tag versus component
    const oldValueFn = oldWrap.original;
    const templater = tagSupport.templater;
    const newWrapper = templater.wrapper;
    const newValueFn = newWrapper?.original;
    const fnMatched = oldValueFn === newValueFn;
    if (fnMatched) {
        tagSupport.global = oldTagSupport.global;
        // ??? new mirroring transfer state
        const newest = oldTagSupport.global.newest;
        if (newest) {
            const prevState = newest.memory.state;
            tagSupport.memory.state = [...prevState];
        }
    }
}


/***/ }),

/***/ "./ts/updateExistingTagComponent.function.ts":
/*!***************************************************!*\
  !*** ./ts/updateExistingTagComponent.function.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateExistingTagComponent: () => (/* binding */ updateExistingTagComponent)
/* harmony export */ });
/* harmony import */ var _hasTagSupportChanged_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hasTagSupportChanged.function */ "./ts/hasTagSupportChanged.function.ts");
/* harmony import */ var _processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./processSubjectComponent.function */ "./ts/processSubjectComponent.function.ts");
/* harmony import */ var _destroyTag_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./destroyTag.function */ "./ts/destroyTag.function.ts");
/* harmony import */ var _renderTagSupport_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./renderTagSupport.function */ "./ts/renderTagSupport.function.ts");
/* harmony import */ var _alterProps_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./alterProps.function */ "./ts/alterProps.function.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isLikeTags.function */ "./ts/isLikeTags.function.ts");






function updateExistingTagComponent(ownerSupport, tagSupport, // lastest
subject, insertBefore) {
    // ??? changed during mirroring
    // let lastSupport = subject.tagSupport
    let lastSupport = subject.tagSupport?.global.newest; // || subject.tagSupport
    let oldestTag = lastSupport.global.oldest;
    const oldWrapper = lastSupport.templater.wrapper;
    const newWrapper = tagSupport.templater.wrapper;
    let isSameTag = false;
    if (oldWrapper && newWrapper) {
        const oldFunction = oldWrapper.original;
        const newFunction = newWrapper.original;
        isSameTag = oldFunction === newFunction;
    }
    const templater = tagSupport.templater;
    if (!isSameTag) {
        const oldestSupport = lastSupport.global.oldest;
        (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(oldestSupport, subject);
        return (0,_processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_1__.processSubjectComponent)(templater, subject, insertBefore, ownerSupport, {
            forceElement: false,
            counts: { added: 0, removed: 0 },
        });
    }
    else {
        const hasChanged = (0,_hasTagSupportChanged_function__WEBPACK_IMPORTED_MODULE_0__.hasTagSupportChanged)(lastSupport, tagSupport, templater);
        if (!hasChanged) {
            // if the new props are an object then implicitly since no change, the old props are an object
            const newProps = templater.props;
            if (newProps && typeof (newProps) === 'object') {
                syncFunctionProps(lastSupport, ownerSupport, newProps);
            }
            return lastSupport; // its the same tag component
        }
    }
    const previous = lastSupport.global.newest;
    const newSupport = (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_3__.renderTagSupport)(tagSupport, false);
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
            (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(lastSupport, subject);
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
        forceElement: true,
        counts: { added: 0, removed: 0 },
    });
    newSupport.global.oldest = newSupport;
    newSupport.global.newest = newSupport;
    oldTagSupport.global.oldest = newSupport;
    oldTagSupport.global.newest = newSupport;
    subject.tagSupport = newSupport;
    return newSupport;
}
function syncFunctionProps(lastSupport, ownerSupport, newProps) {
    lastSupport = lastSupport.global.newest || lastSupport;
    const priorPropConfig = lastSupport.propsConfig;
    const priorProps = priorPropConfig.latestCloned;
    const prevSupport = ownerSupport.global.newest;
    Object.entries(priorProps).forEach(([name, value]) => {
        if (!(value instanceof Function)) {
            return;
        }
        // TODO: The code below maybe irrelevant
        const newCallback = newProps[name];
        const original = newCallback.original;
        if (original) {
            return; // already previously converted
        }
        // Currently, call self but over parent state changes, I may need to call a newer parent tag owner
        priorProps[name].toCall = (...args) => {
            return (0,_alterProps_function__WEBPACK_IMPORTED_MODULE_4__.callbackPropOwner)(newCallback, // value, // newOriginal,
            args, prevSupport);
        };
        return;
    });
}


/***/ }),

/***/ "./ts/updateExistingValue.function.ts":
/*!********************************************!*\
  !*** ./ts/updateExistingValue.function.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateExistingValue: () => (/* binding */ updateExistingValue)
/* harmony export */ });
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");
/* harmony import */ var _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TemplaterResult.class */ "./ts/TemplaterResult.class.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _processTagArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./processTagArray */ "./ts/processTagArray.ts");
/* harmony import */ var _updateExistingTagComponent_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./updateExistingTagComponent.function */ "./ts/updateExistingTagComponent.function.ts");
/* harmony import */ var _processRegularValue_function__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./processRegularValue.function */ "./ts/processRegularValue.function.ts");
/* harmony import */ var _checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./checkDestroyPrevious.function */ "./ts/checkDestroyPrevious.function.ts");
/* harmony import */ var _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./subject/ValueSubject */ "./ts/subject/ValueSubject.ts");
/* harmony import */ var _processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./processSubjectComponent.function */ "./ts/processSubjectComponent.function.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./isLikeTags.function */ "./ts/isLikeTags.function.ts");
/* harmony import */ var _interpolations_bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./interpolations/bindSubjectCallback.function */ "./ts/interpolations/bindSubjectCallback.function.ts");
/* harmony import */ var _processTag_function__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./processTag.function */ "./ts/processTag.function.ts");
/* harmony import */ var _insertAfter_function__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./insertAfter.function */ "./ts/insertAfter.function.ts");













function updateExistingValue(subject, value, ownerSupport, insertBefore) {
    const subjectTag = subject;
    const isComponent = (0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isTagComponent)(value);
    (0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_6__.checkDestroyPrevious)(subject, value, insertBefore);
    // handle already seen tag components
    if (isComponent) {
        return prepareUpdateToComponent(value, subjectTag, insertBefore, ownerSupport);
    }
    // was component but no longer
    const tagSupport = subjectTag.tagSupport;
    if (tagSupport) {
        handleStillTag(subject, value, ownerSupport);
        return subjectTag;
    }
    // its another tag array
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isTagArray)(value)) {
        (0,_processTagArray__WEBPACK_IMPORTED_MODULE_3__.processTagArray)(subject, value, insertBefore, // oldInsertBefore as InsertBefore,
        ownerSupport, { counts: {
                added: 0,
                removed: 0,
            } });
        return subject;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isTagTemplater)(value)) {
        (0,_processTag_function__WEBPACK_IMPORTED_MODULE_11__.processTag)(value, insertBefore, ownerSupport, subjectTag);
        return subjectTag;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isTagClass)(value)) {
        const tag = value;
        let templater = tag.templater;
        if (!templater) {
            templater = (0,_processTag_function__WEBPACK_IMPORTED_MODULE_11__.getFakeTemplater)();
            tag.templater = templater;
            templater.tag = tag;
        }
        (0,_processTag_function__WEBPACK_IMPORTED_MODULE_11__.processTag)(templater, insertBefore, ownerSupport, subjectTag);
        return subjectTag;
    }
    // we have been given a subject
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_2__.isSubjectInstance)(value)) {
        return value;
    }
    // now its a function
    if (value instanceof Function) {
        const bound = (0,_interpolations_bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_10__.bindSubjectCallback)(value, ownerSupport);
        subject.set(bound);
        return subject;
    }
    // This will cause all other values to render
    (0,_processRegularValue_function__WEBPACK_IMPORTED_MODULE_5__.processRegularValue)(value, subject, insertBefore);
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
            const children = new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_7__.ValueSubject([]);
            templater = new _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_1__.TemplaterResult(undefined, children);
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
        (0,_processTag_function__WEBPACK_IMPORTED_MODULE_11__.setupNewTemplater)(valueSupport, ownerSupport, subject);
    }
    if (isSameTag) {
        lastSupport.updateBy(valueSupport);
        return;
    }
    if (isSameTag) {
        // const subjectTag = subject as TagSubject
        const global = lastSupport.global;
        const insertBefore = global.insertBefore;
        return (0,_processTag_function__WEBPACK_IMPORTED_MODULE_11__.processTag)(templater, insertBefore, ownerSupport, subject);
    }
    return (0,_processRegularValue_function__WEBPACK_IMPORTED_MODULE_5__.processRegularValue)(value, subject, subject.insertBefore);
}
function prepareUpdateToComponent(templater, subjectTag, insertBefore, ownerSupport) {
    // When was something before component
    if (!subjectTag.tagSupport) {
        (0,_processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_8__.processSubjectComponent)(templater, subjectTag, insertBefore, // oldInsertBefore as InsertBefore,
        ownerSupport, {
            forceElement: true,
            counts: { added: 0, removed: 0 },
        });
        return subjectTag;
    }
    const tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__.TagSupport(templater, ownerSupport, subjectTag);
    // ??? new mirroring
    const subjectSup = subjectTag.tagSupport;
    // const prevSupport = (subjectSup.global.newest || subjectSup) as TagSupport
    const prevSupport = subjectSup.global.newest;
    if (prevSupport) {
        const newestState = prevSupport.memory.state;
        tagSupport.memory.state = [...newestState];
    }
    else {
        const placeholder = subjectSup.global.placeholder;
        if (placeholder && !insertBefore.parentNode) {
            (0,_insertAfter_function__WEBPACK_IMPORTED_MODULE_12__.insertAfter)(insertBefore, placeholder);
            delete subjectSup.global.placeholder;
        }
        // insertBefore = subjectSup.global.placeholder || insertBefore
        (0,_processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_8__.processSubjectComponent)(templater, subjectTag, insertBefore, ownerSupport, {
            forceElement: true,
            counts: { added: 0, removed: 0 },
        });
        return subjectTag;
    }
    tagSupport.global = subjectSup.global;
    subjectTag.tagSupport = tagSupport;
    (0,_updateExistingTagComponent_function__WEBPACK_IMPORTED_MODULE_4__.updateExistingTagComponent)(ownerSupport, tagSupport, // latest value
    subjectTag, insertBefore);
    return subjectTag;
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
/* harmony export */   ArrayNoKeyError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_4__.ArrayNoKeyError),
/* harmony export */   BaseTagSupport: () => (/* reexport safe */ _TagSupport_class__WEBPACK_IMPORTED_MODULE_8__.BaseTagSupport),
/* harmony export */   StateMismatchError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_4__.StateMismatchError),
/* harmony export */   Subject: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.Subject),
/* harmony export */   SyncCallbackError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_4__.SyncCallbackError),
/* harmony export */   Tag: () => (/* reexport safe */ _Tag_class__WEBPACK_IMPORTED_MODULE_10__.Tag),
/* harmony export */   TagError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_4__.TagError),
/* harmony export */   TagSupport: () => (/* reexport safe */ _TagSupport_class__WEBPACK_IMPORTED_MODULE_8__.TagSupport),
/* harmony export */   ValueSubject: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.ValueSubject),
/* harmony export */   callbackMaker: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_7__.callbackMaker),
/* harmony export */   combineLatest: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.combineLatest),
/* harmony export */   hmr: () => (/* binding */ hmr),
/* harmony export */   html: () => (/* reexport safe */ _html__WEBPACK_IMPORTED_MODULE_3__.html),
/* harmony export */   interpolateElement: () => (/* reexport safe */ _interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_9__.interpolateElement),
/* harmony export */   interpolateString: () => (/* reexport safe */ _interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_9__.interpolateString),
/* harmony export */   isSubjectInstance: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_6__.isSubjectInstance),
/* harmony export */   isTag: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_6__.isTag),
/* harmony export */   isTagArray: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_6__.isTagArray),
/* harmony export */   isTagClass: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_6__.isTagClass),
/* harmony export */   isTagComponent: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_6__.isTagComponent),
/* harmony export */   isTagTemplater: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_6__.isTagTemplater),
/* harmony export */   letState: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_7__.letState),
/* harmony export */   onDestroy: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_7__.onDestroy),
/* harmony export */   onInit: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_7__.onInit),
/* harmony export */   providers: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_7__.providers),
/* harmony export */   renderTagSupport: () => (/* reexport safe */ _renderTagSupport_function__WEBPACK_IMPORTED_MODULE_12__.renderTagSupport),
/* harmony export */   runBeforeRender: () => (/* reexport safe */ _tagRunner__WEBPACK_IMPORTED_MODULE_11__.runBeforeRender),
/* harmony export */   setProp: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_7__.setProp),
/* harmony export */   setUse: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_7__.setUse),
/* harmony export */   state: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_7__.state),
/* harmony export */   tag: () => (/* reexport safe */ _tag__WEBPACK_IMPORTED_MODULE_2__.tag),
/* harmony export */   tagElement: () => (/* reexport safe */ _tagElement__WEBPACK_IMPORTED_MODULE_0__.tagElement),
/* harmony export */   tags: () => (/* reexport safe */ _tag__WEBPACK_IMPORTED_MODULE_2__.tags),
/* harmony export */   watch: () => (/* reexport safe */ _state_index__WEBPACK_IMPORTED_MODULE_7__.watch),
/* harmony export */   willCallback: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.willCallback),
/* harmony export */   willPromise: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.willPromise),
/* harmony export */   willSubscribe: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.willSubscribe)
/* harmony export */ });
/* harmony import */ var _tagElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tagElement */ "./ts/tagElement.ts");
/* harmony import */ var _ElementTargetEvent_interface__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ElementTargetEvent.interface */ "./ts/ElementTargetEvent.interface.ts");
/* harmony import */ var _tag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tag */ "./ts/tag.ts");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./html */ "./ts/html.ts");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./errors */ "./ts/errors.ts");
/* harmony import */ var _subject_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./subject/index */ "./ts/subject/index.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _state_index__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./state/index */ "./ts/state/index.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");
/* harmony import */ var _interpolations_interpolateElement__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./interpolations/interpolateElement */ "./ts/interpolations/interpolateElement.ts");
/* harmony import */ var _Tag_class__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Tag.class */ "./ts/Tag.class.ts");
/* harmony import */ var _tagRunner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./tagRunner */ "./ts/tagRunner.ts");
/* harmony import */ var _renderTagSupport_function__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./renderTagSupport.function */ "./ts/renderTagSupport.function.ts");
// import { redrawTag } from "./redrawTag.function"









// export * from "./redrawTag.function"

// TODO: export *




const hmr = {
    tagElement: _tagElement__WEBPACK_IMPORTED_MODULE_0__.tagElement,
    // redrawTag
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
var __webpack_exports__callbackMaker = __webpack_exports__.callbackMaker;
var __webpack_exports__combineLatest = __webpack_exports__.combineLatest;
var __webpack_exports__hmr = __webpack_exports__.hmr;
var __webpack_exports__html = __webpack_exports__.html;
var __webpack_exports__interpolateElement = __webpack_exports__.interpolateElement;
var __webpack_exports__interpolateString = __webpack_exports__.interpolateString;
var __webpack_exports__isSubjectInstance = __webpack_exports__.isSubjectInstance;
var __webpack_exports__isTag = __webpack_exports__.isTag;
var __webpack_exports__isTagArray = __webpack_exports__.isTagArray;
var __webpack_exports__isTagClass = __webpack_exports__.isTagClass;
var __webpack_exports__isTagComponent = __webpack_exports__.isTagComponent;
var __webpack_exports__isTagTemplater = __webpack_exports__.isTagTemplater;
var __webpack_exports__letState = __webpack_exports__.letState;
var __webpack_exports__onDestroy = __webpack_exports__.onDestroy;
var __webpack_exports__onInit = __webpack_exports__.onInit;
var __webpack_exports__providers = __webpack_exports__.providers;
var __webpack_exports__renderTagSupport = __webpack_exports__.renderTagSupport;
var __webpack_exports__runBeforeRender = __webpack_exports__.runBeforeRender;
var __webpack_exports__setProp = __webpack_exports__.setProp;
var __webpack_exports__setUse = __webpack_exports__.setUse;
var __webpack_exports__state = __webpack_exports__.state;
var __webpack_exports__tag = __webpack_exports__.tag;
var __webpack_exports__tagElement = __webpack_exports__.tagElement;
var __webpack_exports__tags = __webpack_exports__.tags;
var __webpack_exports__watch = __webpack_exports__.watch;
var __webpack_exports__willCallback = __webpack_exports__.willCallback;
var __webpack_exports__willPromise = __webpack_exports__.willPromise;
var __webpack_exports__willSubscribe = __webpack_exports__.willSubscribe;
export { __webpack_exports__ArrayNoKeyError as ArrayNoKeyError, __webpack_exports__BaseTagSupport as BaseTagSupport, __webpack_exports__StateMismatchError as StateMismatchError, __webpack_exports__Subject as Subject, __webpack_exports__SyncCallbackError as SyncCallbackError, __webpack_exports__Tag as Tag, __webpack_exports__TagError as TagError, __webpack_exports__TagSupport as TagSupport, __webpack_exports__ValueSubject as ValueSubject, __webpack_exports__callbackMaker as callbackMaker, __webpack_exports__combineLatest as combineLatest, __webpack_exports__hmr as hmr, __webpack_exports__html as html, __webpack_exports__interpolateElement as interpolateElement, __webpack_exports__interpolateString as interpolateString, __webpack_exports__isSubjectInstance as isSubjectInstance, __webpack_exports__isTag as isTag, __webpack_exports__isTagArray as isTagArray, __webpack_exports__isTagClass as isTagClass, __webpack_exports__isTagComponent as isTagComponent, __webpack_exports__isTagTemplater as isTagTemplater, __webpack_exports__letState as letState, __webpack_exports__onDestroy as onDestroy, __webpack_exports__onInit as onInit, __webpack_exports__providers as providers, __webpack_exports__renderTagSupport as renderTagSupport, __webpack_exports__runBeforeRender as runBeforeRender, __webpack_exports__setProp as setProp, __webpack_exports__setUse as setUse, __webpack_exports__state as state, __webpack_exports__tag as tag, __webpack_exports__tagElement as tagElement, __webpack_exports__tags as tags, __webpack_exports__watch as watch, __webpack_exports__willCallback as willCallback, __webpack_exports__willPromise as willPromise, __webpack_exports__willSubscribe as willSubscribe };

//# sourceMappingURL=bundle.js.map