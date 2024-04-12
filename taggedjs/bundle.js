/******/ var __webpack_modules__ = ({

/***/ "./ts/Clones.type.ts":
/*!***************************!*\
  !*** ./ts/Clones.type.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRemoveTemplates: () => (/* binding */ isRemoveTemplates)
/* harmony export */ });
const isRemoveTemplates = true;


/***/ }),

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
/* harmony import */ var _tagRunner__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tagRunner */ "./ts/tagRunner.ts");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./render */ "./ts/render.ts");
/* harmony import */ var _interpolateElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interpolateElement */ "./ts/interpolateElement.ts");
/* harmony import */ var _interpolateTemplate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interpolateTemplate */ "./ts/interpolateTemplate.ts");
/* harmony import */ var _elementDestroyCheck_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./elementDestroyCheck.function */ "./ts/elementDestroyCheck.function.ts");
/* harmony import */ var _processNewValue_function__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./processNewValue.function */ "./ts/processNewValue.function.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./isLikeTags.function */ "./ts/isLikeTags.function.ts");
/* harmony import */ var _Clones_type__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Clones.type */ "./ts/Clones.type.ts");
/* harmony import */ var _checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./checkDestroyPrevious.function */ "./ts/checkDestroyPrevious.function.ts");
/* harmony import */ var _insertAfter_function__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./insertAfter.function */ "./ts/insertAfter.function.ts");











const variablePrefix = '__tagvar';
const escapeVariable = '--' + variablePrefix + '--';
const prefixSearch = new RegExp(variablePrefix, 'g');
const escapeSearch = new RegExp(escapeVariable, 'g');
class Tag {
    strings;
    values;
    version = 0;
    isTag = true;
    hasLiveElements = false;
    clones = []; // elements on document. Needed at destroy process to know what to destroy
    childTags = []; // tags on me
    tagSupport;
    lastTemplateString = undefined; // used to compare templates for updates
    // only present when a child of a tag
    ownerTag;
    // insertBefore?: Element
    appElement; // only seen on this.getAppElement().appElement
    // present only when an array. Populated by Tag.key()
    memory = {};
    constructor(strings, values) {
        this.strings = strings;
        this.values = values;
    }
    /** Used for array, such as array.map(), calls aka array.map(x => html``.key(x)) */
    key(arrayValue) {
        this.memory.arrayValue = arrayValue;
        return this;
    }
    destroy(options = {
        stagger: 0,
        byParent: false, // Only destroy clones of direct children
    }) {
        if (!this.hasLiveElements) {
            throw new Error('destroying wrong tag');
        }
        const tagSupport = this.tagSupport;
        const global = tagSupport.templater.global;
        // removing is considered rendering. Prevents after event processing of this tag even tho possibly deleted
        // ++this.tagSupport.templater.global.renderCount
        const subject = tagSupport.subject;
        // put back down the template tag
        const insertBefore = global.insertBefore;
        if (_Clones_type__WEBPACK_IMPORTED_MODULE_8__.isRemoveTemplates) {
            const placeholder = global.placeholderElm;
            if (placeholder && !('arrayValue' in this.memory)) {
                if (!options.byParent) {
                    (0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_9__.restoreTagMarker)(this, insertBefore);
                }
            }
        }
        delete global.placeholderElm;
        // the isComponent check maybe able to be removed
        const isComponent = tagSupport ? true : false;
        if (isComponent) {
            (0,_tagRunner__WEBPACK_IMPORTED_MODULE_0__.runBeforeDestroy)(tagSupport, this);
        }
        const childTags = options.byParent ? [] : getChildTagsToDestroy(this.childTags);
        // signify that no further event rendering should take place by making logic think a render occurred during event
        // signify immediately child has been deleted (looked for during event processing)
        childTags.forEach(child => {
            const subGlobal = child.tagSupport.templater.global;
            delete subGlobal.newest;
            subGlobal.deleted = true;
        });
        delete global.oldest;
        delete global.newest;
        global.deleted = true;
        this.hasLiveElements = false;
        delete subject.tag;
        this.destroySubscriptions();
        let mainPromise;
        if (this.ownerTag) {
            this.ownerTag.childTags = this.ownerTag.childTags.filter(child => child !== this);
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
        const global = this.tagSupport.templater.global;
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
            promise = (0,_elementDestroyCheck_function__WEBPACK_IMPORTED_MODULE_4__.elementDestroyCheck)(customElm, stagger);
        }
        const next = () => {
            clone.parentNode?.removeChild(clone);
            const ownerTag = this.ownerTag;
            if (ownerTag) {
                // Sometimes my clones were first registered to my owner, remove them from owner
                ownerTag.clones = ownerTag.clones.filter(compareClone => compareClone !== clone);
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
    getTemplate() {
        const string = this.strings.map((string, index) => {
            const safeString = string.replace(prefixSearch, escapeVariable);
            const endString = safeString + (this.values.length > index ? `{${variablePrefix}${index}}` : '');
            // const trimString = index === 0 || index === this.strings.length-1 ? endString.trim() : endString
            const trimString = endString.replace(/>\s*/g, '>').replace(/\s*</g, '<');
            return trimString;
        }).join('');
        const interpolation = (0,_interpolateElement__WEBPACK_IMPORTED_MODULE_2__.interpolateString)(string);
        this.lastTemplateString = interpolation.string;
        return {
            interpolation,
            // string,
            string: interpolation.string,
            strings: this.strings,
            values: this.values,
            context: this.tagSupport.templater.global.context || {},
        };
    }
    isLikeTag(tag) {
        return (0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_7__.isLikeTags)(this, tag);
    }
    updateByTag(tag) {
        if (!this.tagSupport.templater.global.oldest) {
            throw new Error('no oldest here');
        }
        if (!this.hasLiveElements) {
            throw new Error('trying to update a tag with no elements on stage');
        }
        this.tagSupport.templater.global.newest = tag;
        if (!this.tagSupport.templater.global.context) {
            throw new Error('issue back here');
        }
        this.updateConfig(tag.strings, tag.values);
    }
    updateConfig(strings, values) {
        this.strings = strings;
        this.updateValues(values);
    }
    update() {
        return this.updateContext(this.tagSupport.templater.global.context);
    }
    updateValues(values) {
        this.values = values;
        return this.updateContext(this.tagSupport.templater.global.context);
    }
    updateContext(context) {
        this.strings.map((_string, index) => {
            const variableName = variablePrefix + index;
            const hasValue = this.values.length > index;
            const value = this.values[index];
            // is something already there?
            const exists = variableName in context;
            if (exists) {
                return updateContextItem(context, variableName, value);
            }
            if (!hasValue) {
                return;
            }
            // 🆕 First time values below
            context[variableName] = (0,_processNewValue_function__WEBPACK_IMPORTED_MODULE_5__.processNewValue)(hasValue, value, this);
        });
        return context;
    }
    getAppElement() {
        let tag = this;
        while (tag.ownerTag) {
            tag = tag.ownerTag;
        }
        return tag;
    }
    /** Used during HMR only where static content itself could have been edited */
    rebuild() {
        // const insertBefore = this.insertBefore
        const insertBefore = this.tagSupport.templater.global.insertBefore;
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
    buildBeforeElement(insertBefore, options = {
        forceElement: false,
        counts: { added: 0, removed: 0 },
    }) {
        const subject = this.tagSupport.subject;
        const thisTemplater = this.tagSupport.templater;
        const global = thisTemplater.global;
        if (_Clones_type__WEBPACK_IMPORTED_MODULE_8__.isRemoveTemplates) {
            const placeholderElm = global.placeholderElm;
            if (placeholderElm) {
                const parentNode = placeholderElm.parentNode;
                parentNode.insertBefore(insertBefore, placeholderElm);
                // ??? - removed as we don't steal clones anymore
                // this.clones.push( placeholderElm ) // put back on chopping block
                delete global.placeholderElm;
            }
        }
        const trueInsertBefore = insertBefore;
        global.oldest = this;
        global.newest = this;
        subject.tag = this;
        this.hasLiveElements = true;
        // remove old clones
        if (this.clones.length) {
            this.clones.forEach(clone => this.checkCloneRemoval(clone, 0));
        }
        global.insertBefore = insertBefore;
        // const context = this.tagSupport.memory.context // this.update()
        const context = this.update();
        const template = this.getTemplate();
        if (!trueInsertBefore.parentNode) {
            throw new Error('no parent before building tag');
        }
        const elementContainer = document.createElement('div');
        elementContainer.id = 'tag-temp-holder';
        // render content with a first child that we can know is our first element
        elementContainer.innerHTML = `<template id="temp-template-tag-wrap">${template.string}</template>`;
        // Search/replace innerHTML variables but don't interpolate tag components just yet
        const { tagComponents } = (0,_interpolateElement__WEBPACK_IMPORTED_MODULE_2__.interpolateElement)(elementContainer, context, template, this, // ownerTag,
        {
            forceElement: options.forceElement,
            counts: options.counts
        });
        if (!trueInsertBefore.parentNode) {
            throw new Error('no parent building tag');
        }
        afterInterpolateElement(elementContainer, trueInsertBefore, // insertBefore (will be removed)
        this, // ownerTag
        context, options);
        // Any tag components that were found should be processed AFTER the owner processes its elements. Avoid double processing of elements attributes like (oninit)=${}
        let isForceElement = options.forceElement;
        tagComponents.forEach(tagComponent => {
            const tagSupport = tagComponent.ownerTag.tagSupport;
            const tagGlobal = tagSupport.templater.global;
            const placeholderElm = tagGlobal.placeholderElm; // global.placeholderElm
            if (!placeholderElm && !insertBefore.parentNode) {
                throw new Error('no parent building tag components');
            }
            const before = tagComponent.insertBefore; // insertBefore  (will be removed)
            (0,_interpolateTemplate__WEBPACK_IMPORTED_MODULE_3__.subscribeToTemplate)(before, // tagComponent.insertBefore,
            tagComponent.subject, tagComponent.ownerTag, options.counts, { isForceElement });
            const clones = afterInterpolateElement(elementContainer, before, // (will be removed)
            tagComponent.ownerTag, // this, // ownerTag
            context, options);
            if (placeholderElm && !placeholderElm?.parentNode) {
                const clone = clones[this.clones.length - 1];
                if (clone) {
                    (0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_9__.restoreTagMarker)(tagComponent.ownerTag, clone);
                }
            }
            if (placeholderElm) {
                if (placeholderElm.parentNode) {
                    if (!global.placeholderElm) {
                        global.placeholderElm = placeholderElm;
                    }
                }
                if (this.clones.length) {
                    if (insertBefore.parentNode) {
                        global.placeholderElm = insertBefore.previousSibling;
                        const parentNode = insertBefore.parentNode;
                        parentNode.removeChild(insertBefore);
                    }
                }
            }
        });
        if (!global.placeholderElm) {
            // const clone = getLastCloneFromTags(this)
            // const clone = (insertBefore as Element).previousElementSibling as Element
            const clone = insertBefore.previousSibling;
            if (clone) {
                const parentNode = insertBefore.parentNode;
                global.placeholderElm = clone;
                parentNode.removeChild(insertBefore);
            }
        }
    }
}
function afterInterpolateElement(container, insertBefore, tag, 
// preClones: Clones,
context, options) {
    const clones = (0,_render__WEBPACK_IMPORTED_MODULE_1__.buildClones)(container, insertBefore);
    if (!clones.length) {
        return clones;
    }
    const ownerSupport = tag.tagSupport;
    const ownerGlobal = ownerSupport.templater.global;
    const hadBefore = _Clones_type__WEBPACK_IMPORTED_MODULE_8__.isRemoveTemplates && ownerGlobal.placeholderElm;
    const parentNode = hadBefore ? ownerGlobal.placeholderElm?.parentNode : insertBefore.parentNode;
    // we could now be processing same tag but more after components being rendered
    if (hadBefore) {
        // 0 put the template back down
        (0,_insertAfter_function__WEBPACK_IMPORTED_MODULE_10__.insertAfter)(insertBefore, hadBefore);
        // ??? - removed as need for arrays
        delete ownerGlobal.placeholderElm;
    }
    clones.forEach(clone => (0,_interpolateTemplate__WEBPACK_IMPORTED_MODULE_3__.afterElmBuild)(clone, options, context, tag));
    let hasPopClone;
    if (_Clones_type__WEBPACK_IMPORTED_MODULE_8__.isRemoveTemplates) {
        const clone = insertBefore.previousSibling; // clones[clones.length - 1]
        if (clone) {
            const isTemplate = clone.tagName === 'TEMPLATE' && clone.hasAttribute('interpolate');
            if (!isTemplate) {
                hasPopClone = ownerGlobal.placeholderElm = clone; // insertBefore
            }
        }
    }
    if (clones.find(x => x === insertBefore)) {
        throw new Error('adding marker to owner in tag class');
    }
    tag.clones.push(...clones);
    if (_Clones_type__WEBPACK_IMPORTED_MODULE_8__.isRemoveTemplates) {
        if (hasPopClone) { //  || hadBefore
            parentNode.removeChild(insertBefore); // belongs to another tag
        }
    }
    return clones;
}
function getChildTagsToDestroy(childTags, allTags = []) {
    for (let index = childTags.length - 1; index >= 0; --index) {
        const cTag = childTags[index];
        if (allTags.find(x => x === cTag)) {
            // TODO: Lets find why a child tag is attached twice to owner
            throw new Error('child tag registered twice for delete');
        }
        allTags.push(cTag);
        childTags.splice(index, 1);
        getChildTagsToDestroy(cTag.childTags, allTags);
    }
    return allTags;
}
function updateContextItem(context, variableName, value) {
    const subject = context[variableName];
    const tag = subject.tag;
    if (tag) {
        const oldTemp = tag.tagSupport.templater;
        const oldWrap = oldTemp.wrapper; // tag versus component
        if (value.global !== oldTemp.global) {
            if (oldWrap && (0,_isInstance__WEBPACK_IMPORTED_MODULE_6__.isTagComponent)(value)) {
                const oldValueFn = oldWrap.original;
                const newValueFn = value.wrapper?.original;
                const fnMatched = oldValueFn === newValueFn;
                if (fnMatched) {
                    value.global = oldTemp.global;
                }
            }
        }
    }
    // return updateExistingValue(subject, value, this)
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_6__.isSubjectInstance)(value)) {
        return;
    }
    subject.set(value); // listeners will evaluate updated values to possibly update display(s)
    return;
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
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");


class BaseTagSupport {
    templater;
    subject;
    isApp = true;
    propsConfig;
    memory = {
        // context: {}, // populated after reading interpolated.values array converted to an object {variable0, variable:1}
        state: {
            newest: [],
        },
    };
    constructor(templater, subject) {
        this.templater = templater;
        this.subject = subject;
        const children = this.templater.children; // children tags passed in as arguments
        const props = this.templater.props; // natural props
        const latestCloned = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(props); // alterProps(props, templater)
        this.propsConfig = {
            latest: props,
            latestCloned, // assume its HTML children and then detect
            clonedProps: latestCloned, // maybe duplicate
            lastClonedKidValues: children.value.map(kid => {
                const cloneValues = cloneValueArray(kid.values);
                return cloneValues;
            })
        };
        // if the latest props are not HTML children, then clone the props for later render cycles to compare
        if (!(0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagInstance)(props)) {
            this.propsConfig.latestCloned = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(latestCloned);
            this.propsConfig.clonedProps = this.propsConfig.latestCloned;
        }
    }
}
function cloneValueArray(values) {
    return values.map((value) => {
        const tag = value;
        if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagInstance)(tag)) {
            return cloneValueArray(tag.values);
        }
        if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagComponent)(tag)) {
            const tagComponent = tag;
            return (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(tagComponent.props);
        }
        if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagArray)(tag)) {
            return cloneValueArray(tag);
        }
        return (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(value);
    });
}
class TagSupport extends BaseTagSupport {
    ownerTagSupport;
    templater;
    subject;
    isApp = false;
    constructor(ownerTagSupport, templater, subject) {
        super(templater, subject);
        this.ownerTagSupport = ownerTagSupport;
        this.templater = templater;
        this.subject = subject;
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
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLikeTags.function */ "./ts/isLikeTags.function.ts");
/* harmony import */ var _destroyTag_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./destroyTag.function */ "./ts/destroyTag.function.ts");




class TemplaterResult {
    props;
    children;
    isTag = false; // when true, is basic tag non-component
    tagged;
    wrapper;
    global = {
        newestTemplater: this,
        context: {}, // populated after reading interpolated.values array converted to an object {variable0, variable:1}
        providers: [],
        /** Indicator of re-rending. Saves from double rending something already rendered */
        renderCount: 0,
        deleted: false,
        subscriptions: []
    };
    tagSupport;
    constructor(props, children) {
        this.props = props;
        this.children = children;
    }
    /*
    redraw?: (
      force?: boolean, // force children to redraw
    ) => Tag
    */
    isTemplater = true;
}
function renderWithSupport(tagSupport, existingTag, subject, ownerTag) {
    const wrapTagSupport = tagSupport; // this.tagSupport
    /* BEFORE RENDER */
    const runtimeOwnerTag = existingTag?.ownerTag || ownerTag;
    if (existingTag) {
        wrapTagSupport.memory.state.newest = [...existingTag.tagSupport.memory.state.newest];
        wrapTagSupport.templater.global = existingTag.tagSupport.templater.global;
        (0,_tagRunner__WEBPACK_IMPORTED_MODULE_0__.runBeforeRedraw)(wrapTagSupport, existingTag);
    }
    else {
        if (!wrapTagSupport) {
            throw new Error('63521');
        }
        // first time render
        (0,_tagRunner__WEBPACK_IMPORTED_MODULE_0__.runBeforeRender)(wrapTagSupport, runtimeOwnerTag);
        // TODO: Logic below most likely could live within providers.ts inside the runBeforeRender function
        const providers = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
        providers.ownerTag = runtimeOwnerTag;
    }
    /* END: BEFORE RENDER */
    const templater = wrapTagSupport.templater;
    // NEW TAG CREATED HERE
    const retag = templater.wrapper(wrapTagSupport, subject);
    /* AFTER */
    (0,_tagRunner__WEBPACK_IMPORTED_MODULE_0__.runAfterRender)(wrapTagSupport, retag);
    const isLikeTag = !existingTag || (0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_2__.isLikeTags)(existingTag, retag);
    if (!isLikeTag) {
        destroyUnlikeTags(existingTag, templater, subject);
    }
    retag.ownerTag = runtimeOwnerTag;
    wrapTagSupport.templater.global.newest = retag;
    return retag;
}
function destroyUnlikeTags(existingTag, // old
templater, // new
subject) {
    const oldGlobal = existingTag.tagSupport.templater.global;
    const insertBefore = oldGlobal.insertBefore;
    (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_3__.destroyTagMemory)(existingTag, subject);
    // ??? - new so that when a tag is destroy the unlike does not carry the destroy signifier
    templater.global = { ...templater.global }; // break memory references
    const global = templater.global;
    global.insertBefore = insertBefore;
    global.deleted = false;
    delete global.oldest;
    delete global.newest;
    delete subject.tag;
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
function alterProps(props, templater, ownerSupport) {
    function callback(toCall, callWith) {
        return callbackPropOwner(toCall, callWith, templater, ownerSupport);
    }
    const isPropTag = (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagInstance)(props);
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
function callbackPropOwner(toCall, callWith, templater, // only used to prevent rendering double
ownerSupport) {
    const renderCount = templater.global.renderCount;
    const callbackResult = toCall(...callWith);
    if (templater.global.renderCount > renderCount) {
        throw new Error('already rendered');
    }
    const lastestOwner = ownerSupport.templater.global.newest;
    const newOwner = (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__.renderTagSupport)(lastestOwner.tagSupport, true);
    if (newOwner.tagSupport.templater.global.newest != newOwner) {
        throw new Error('newest assignment issue?');
    }
    return callbackResult;
}


/***/ }),

/***/ "./ts/bindSubjectCallback.function.ts":
/*!********************************************!*\
  !*** ./ts/bindSubjectCallback.function.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindSubjectCallback: () => (/* binding */ bindSubjectCallback),
/* harmony export */   runTagCallback: () => (/* binding */ runTagCallback)
/* harmony export */ });
/* harmony import */ var _renderTagSupport_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderTagSupport.function */ "./ts/renderTagSupport.function.ts");
/** File largely responsible for reacting to element events, such as onclick */

function bindSubjectCallback(value, tag) {
    // Is this children? No override needed
    if (value.isChildOverride) {
        return value;
    }
    if (!tag.ownerTag && !tag.tagSupport.templater.global.isApp) {
        throw new Error('no ownerTag issue here');
    }
    const subjectFunction = (element, args) => runTagCallback(value, tag, element, args);
    // link back to original. Mostly used for <div oninit ondestroy> animations
    subjectFunction.tagFunction = value;
    return subjectFunction;
}
function runTagCallback(value, tag, bindTo, args) {
    const tagSupport = tag.tagSupport;
    const renderCount = tagSupport.templater.global.renderCount;
    const method = value.bind(bindTo);
    const callbackResult = method(...args);
    const sameRenderCount = renderCount === tagSupport.templater.global.renderCount;
    // already rendered OR tag was deleted before event processing
    if (!sameRenderCount || tagSupport.templater.global.deleted) {
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
            if (tagSupport.templater.global.deleted) {
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
/* harmony import */ var _Clones_type__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Clones.type */ "./ts/Clones.type.ts");
/* harmony import */ var _insertAfter_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./insertAfter.function */ "./ts/insertAfter.function.ts");





function checkDestroyPrevious(subject, // existing.value is the old value
newValue, insertBefore) {
    const arraySubject = subject;
    const wasArray = arraySubject.lastArray;
    // no longer an array
    if (wasArray && !(0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagArray)(newValue)) {
        const placeholderElm = arraySubject.placeholderElm;
        delete arraySubject.lastArray;
        delete arraySubject.placeholderElm;
        (0,_insertAfter_function__WEBPACK_IMPORTED_MODULE_4__.insertAfter)(insertBefore, placeholderElm);
        wasArray.forEach(({ tag }) => destroyArrayTag(tag, { added: 0, removed: 0 }));
        return 'array';
    }
    const tagSubject = subject;
    const existingTag = tagSubject.tag;
    // no longer tag or component?
    if (existingTag) {
        const isValueTag = (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagInstance)(newValue);
        const isSubjectTag = (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagInstance)(subject.value);
        if (isSubjectTag && isValueTag) {
            const newTag = newValue;
            // its a different tag now
            if (!(0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_1__.isLikeTags)(newTag, existingTag)) {
                // put template back down
                if (_Clones_type__WEBPACK_IMPORTED_MODULE_3__.isRemoveTemplates) {
                    restoreTagMarker(existingTag, insertBefore);
                }
                (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(existingTag, tagSubject);
                return 2;
            }
            return false;
        }
        const isValueTagComponent = (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagComponent)(newValue);
        if (isValueTagComponent) {
            return false; // its still a tag component
        }
        // put template back down
        if (_Clones_type__WEBPACK_IMPORTED_MODULE_3__.isRemoveTemplates) {
            restoreTagMarker(existingTag, insertBefore);
        }
        // destroy old component, value is not a component
        (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(existingTag, tagSubject);
        return 'different-tag';
    }
    const displaySubject = subject;
    const hasLastValue = 'lastValue' in displaySubject;
    const lastValue = displaySubject.lastValue; // TODO: we maybe able to use displaySubject.value and remove concept of lastValue
    // was simple value but now something bigger
    if (hasLastValue && lastValue !== newValue) {
        destroySimpleValue(insertBefore, displaySubject);
        return 4;
    }
    return false;
}
function destroyArrayTag(tag, counts) {
    (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagSupportPast)(tag.tagSupport);
    tag.destroy({
        stagger: counts.removed++,
    });
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
function restoreTagMarker(existingTag, insertBefore) {
    const global = existingTag.tagSupport.templater.global;
    const placeholderElm = global.placeholderElm;
    if (placeholderElm) {
        (0,_insertAfter_function__WEBPACK_IMPORTED_MODULE_4__.insertAfter)(insertBefore, placeholderElm);
        // delete global.placeholderElm
    }
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
    if (obj1 === obj2 || isSameFunctions(obj1, obj2)) {
        return true;
    }
    if (typeof obj1 !== 'object' ||
        typeof obj2 !== 'object' ||
        obj1 === null ||
        obj2 === null) {
        return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    // If obj is already visited, return the cloned reference
    if (visited.has(obj1)) {
        return true;
    }
    // Register the cloned object to avoid cyclic references
    visited.set(obj1, 0);
    for (const key of keys1) {
        const keyFound = keys2.includes(key);
        if (!keyFound || !isDeepEqual(obj1[key], obj2[key], visited)) {
            /*
            if(isSameFunctions(obj1[key], obj2[key])) {
              continue
            }
            */
            return false;
        }
    }
    // Check if obj1 and obj2 are both arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            return false;
        }
        for (let i = 0; i < obj1.length; i++) {
            if (!isDeepEqual(obj1[i], obj2[i], visited)) {
                return false;
            }
        }
    }
    else if (Array.isArray(obj1) || Array.isArray(obj2)) {
        // One is an array, and the other is not
        return false;
    }
    return true;
}
function isSameFunctions(fn0, fn1) {
    const bothFunction = fn0 instanceof Function && fn1 instanceof Function;
    return bothFunction && fn0.toString() === fn1.toString();
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
function destroyTagMemory(tag, subject) {
    const oldTagSupport = tag.tagSupport;
    if (subject != oldTagSupport.subject) {
        throw new Error('fff - subjects do not match');
    }
    delete subject.tag;
    delete oldTagSupport.subject.tag; // TODO: this line maybe not needed
    // must destroy oldest which is tag with elements on stage
    const oldest = oldTagSupport.templater.global.oldest;
    oldest.destroy();
    destroyTagSupportPast(oldTagSupport);
    oldTagSupport.templater.global.context = {};
}
function destroyTagSupportPast(oldTagSupport) {
    delete oldTagSupport.templater.global.oldest;
    delete oldTagSupport.templater.global.newest;
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

/***/ "./ts/elementInitCheck.ts":
/*!********************************!*\
  !*** ./ts/elementInitCheck.ts ***!
  \********************************/
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

/***/ "./ts/errors.ts":
/*!**********************!*\
  !*** ./ts/errors.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArrayNoKeyError: () => (/* binding */ ArrayNoKeyError),
/* harmony export */   StateMismatchError: () => (/* binding */ StateMismatchError),
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


/***/ }),

/***/ "./ts/getCallback.ts":
/*!***************************!*\
  !*** ./ts/getCallback.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCallback: () => (/* binding */ getCallback)
/* harmony export */ });
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");
/* harmony import */ var _set_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./set.function */ "./ts/set.function.ts");
/* harmony import */ var _renderTagSupport_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderTagSupport.function */ "./ts/renderTagSupport.function.ts");



let innerCallback = (callback) => () => {
    throw new Error('Callback function was called immediately in sync and must instead be call async');
};
const getCallback = () => innerCallback;
const originalGetter = innerCallback; // getCallback
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse)({
    beforeRender: (tagSupport) => initMemory(tagSupport),
    beforeRedraw: (tagSupport) => initMemory(tagSupport),
    afterRender: (_tagSupport) => {
        innerCallback = originalGetter; // prevent crossing callbacks with another tag
    },
});
function updateState(stateFrom, stateTo) {
    stateFrom.forEach((state, index) => {
        const fromValue = (0,_set_function__WEBPACK_IMPORTED_MODULE_1__.getStateValue)(state);
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
    const newest = state.newest;
    // ensure that the oldest has the latest values first
    updateState(newest, oldState);
    // run the callback
    const promise = callback(...args);
    // send the oldest state changes into the newest
    updateState(oldState, newest);
    (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_2__.renderTagSupport)(tagSupport, false);
    if (promise instanceof Promise) {
        promise.finally(() => {
            // send the oldest state changes into the newest
            updateState(oldState, newest);
            (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_2__.renderTagSupport)(tagSupport, false);
        });
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
    const sameSupport = oldTagSupport === newTagSupport;
    const samePropConfig = oldTagSupport.propsConfig === newTagSupport.propsConfig;
    // const sameProps = oldTagSupport.propsConfig.latest === newTagSupport.propsConfig.latest
    if (sameSupport) {
        throw new Error('sameSupport - 22');
    }
    if (samePropConfig) {
        throw new Error('samePropConfig - 22');
    }
    if (newTagSupport.templater.isTag || oldTagSupport.templater.isTag || newTemplater.isTag) {
        throw new Error('trying to compare a basic tag');
    }
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

/***/ "./ts/inputAttribute.ts":
/*!******************************!*\
  !*** ./ts/inputAttribute.ts ***!
  \******************************/
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

/***/ "./ts/interpolateAttributes.ts":
/*!*************************************!*\
  !*** ./ts/interpolateAttributes.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   interpolateAttributes: () => (/* binding */ interpolateAttributes)
/* harmony export */ });
/* harmony import */ var _processAttribute_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./processAttribute.function */ "./ts/processAttribute.function.ts");

function howToSetAttribute(element, name, value) {
    element.setAttribute(name, value);
}
function howToSetInputValue(element, name, value) {
    element[name] = value;
}
function interpolateAttributes(child, scope, ownerTag) {
    const attrNames = child.getAttributeNames();
    let howToSet = howToSetAttribute;
    attrNames.forEach(attrName => {
        if (child.nodeName === 'INPUT' && attrName === 'value') {
            howToSet = howToSetInputValue;
        }
        const value = child.getAttribute(attrName);
        (0,_processAttribute_function__WEBPACK_IMPORTED_MODULE_0__.processAttribute)(attrName, value, child, scope, ownerTag, howToSet);
        howToSet = howToSetAttribute; // put back
    });
}


/***/ }),

/***/ "./ts/interpolateContentTemplates.ts":
/*!*******************************************!*\
  !*** ./ts/interpolateContentTemplates.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   interpolateContentTemplates: () => (/* binding */ interpolateContentTemplates)
/* harmony export */ });
/* harmony import */ var _interpolateTemplate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interpolateTemplate */ "./ts/interpolateTemplate.ts");

function interpolateContentTemplates(element, context, tag, options, children) {
    if (!children || element.tagName === 'TEMPLATE') {
        return { clones: [], tagComponents: [] }; // done
    }
    // counting for animation stagger computing
    const counts = options.counts;
    const clones = [];
    const tagComponents = [];
    const childArray = new Array(...children);
    childArray.forEach(child => {
        const { clones: nextClones, tagComponent } = (0,_interpolateTemplate__WEBPACK_IMPORTED_MODULE_0__.interpolateTemplate)(child, context, tag, counts, options);
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
                    const { tagComponent } = (0,_interpolateTemplate__WEBPACK_IMPORTED_MODULE_0__.interpolateTemplate)(subChild, context, tag, counts, options);
                    if (tagComponent) {
                        tagComponents.push(tagComponent);
                    }
                }
                const { clones: nextClones, tagComponents: nextTagComponent } = interpolateContentTemplates(subChild, context, tag, options, subChild.children);
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

/***/ "./ts/interpolateElement.ts":
/*!**********************************!*\
  !*** ./ts/interpolateElement.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   interpolateElement: () => (/* binding */ interpolateElement),
/* harmony export */   interpolateString: () => (/* binding */ interpolateString)
/* harmony export */ });
/* harmony import */ var _interpolateAttributes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interpolateAttributes */ "./ts/interpolateAttributes.ts");
/* harmony import */ var _interpolations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interpolations */ "./ts/interpolations.ts");
/* harmony import */ var _interpolateContentTemplates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interpolateContentTemplates */ "./ts/interpolateContentTemplates.ts");
/* harmony import */ var _Tag_class__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Tag.class */ "./ts/Tag.class.ts");




/** Review elements within an element */
function interpolateElement(container, // element containing innerHTML to review interpolations
context, // variables used to evaluate
interpolatedTemplates, tagOwner, options) {
    const clones = [];
    const tagComponents = [];
    const result = interpolatedTemplates.interpolation;
    const template = container.children[0];
    const children = template.content.children;
    if (result.keys.length) {
        const { clones: nextClones, tagComponents: nextTagComponents } = (0,_interpolateContentTemplates__WEBPACK_IMPORTED_MODULE_2__.interpolateContentTemplates)(container, context, tagOwner, options, children);
        clones.push(...nextClones);
        tagComponents.push(...nextTagComponents);
    }
    (0,_interpolateAttributes__WEBPACK_IMPORTED_MODULE_0__.interpolateAttributes)(container, context, tagOwner);
    processChildrenAttributes(children, context, tagOwner);
    return { clones, tagComponents };
}
function processChildrenAttributes(children, context, ownerTag) {
    new Array(...children).forEach(child => {
        (0,_interpolateAttributes__WEBPACK_IMPORTED_MODULE_0__.interpolateAttributes)(child, context, ownerTag);
        if (child.children) {
            processChildrenAttributes(child.children, context, ownerTag);
        }
    });
}
function interpolateString(string) {
    const result = (0,_interpolations__WEBPACK_IMPORTED_MODULE_1__.interpolateToTemplates)(string);
    result.string = result.string.replace(_Tag_class__WEBPACK_IMPORTED_MODULE_3__.escapeSearch, _Tag_class__WEBPACK_IMPORTED_MODULE_3__.variablePrefix);
    return result;
}


/***/ }),

/***/ "./ts/interpolateTemplate.ts":
/*!***********************************!*\
  !*** ./ts/interpolateTemplate.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterElmBuild: () => (/* binding */ afterElmBuild),
/* harmony export */   interpolateTemplate: () => (/* binding */ interpolateTemplate),
/* harmony export */   subscribeToTemplate: () => (/* binding */ subscribeToTemplate)
/* harmony export */ });
/* harmony import */ var _Tag_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tag.class */ "./ts/Tag.class.ts");
/* harmony import */ var _elementInitCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./elementInitCheck */ "./ts/elementInitCheck.ts");
/* harmony import */ var _processSubjectValue_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./processSubjectValue.function */ "./ts/processSubjectValue.function.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _scanTextAreaValue_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scanTextAreaValue.function */ "./ts/scanTextAreaValue.function.ts");
/* harmony import */ var _updateExistingValue_function__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./updateExistingValue.function */ "./ts/updateExistingValue.function.ts");






function interpolateTemplate(insertBefore, // <template end interpolate /> (will be removed)
context, // variable scope of {`__tagvar${index}`:'x'}
ownerTag, // Tag class
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
                ownerTag,
                subject: existingSubject,
                insertBefore
            }
        };
    }
    let isForceElement = options.forceElement;
    subscribeToTemplate(insertBefore, existingSubject, ownerTag, counts, { isForceElement });
    return { clones };
}
function subscribeToTemplate(insertBefore, subject, ownerTag, counts, // used for animation stagger computing
{ isForceElement }) {
    let called = false;
    const callback = (value) => {
        // const orgInsert = insertBefore
        /*
        const clone = (subject as DisplaySubject).clone
        if(clone && clone.parentNode) {
          insertBefore = clone
        }
        */
        if (called) {
            (0,_updateExistingValue_function__WEBPACK_IMPORTED_MODULE_5__.updateExistingValue)(subject, value, ownerTag, insertBefore);
            return;
        }
        (0,_processSubjectValue_function__WEBPACK_IMPORTED_MODULE_2__.processSubjectValue)(value, subject, insertBefore, ownerTag, {
            counts: { ...counts },
            forceElement: isForceElement,
        });
        if (isForceElement) {
            isForceElement = false; // only can happen once
        }
        // ownerTag.clones.push(...clones)
        // ownerTag.clones.push(...nextClones)
        // clones.push(...nextClones)
        called = true;
    };
    const sub = subject.subscribe(callback);
    ownerTag.tagSupport.templater.global.subscriptions.push(sub);
}
function afterElmBuild(elm, options, context, ownerTag) {
    if (!elm.getAttribute) {
        return;
    }
    const tagName = elm.nodeName; // elm.tagName
    if (tagName === 'TEXTAREA') {
        (0,_scanTextAreaValue_function__WEBPACK_IMPORTED_MODULE_4__.scanTextAreaValue)(elm, context, ownerTag);
    }
    let diff = options.counts.added;
    diff = (0,_elementInitCheck__WEBPACK_IMPORTED_MODULE_1__.elementInitCheck)(elm, options.counts) - diff;
    if (elm.children) {
        new Array(...elm.children).forEach((child, index) => {
            const subOptions = {
                ...options,
                counts: options.counts,
            };
            return afterElmBuild(child, subOptions, context, ownerTag);
        });
    }
}


/***/ }),

/***/ "./ts/interpolations.ts":
/*!******************************!*\
  !*** ./ts/interpolations.ts ***!
  \******************************/
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
        const name = 'template-' + template.length;
        keys.push(id);
        return `<template interpolate end id="${id}" name="${name}"></template>`;
    });
    return { string, keys };
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
/* harmony export */   isTagArray: () => (/* binding */ isTagArray),
/* harmony export */   isTagComponent: () => (/* binding */ isTagComponent),
/* harmony export */   isTagInstance: () => (/* binding */ isTagInstance)
/* harmony export */ });
function isTagComponent(value) {
    return value?.isTemplater === true;
}
function isTagInstance(tag) {
    return tag?.isTag === true;
}
function isSubjectInstance(subject) {
    return (subject?.isSubject === true || subject?.subscribe) ? true : false; // subject?.isSubject === true || 
}
function isTagArray(value) {
    return value instanceof Array && value.every(x => isTagInstance(x));
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
function isLikeTags(tag0, tag1) {
    if (tag0.strings.length !== tag1.strings.length) {
        return false;
    }
    const everyStringMatched = tag0.strings.every((string, index) => tag1.strings[index] === string);
    if (!everyStringMatched) {
        return false;
    }
    const valuesLengthsMatch = tag0.values.length === tag1.values.length;
    if (!valuesLengthsMatch) {
        return false;
    }
    const allVarsMatch = tag1.values.every((value, index) => {
        const compareTo = tag0.values[index];
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

/***/ "./ts/onDestroy.ts":
/*!*************************!*\
  !*** ./ts/onDestroy.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   onDestroy: () => (/* binding */ onDestroy)
/* harmony export */ });
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");

/** When undefined, it means a tag is being built for the first time so do run destroy(s) */
let destroyCurrentTagSupport;
function onDestroy(callback) {
    destroyCurrentTagSupport.templater.global.destroyCallback = callback;
}
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse)({
    beforeRender: tagSupport => destroyCurrentTagSupport = tagSupport,
    beforeRedraw: tagSupport => destroyCurrentTagSupport = tagSupport,
    beforeDestroy: (tagSupport, tag) => {
        const callback = tagSupport.templater.global.destroyCallback;
        if (callback) {
            callback();
        }
    }
});


/***/ }),

/***/ "./ts/onInit.ts":
/*!**********************!*\
  !*** ./ts/onInit.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   onInit: () => (/* binding */ onInit)
/* harmony export */ });
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");

function setCurrentTagSupport(support) {
    _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.initCurrentTemplater = support.templater;
}
function onInit(callback) {
    const templater = _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.memory.initCurrentTemplater;
    if (!templater.global.init) {
        ;
        templater.global.init = callback;
        callback(); // fire init
    }
}
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse)({
    beforeRender: tagSupport => setCurrentTagSupport(tagSupport),
    beforeRedraw: tagSupport => setCurrentTagSupport(tagSupport),
});


/***/ }),

/***/ "./ts/processAttribute.function.ts":
/*!*****************************************!*\
  !*** ./ts/processAttribute.function.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processAttribute: () => (/* binding */ processAttribute)
/* harmony export */ });
/* harmony import */ var _inputAttribute__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inputAttribute */ "./ts/inputAttribute.ts");
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bindSubjectCallback.function */ "./ts/bindSubjectCallback.function.ts");



const startRegX = /^\s*{__tagvar/;
const endRegX = /}\s*$/;
function isTagVar(value) {
    return value && value.search(startRegX) >= 0 && value.search(endRegX) >= 0;
}
function processAttribute(attrName, value, child, scope, ownerTag, howToSet) {
    if (isTagVar(value)) {
        return processScopedNameValueAttr(attrName, value, child, scope, ownerTag, howToSet);
    }
    if (isTagVar(attrName)) {
        const contextValueSubject = getContextValueByVarString(scope, attrName);
        let lastValue;
        // the above callback gets called immediately since its a ValueSubject()
        const sub = contextValueSubject.subscribe((value) => {
            processNameOnlyAttr(value, lastValue, child, ownerTag, howToSet);
            lastValue = value;
        });
        ownerTag.tagSupport.templater.global.subscriptions.push(sub); // this is where unsubscribe is picked up
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
child, scope, ownerTag, howToSet) {
    // get the code inside the brackets like "variable0" or "{variable0}"
    const result = getContextValueByVarString(scope, value);
    return processNameValueAttr(attrName, result, child, ownerTag, howToSet);
}
function getContextValueByVarString(scope, value) {
    const code = value.replace('{', '').split('').reverse().join('').replace('}', '').split('').reverse().join('');
    return scope[code];
}
function processNameOnlyAttr(attrValue, lastValue, child, ownerTag, howToSet) {
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
        processNameValueAttr(attrValue, '', child, ownerTag, howToSet);
        return;
    }
    if (attrValue instanceof Object) {
        Object.entries(attrValue).forEach(([name, value]) => processNameValueAttr(name, value, child, ownerTag, howToSet));
        return;
    }
}
function processNameValueAttr(attrName, result, child, ownerTag, howToSet) {
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
                newAttrValue = (0,_bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_2__.bindSubjectCallback)(newAttrValue, ownerTag);
            }
            return processAttributeSubjectValue(newAttrValue, child, attrName, isSpecial, howToSet);
        };
        // 🗞️ Subscribe. Above callback called immediately since its a ValueSubject()
        const sub = result.subscribe(callback);
        // Record subscription for later unsubscribe when element destroyed
        ownerTag.tagSupport.templater.global.subscriptions.push(sub);
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


function processNewValue(hasValue, value, ownerTag) {
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagComponent)(value)) {
        const tagSubject = new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(value);
        return tagSubject;
    }
    if (value instanceof Function) {
        // return getSubjectFunction(value, ownerTag)
        return new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(value);
    }
    if (!hasValue) {
        return; // more strings than values, stop here
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagInstance)(value)) {
        value.ownerTag = ownerTag;
        if (ownerTag.childTags.find(x => x === value)) {
            throw new Error('about to reattach tag already present - 2');
        }
        return new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(value);
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isSubjectInstance)(value)) {
        return value; // its already a value subject
    }
    return new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject(value);
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
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");
/* harmony import */ var _processTagResult_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./processTagResult.function */ "./ts/processTagResult.function.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");




function processSubjectComponent(templater, subject, insertBefore, ownerTag, options) {
    // Check if function component is wrapped in a tag() call
    // TODO: This below check not needed in production mode
    if (templater.tagged !== true) {
        const original = templater.wrapper.original;
        let name = original.name || original.constructor?.name;
        if (name === 'Function') {
            name = undefined;
        }
        const label = name || original.toString().substring(0, 120);
        const error = new Error(`Not a tag component. Wrap your function with tag(). Example tag(props => html\`\`) on component:\n\n${label}\n\n`);
        throw error;
    }
    templater.tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_3__.TagSupport(ownerTag.tagSupport, templater, subject);
    // templater.oldest = subject.tag?.tagSupport.oldest || templater.oldest
    templater.global.insertBefore = insertBefore;
    let retag = subject.tag;
    const providers = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
    providers.ownerTag = ownerTag;
    const isRedraw = !retag || options.forceElement;
    if (isRedraw) {
        retag = redrawSubjectComponent(templater, subject, retag, ownerTag, insertBefore);
    }
    (0,_processTagResult_function__WEBPACK_IMPORTED_MODULE_2__.processTagResult)(retag, subject, // The element set here will be removed from document. Also result.tag will be added in here
    insertBefore, // <template end interpolate /> (will be removed)
    options);
    return retag;
}
function redrawSubjectComponent(templater, subject, retag, ownerTag, insertBefore) {
    const preClones = ownerTag.clones.map(clone => clone);
    retag = (0,_TemplaterResult_class__WEBPACK_IMPORTED_MODULE_0__.renderWithSupport)(templater.tagSupport, subject.tag, // existing tag
    subject, ownerTag);
    if (retag.tagSupport.templater.global.newest != retag) {
        throw new Error('mismatch result newest');
    }
    templater.global.newest = retag;
    if (ownerTag.clones.length > preClones.length) {
        const myClones = ownerTag.clones.filter(fClone => !preClones.find(clone => clone === fClone));
        retag.clones.push(...myClones);
        if (myClones.find(x => x === insertBefore)) {
            throw new Error('way back here we add marker');
        }
    }
    if (ownerTag.childTags.find(x => x === retag)) {
        throw new Error('about to reattach tag already present');
    }
    ownerTag.childTags.push(retag);
    return retag;
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
    ValueTypes["tagArray"] = "tag-array";
    ValueTypes["tagComponent"] = "tag-component";
    ValueTypes["value"] = "value";
})(ValueTypes || (ValueTypes = {}));
function getValueType(value) {
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagComponent)(value)) {
        return ValueTypes.tagComponent;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagInstance)(value)) {
        return ValueTypes.tag;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagArray)(value)) {
        return ValueTypes.tagArray;
    }
    return ValueTypes.value;
}
function processSubjectValue(value, subject, // could be tag via result.tag
insertBefore, // <template end interpolate /> (will be removed)
ownerTag, // owner
options) {
    const valueType = getValueType(value);
    switch (valueType) {
        case ValueTypes.tag:
            (0,_processTag_function__WEBPACK_IMPORTED_MODULE_4__.processTag)(value, subject, insertBefore, ownerTag);
            return;
        case ValueTypes.tagArray:
            return (0,_processTagArray__WEBPACK_IMPORTED_MODULE_2__.processTagArray)(subject, value, insertBefore, ownerTag, options);
        case ValueTypes.tagComponent:
            (0,_processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_0__.processSubjectComponent)(value, subject, insertBefore, ownerTag, options);
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
/* harmony export */   applyFakeTemplater: () => (/* binding */ applyFakeTemplater),
/* harmony export */   processTag: () => (/* binding */ processTag)
/* harmony export */ });
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");
/* harmony import */ var _subject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./subject */ "./ts/subject/index.ts");



/** Could be a regular tag or a component. Both are Tag.class */
function processTag(tag, subject, // could be tag via result.tag
insertBefore, ownerTag) {
    // first time seeing this tag?
    if (!tag.tagSupport) {
        if (!(0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagInstance)(tag)) {
            throw new Error('issue non-tag here');
        }
        applyFakeTemplater(tag, ownerTag, subject);
        if (ownerTag.childTags.find(x => x === tag)) {
            throw new Error('about to reattach tag already present - 5');
        }
        ownerTag.childTags.push(tag);
    }
    tag.ownerTag = ownerTag;
    if (insertBefore.tagName !== 'TEMPLATE') {
        throw new Error(`;;;; - ${insertBefore.nodeName}`);
    }
    tag.buildBeforeElement(insertBefore, {
        counts: { added: 0, removed: 0 },
        forceElement: true,
    });
}
function applyFakeTemplater(tag, ownerTag, subject) {
    if (!ownerTag) {
        throw new Error('no owner error');
    }
    const fakeTemplater = getFakeTemplater();
    tag.tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_1__.TagSupport(ownerTag.tagSupport, fakeTemplater, // the template is provided via html`` call
    subject);
    fakeTemplater.global.oldest = tag;
    fakeTemplater.global.newest = tag;
    fakeTemplater.tagSupport = tag.tagSupport;
    // asking me to render will cause my parent to render
    tag.ownerTag = ownerTag;
}
function getFakeTemplater() {
    return {
        global: {
            renderCount: 0,
            providers: [],
            context: {},
            subscriptions: [],
            deleted: false,
            newestTemplater: {},
        },
        children: new _subject__WEBPACK_IMPORTED_MODULE_2__.ValueSubject([]), // no children
        props: {},
        isTag: true,
        isTemplater: false,
        tagged: false,
        wrapper: (() => undefined),
        tagSupport: {},
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
/* harmony import */ var _insertAfter_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./insertAfter.function */ "./ts/insertAfter.function.ts");





function processTagArray(subject, value, // arry of Tag classes
insertBefore, // <template end interpolate />
ownerTag, options) {
    const clones = ownerTag.clones; // []
    let lastArray = subject.lastArray = subject.lastArray || [];
    if (subject.placeholderElm) {
        const parentPlaceholder = subject.parentAsPlaceholder;
        if (parentPlaceholder) {
            parentPlaceholder.appendChild(insertBefore);
            delete subject.placeholderElm;
        }
        else {
            (0,_insertAfter_function__WEBPACK_IMPORTED_MODULE_4__.insertAfter)(insertBefore, subject.placeholderElm);
        }
        delete subject.placeholderElm;
    }
    let removed = 0;
    /** 🗑️ remove previous items first */
    lastArray = subject.lastArray = subject.lastArray.filter((item, index) => {
        const newLength = value.length - 1;
        const at = index - removed;
        const lessLength = newLength < at;
        const subTag = value[index - removed];
        const subArrayValue = subTag?.memory.arrayValue;
        const tag = item.tag;
        const destroyItem = lessLength || !areLikeValues(subArrayValue, tag.memory.arrayValue);
        if (destroyItem) {
            const last = lastArray[index];
            const tag = last.tag;
            (0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_2__.destroyArrayTag)(tag, options.counts);
            last.deleted = true;
            ++removed;
            ++options.counts.removed;
            return false;
        }
        return true;
    });
    // const masterBefore = template || (template as any).clone
    const before = insertBefore; // || (subject.value as any).insertBefore || (insertBefore as any).clone
    value.forEach((subTag, index) => {
        const previous = lastArray[index];
        const previousSupport = previous?.tag.tagSupport;
        const fakeSubject = new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_0__.ValueSubject({});
        (0,_processTag_function__WEBPACK_IMPORTED_MODULE_3__.applyFakeTemplater)(subTag, ownerTag, fakeSubject);
        if (previousSupport) {
            subTag.tagSupport.templater.global = previousSupport.templater.global;
            previousSupport.templater.global.newest = subTag;
        }
        // check for html``.key()
        const keySet = 'arrayValue' in subTag.memory;
        if (!keySet) {
            const details = {
                template: subTag.getTemplate().string,
                array: value,
                ownerTagContent: ownerTag.lastTemplateString,
            };
            const message = 'Use html`...`.key(item) instead of html`...` to template an Array';
            console.error(message, details);
            const err = new _errors__WEBPACK_IMPORTED_MODULE_1__.ArrayNoKeyError(message, details);
            throw err;
        }
        const couldBeSame = lastArray.length > index;
        if (couldBeSame) {
            const prevSupport = previous.tag.tagSupport;
            const prevGlobal = prevSupport.templater.global;
            const isSame = areLikeValues(previous.tag.memory.arrayValue, subTag.memory.arrayValue);
            if (isSame) {
                subTag.tagSupport = subTag.tagSupport || prevSupport;
                const oldest = prevGlobal.oldest;
                oldest.updateByTag(subTag);
                return [];
            }
            // TODO: should not get here?
            processAddTagArrayItem(before, subTag, index, options, lastArray);
            throw new Error('item should be back');
            // return [] // removed: item should have been previously deleted and will be added back
        }
        processAddTagArrayItem(before, subTag, index, options, lastArray);
        ownerTag.childTags.push(subTag);
    });
    if (value.length) {
        const lastClone = insertBefore.previousSibling;
        setPlaceholderElm(lastClone, insertBefore, subject);
    }
    else {
        const placeholderElm = insertBefore.previousSibling;
        if (placeholderElm) {
            setPlaceholderElm(placeholderElm, insertBefore, subject);
        }
        else {
            const parentNode = insertBefore.parentNode;
            setPlaceholderElm(parentNode, insertBefore, subject);
            subject.parentAsPlaceholder = parentNode;
        }
    }
    return clones;
}
function setPlaceholderElm(lastClone, insertBefore, subject) {
    subject.placeholderElm = lastClone;
    const parentNode = insertBefore.parentNode;
    parentNode.removeChild(insertBefore);
}
function processAddTagArrayItem(before, subTag, index, options, lastArray) {
    const lastValue = {
        tag: subTag, index
    };
    // Added to previous array
    lastArray.push(lastValue);
    const counts = {
        added: options.counts.added + index,
        removed: options.counts.removed,
    };
    if (!before.parentNode) {
        throw new Error('issue adding array item');
    }
    const newTempElm = document.createElement('template');
    before.parentNode.insertBefore(newTempElm, before);
    subTag.buildBeforeElement(newTempElm, // before,
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
function processTagResult(tag, subject, // used for recording past and current value
insertBefore, // <template end interpolate />
{ counts, forceElement, }) {
    if (!insertBefore.parentNode) {
        throw new Error('before here processTagResult');
    }
    // *if appears we already have seen
    const subjectTag = subject;
    const existingTag = subjectTag.tag;
    const previousTag = existingTag?.tagSupport.templater.global.oldest || undefined; // || tag.tagSupport.oldest // subjectTag.tag
    const justUpdate = previousTag; // && !forceElement
    if (previousTag && justUpdate) {
        /*
        const areLike = previousTag.isLikeTag(tag)
    
        // are we just updating an if we already had?
        if(areLike) {
          return processTagResultUpdate(tag, subjectTag, previousTag)
        }
        */
        return processTagResultUpdate(tag, subjectTag, previousTag);
    }
    if (insertBefore.nodeName !== 'TEMPLATE') {
        throw new Error(';;;;');
    }
    tag.buildBeforeElement(insertBefore, {
        counts,
        forceElement,
    });
}
function processTagResultUpdate(tag, subject, // used for recording past and current value
previousTag) {
    // components
    if (subject instanceof Function) {
        const newTag = subject(previousTag.tagSupport);
        previousTag.updateByTag(newTag);
        subject.tag = newTag;
        return;
    }
    previousTag.updateByTag(tag);
    subject.tag = tag;
    return;
}


/***/ }),

/***/ "./ts/provider.utils.ts":
/*!******************************!*\
  !*** ./ts/provider.utils.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   providersChangeCheck: () => (/* binding */ providersChangeCheck)
/* harmony export */ });
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderTagSupport.function */ "./ts/renderTagSupport.function.ts");


function providersChangeCheck(tag) {
    const global = tag.tagSupport.templater.global;
    const providersWithChanges = global.providers.filter(provider => !(0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(provider.instance, provider.clone));
    // reset clones
    providersWithChanges.forEach(provider => {
        const appElement = tag.getAppElement();
        handleProviderChanges(appElement, provider);
        provider.clone = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(provider.instance);
    });
}
function handleProviderChanges(appElement, provider) {
    const tagsWithProvider = getTagsWithProvider(appElement, provider);
    tagsWithProvider.forEach(({ tag, renderCount, provider }) => {
        if (tag.tagSupport.templater.global.deleted) {
            return; // i was deleted after another tag processed
        }
        const notRendered = renderCount === tag.tagSupport.templater.global.renderCount;
        if (notRendered) {
            provider.clone = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepClone)(provider.instance);
            (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_1__.renderTagSupport)(tag.tagSupport, false);
        }
    });
}
function getTagsWithProvider(tag, provider, memory = []) {
    const global = tag.tagSupport.templater.global;
    const compare = global.providers;
    const hasProvider = compare.find(xProvider => xProvider.constructMethod === provider.constructMethod);
    if (hasProvider) {
        memory.push({
            tag,
            renderCount: global.renderCount,
            provider: hasProvider,
        });
    }
    tag.childTags.forEach(child => getTagsWithProvider(child, provider, memory));
    memory.forEach(({ tag }) => {
        if (tag.tagSupport.templater.global.deleted) {
            throw new Error('do not get here - 0');
        }
    });
    return memory;
}


/***/ }),

/***/ "./ts/providers.ts":
/*!*************************!*\
  !*** ./ts/providers.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   providers: () => (/* binding */ providers)
/* harmony export */ });
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");


// TODO: rename
_setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig = {
    providers: [],
    //currentTagSupport: undefined as TagSupport | undefined,
    ownerTag: undefined,
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
            ownerTag: config.ownerTag
        };
        while (owner.ownerTag) {
            const ownerProviders = owner.ownerTag.tagSupport.templater.global.providers;
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
            owner = owner.ownerTag; // cause reloop
        }
        const msg = `Could not inject provider: ${constructor.name} ${constructor}`;
        console.warn(`${msg}. Available providers`, config.providers);
        throw new Error(msg);
    }
};
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse)({
    beforeRender: (tagSupport, ownerTag) => {
        run(tagSupport, ownerTag);
    },
    beforeRedraw: (tagSupport, tag) => {
        run(tagSupport, tag.ownerTag);
    },
    afterRender: (tagSupport) => {
        const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
        tagSupport.templater.global.providers = [...config.providers];
        config.providers.length = 0;
    }
});
function run(tagSupport, ownerTag) {
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.providerConfig;
    // config.currentTagSupport = tagSupport
    config.ownerTag = ownerTag;
    if (tagSupport.templater.global.providers.length) {
        config.providers.length = 0;
        config.providers.push(...tagSupport.templater.global.providers);
    }
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
/* harmony import */ var _provider_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./provider.utils */ "./ts/provider.utils.ts");
/* harmony import */ var _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TemplaterResult.class */ "./ts/TemplaterResult.class.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLikeTags.function */ "./ts/isLikeTags.function.ts");



/** Returns true when rendering owner is not needed. Returns false when rendering owner should occur */
function renderExistingTag(oldestTag, // existing tag already there
newTemplater, tagSupport, subject) {
    const tag = subject.tag;
    newTemplater.global = tag.tagSupport.templater.global;
    if (!oldestTag.hasLiveElements) {
        throw new Error('1080 - should have live elements');
    }
    const preRenderCount = tagSupport.templater.global.renderCount;
    (0,_provider_utils__WEBPACK_IMPORTED_MODULE_0__.providersChangeCheck)(oldestTag);
    // When the providers were checked, a render to myself occurred and I do not need to re-render again
    const latestTag = tagSupport.templater.global.newest;
    if (preRenderCount !== tagSupport.templater.global.renderCount) {
        oldestTag.updateByTag(latestTag);
        return latestTag;
    }
    const oldTemplater = tagSupport.templater || newTemplater;
    const toRedrawTag = subject.tag || oldTemplater.global.newest || oldTemplater.global.oldest; // hmmmmmm, why not newest?
    const redraw = (0,_TemplaterResult_class__WEBPACK_IMPORTED_MODULE_1__.renderWithSupport)(newTemplater.tagSupport, toRedrawTag, subject, oldestTag.ownerTag);
    const oldest = tagSupport.templater.global.oldest || oldestTag;
    redraw.tagSupport.templater.global.oldest = oldest;
    if ((0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_2__.isLikeTags)(latestTag, redraw)) {
        subject.tag = redraw;
        oldest.updateByTag(redraw);
    }
    return redraw;
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
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _renderExistingTag_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderExistingTag.function */ "./ts/renderExistingTag.function.ts");



/** Main function used by all other callers to render/update display of a tag component */
function renderTagSupport(tagSupport, renderUp) {
    const global = tagSupport.templater.global;
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagInstance)(tagSupport.templater)) {
        const newTag = global.newest;
        const ownerTag = newTag.ownerTag;
        ++global.renderCount;
        return renderTagSupport(ownerTag.tagSupport, true);
    }
    // const oldTagSetup = this
    const subject = tagSupport.subject;
    const templater = tagSupport.templater; // oldTagSetup.templater // templater
    const subjectTag = subject.tag;
    const newest = subjectTag?.tagSupport.templater.global.newest;
    let ownerTag;
    let selfPropChange = false;
    const shouldRenderUp = renderUp && newest;
    if (shouldRenderUp) {
        ownerTag = newest.ownerTag;
        if (ownerTag) {
            const nowProps = templater.props;
            const latestProps = newest.tagSupport.propsConfig.latestCloned;
            selfPropChange = !(0,_deepFunctions__WEBPACK_IMPORTED_MODULE_0__.deepEqual)(nowProps, latestProps);
        }
    }
    const useTagSupport = global.newest?.tagSupport; // oldTagSetup
    if (!templater.global.oldest) {
        throw new Error('already causing trouble');
    }
    const tag = (0,_renderExistingTag_function__WEBPACK_IMPORTED_MODULE_2__.renderExistingTag)(templater.global.oldest, templater, useTagSupport, subject);
    const renderOwner = ownerTag && selfPropChange;
    if (renderOwner) {
        const ownerTagSupport = ownerTag.tagSupport;
        renderTagSupport(ownerTagSupport, true);
        return tag;
    }
    return tag;
}


/***/ }),

/***/ "./ts/scanTextAreaValue.function.ts":
/*!******************************************!*\
  !*** ./ts/scanTextAreaValue.function.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scanTextAreaValue: () => (/* binding */ scanTextAreaValue)
/* harmony export */ });
/* harmony import */ var _processAttribute_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./processAttribute.function */ "./ts/processAttribute.function.ts");

const search = new RegExp('\\s*<template interpolate end id="__tagvar(\\d{1,4})"([^>]*)></template>(\\s*)');
function scanTextAreaValue(textarea, context, ownerTag) {
    const value = textarea.value;
    if (value.search(search) >= 0) {
        const match = value.match(/__tagvar(\d{1,4})/);
        const token = match ? match[0] : '';
        const dynamic = '{' + token + '}';
        textarea.value = '';
        textarea.setAttribute('text-var-value', dynamic);
        const howToSet = (_elm, _name, value) => textarea.value = value;
        (0,_processAttribute_function__WEBPACK_IMPORTED_MODULE_0__.processAttribute)('text-var-value', dynamic, // realValue, // context[token].value,
        textarea, context, ownerTag, howToSet);
    }
}


/***/ }),

/***/ "./ts/set.function.ts":
/*!****************************!*\
  !*** ./ts/set.function.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StateEchoBack: () => (/* binding */ StateEchoBack),
/* harmony export */   getStateValue: () => (/* binding */ getStateValue),
/* harmony export */   set: () => (/* binding */ set)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "./ts/errors.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");


// TODO: rename
_setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig = {
    array: [], // state memory on the first render
    // rearray: [] as StateConfigArray, // state memory to be used before the next render
};
(0,_setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse)({
    beforeRender: (tagSupport) => initState(tagSupport),
    beforeRedraw: (tagSupport) => initState(tagSupport),
    afterRender: (tagSupport) => {
        const state = tagSupport.memory.state;
        const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig;
        const rearray = config.rearray;
        if (rearray.length) {
            if (rearray.length !== config.array.length) {
                const message = `States lengths has changed ${rearray.length} !== ${config.array.length}. Typically occurs when a function is intended to be wrapped with a tag() call`;
                const details = {
                    oldStates: config.array,
                    newStates: config.rearray,
                    component: tagSupport.templater?.wrapper.original,
                };
                const error = new _errors__WEBPACK_IMPORTED_MODULE_0__.StateMismatchError(message, details);
                console.warn(message, details);
                throw error;
            }
        }
        delete config.rearray; // clean up any previous runs
        state.newest = config.array; // [...config.array]
        state.newest.forEach(item => item.lastValue = getStateValue(item)); // set last values
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
    const state = tagSupport.memory.state;
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig;
    // TODO: This guard may no longer be needed
    if (config.rearray) {
        const message = 'last state not cleared. Possibly in the middle of rendering one component and another is trying to render';
        console.error(message, {
            config,
            component: tagSupport.templater?.wrapper.original,
            wasInMiddleOf: config.tagSupport?.templater.wrapper.original,
            state,
            expectedClearArray: config.rearray,
        });
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.StateMismatchError(message, {
            config,
            component: tagSupport.templater?.wrapper.original,
            state,
            expectedClearArray: config.rearray,
        });
    }
    // TODO: this maybe redundant and not needed
    config.rearray = []; // .length = 0
    if (state?.newest.length) {
        state.newest.map(state => getStateValue(state));
        config.rearray.push(...state.newest);
    }
    config.tagSupport = tagSupport;
}
/** Used for variables that need to remain the same variable during render passes */
function set(defaultValue) {
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig;
    let getSetMethod;
    const rearray = config.rearray;
    const restate = rearray[config.array.length];
    if (restate) {
        let oldValue = getStateValue(restate);
        getSetMethod = ((x) => [oldValue, oldValue = x]);
        const push = {
            get: () => getStateValue(push),
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
        get: () => getStateValue(push),
        callback: getSetMethod,
        lastValue: initValue,
        defaultValue: initValue,
    };
    config.array.push(push);
    return initValue;
}


/***/ }),

/***/ "./ts/setLet.function.ts":
/*!*******************************!*\
  !*** ./ts/setLet.function.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setLet: () => (/* binding */ setLet)
/* harmony export */ });
/* harmony import */ var _set_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./set.function */ "./ts/set.function.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");


/** Used for variables that need to remain the same variable during render passes */
function setLet(defaultValue) {
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig;
    const rearray = config.rearray;
    let getSetMethod;
    const restate = rearray[config.array.length];
    if (restate) {
        let oldValue = (0,_set_function__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(restate);
        getSetMethod = ((x) => [oldValue, oldValue = x]);
        const push = {
            get: () => (0,_set_function__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(push),
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
        get: () => (0,_set_function__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(push),
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

/***/ "./ts/setProp.function.ts":
/*!********************************!*\
  !*** ./ts/setProp.function.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setProp: () => (/* binding */ setProp)
/* harmony export */ });
/* harmony import */ var _set_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./set.function */ "./ts/set.function.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");


/** Used for variables that need to remain the same variable during render passes */
function setProp(getSet) {
    const config = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse.memory.stateConfig;
    const rearray = config.rearray;
    const [propValue] = getSet(undefined);
    getSet(propValue); // restore original value instead of undefined
    const restate = rearray[config.array.length];
    if (restate) {
        let watchValue = restate.watch;
        let oldValue = (0,_set_function__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(restate);
        const push = {
            get: () => (0,_set_function__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(push),
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
        get: () => (0,_set_function__WEBPACK_IMPORTED_MODULE_0__.getStateValue)(push),
        callback: getSet,
        lastValue: propValue,
        watch: propValue,
    };
    config.array.push(push);
    return propValue;
}


/***/ }),

/***/ "./ts/setUse.function.ts":
/*!*******************************!*\
  !*** ./ts/setUse.function.ts ***!
  \*******************************/
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
    methods = [];
    isSubject = true;
    subscribers = [];
    subscribeWith;
    // unsubcount = 0 // 🔬 testing
    constructor(value) {
        this.value = value;
    }
    subscribe(callback) {
        // are we within a pipe?
        const subscribeWith = this.subscribeWith;
        if (subscribeWith) {
            // are we in a pipe?
            if (this.methods.length) {
                const orgCallback = callback;
                callback = (value, subscription) => {
                    runPipedMethods(value, subscription, this.methods, lastValue => orgCallback(lastValue, subscription));
                };
            }
            return subscribeWith(callback);
        }
        this.subscribers.push(callback);
        SubjectClass.globalSubs.push(callback); // 🔬 testing
        const subscription = getSubscription(this, callback);
        return subscription;
    }
    set(value) {
        this.value = value;
        // Notify all subscribers with the new value
        this.subscribers.forEach((callback) => {
            callback.value = value;
            callback(value);
        });
    }
    next = this.set;
    toPromise() {
        return new Promise((res, rej) => {
            const subscription = this.subscribe(x => {
                subscription.unsubscribe();
                res(x);
            });
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
    const index = subscribers.indexOf(callback);
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
    return subscription;
}
function runPipedMethods(value, subscription, methods, onComplete) {
    const cloneMethods = [...methods];
    const firstMethod = cloneMethods.shift();
    const next = (newValue) => {
        if (cloneMethods.length) {
            return runPipedMethods(newValue, subscription, cloneMethods, onComplete);
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
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");
/* harmony import */ var _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TemplaterResult.class */ "./ts/TemplaterResult.class.ts");
/* harmony import */ var _bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./bindSubjectCallback.function */ "./ts/bindSubjectCallback.function.ts");
/* harmony import */ var _deepFunctions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./deepFunctions */ "./ts/deepFunctions.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");
/* harmony import */ var _alterProps_function__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./alterProps.function */ "./ts/alterProps.function.ts");
/* harmony import */ var _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./subject/ValueSubject */ "./ts/subject/ValueSubject.ts");








const tags = [];
let tagCount = 0;
/** Wraps a tag component in a state manager and always push children to last argument as an array */
// export function tag<T>(a: T): T;
function tag(tagComponent) {
    const result = (function tagWrapper(props, children) {
        const isPropTag = (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagInstance)(props) || (0,_isInstance__WEBPACK_IMPORTED_MODULE_0__.isTagArray)(props);
        if (isPropTag) {
            children = props;
            props = undefined;
        }
        const { childSubject, madeSubject } = kidsToTagArraySubject(children);
        childSubject.isChildSubject = true;
        const templater = new _TemplaterResult_class__WEBPACK_IMPORTED_MODULE_2__.TemplaterResult(props, childSubject);
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
    tagComponent.setUse = _setUse_function__WEBPACK_IMPORTED_MODULE_1__.setUse;
    tagComponent.tagIndex = tagCount++; // needed for things like HMR
}
/** creates/returns a function that when called then calls the original component function */
function getTagWrap(templater, madeSubject) {
    const innerTagWrap = function (oldTagSetup, subject) {
        const global = oldTagSetup.templater.global;
        global.newestTemplater = templater;
        ++global.renderCount;
        templater.global = global;
        const childSubject = templater.children;
        const lastArray = global.oldest?.tagSupport.templater.children.lastArray;
        if (lastArray) {
            childSubject.lastArray = lastArray;
        }
        const originalFunction = innerTagWrap.original;
        // const oldTagSetup = templater.tagSupport
        const oldest = templater.global.oldest;
        if (oldest && !oldest.hasLiveElements) {
            throw new Error('issue already 22');
        }
        let props = templater.props;
        const ownerTagSupport = oldTagSetup.ownerTagSupport;
        const oldTemplater = ownerTagSupport?.templater;
        const oldLatest = oldTemplater?.global.newest;
        const newestOwnerTemplater = oldLatest?.tagSupport.templater;
        if (oldLatest && !newestOwnerTemplater) {
            throw new Error('what to do here?');
        }
        let castedProps = (0,_alterProps_function__WEBPACK_IMPORTED_MODULE_6__.alterProps)(props, newestOwnerTemplater, oldTagSetup.ownerTagSupport);
        const clonedProps = (0,_deepFunctions__WEBPACK_IMPORTED_MODULE_4__.deepClone)(props); // castedProps
        // CALL ORIGINAL COMPONENT FUNCTION
        const tag = originalFunction(castedProps, childSubject);
        tag.version = global.renderCount;
        tag.tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_5__.TagSupport(oldTagSetup.ownerTagSupport, templater, subject);
        tag.tagSupport.propsConfig = {
            latest: props, // castedProps
            latestCloned: clonedProps,
            clonedProps: clonedProps,
            lastClonedKidValues: tag.tagSupport.propsConfig.lastClonedKidValues,
        };
        tag.tagSupport.memory = oldTagSetup.memory; // state handover
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
                        const ownerTag = tag.ownerTag;
                        (0,_bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_3__.runTagCallback)(value, // callback
                        ownerTag, this, // bindTo
                        args);
                    };
                    valuesValue.isChildOverride = true;
                });
            });
        }
        return tag;
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
/* harmony export */   applyTagUpdater: () => (/* binding */ applyTagUpdater),
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
        appElements[appElmIndex].tag.destroy();
        appElements.splice(appElmIndex, 1);
        // an element already had an app on it
        console.warn('Found and destroyed app element already rendered to element', { element });
    }
    // Create the app which returns [props, runOneTimeFunction]
    const wrapper = app(props);
    // have a function setup and call the tagWrapper with (props, {update, async, on})
    const result = applyTagUpdater(wrapper);
    const { tag } = result;
    // TODO: is the below needed?
    tag.appElement = element;
    tag.tagSupport.templater.global.isApp = true;
    const templateElm = document.createElement('template');
    templateElm.setAttribute('id', 'app-tag-' + appElements.length);
    templateElm.setAttribute('app-tag-detail', appElements.length.toString());
    element.appendChild(templateElm);
    tag.buildBeforeElement(templateElm);
    wrapper.global.oldest = tag;
    wrapper.global.newest = tag;
    if (!tag.hasLiveElements) {
        throw new Error('x');
    }
    ;
    element.setUse = app.original.setUse;
    appElements.push({ element, tag });
    return { tag, tags: app.original.tags };
}
function applyTagUpdater(wrapper) {
    const subject = new _subject_ValueSubject__WEBPACK_IMPORTED_MODULE_2__.ValueSubject({});
    const tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__.BaseTagSupport(wrapper, subject);
    wrapper.tagSupport = tagSupport;
    (0,_tagRunner__WEBPACK_IMPORTED_MODULE_1__.runBeforeRender)(tagSupport, undefined);
    // Call the apps function for our tag templater
    const tag = wrapper.wrapper(tagSupport, subject);
    // wrapper.global.oldest = tag
    // wrapper.global.newest = tag
    (0,_tagRunner__WEBPACK_IMPORTED_MODULE_1__.runAfterRender)(tagSupport, tag);
    return { tag, tagSupport };
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
/* harmony export */   runBeforeRender: () => (/* binding */ runBeforeRender)
/* harmony export */ });
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");
// TODO: This should be more like `new TaggedJs().use({})`

// Life cycle 1
function runBeforeRender(tagSupport, tagOwner) {
    _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse.forEach(tagUse => tagUse.beforeRender(tagSupport, tagOwner));
}
// Life cycle 2
function runAfterRender(tagSupport, tag) {
    _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse.forEach(tagUse => tagUse.afterRender(tagSupport, tag));
}
// Life cycle 3
function runBeforeRedraw(tagSupport, tag) {
    _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse.forEach(tagUse => tagUse.beforeRedraw(tagSupport, tag));
}
// Life cycle 4 - end of life
function runBeforeDestroy(tagSupport, tag) {
    _setUse_function__WEBPACK_IMPORTED_MODULE_0__.setUse.tagUse.forEach(tagUse => tagUse.beforeDestroy(tagSupport, tag));
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





function updateExistingTagComponent(ownerTag, templater, subject, insertBefore) {
    let existingTag = subject.tag;
    const oldWrapper = existingTag.tagSupport.templater.wrapper;
    const newWrapper = templater.wrapper;
    let isSameTag = false;
    if (oldWrapper && newWrapper) {
        const oldFunction = oldWrapper.original;
        const newFunction = newWrapper.original;
        isSameTag = oldFunction === newFunction;
    }
    const oldTagSupport = existingTag.tagSupport;
    const oldGlobal = oldTagSupport.templater.global;
    const globalInsert = oldGlobal.insertBefore;
    const oldInsertBefore = globalInsert?.parentNode ? globalInsert : insertBefore;
    // const placeholderElm = ownerTag.tagSupport.templater.global.placeholderElm
    const placeholderElm = oldGlobal.placeholderElm;
    if (placeholderElm) {
        if (!placeholderElm.parentNode) {
            throw new Error('stop here no subject parent node update existing tag');
        }
    }
    else if (!oldInsertBefore.parentNode) {
        //throw new Error('stop here no parent node update existing tag')
    }
    if (!isSameTag) {
        (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(oldTagSupport.templater.global.oldest, subject);
        return (0,_processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_1__.processSubjectComponent)(templater, subject, 
        // ??? - newly changed
        insertBefore, // oldInsertBefore,
        ownerTag, {
            forceElement: false,
            counts: { added: 0, removed: 0 },
        });
    }
    else {
        const newTagSupport = templater.tagSupport;
        const hasChanged = (0,_hasTagSupportChanged_function__WEBPACK_IMPORTED_MODULE_0__.hasTagSupportChanged)(oldTagSupport, newTagSupport, templater);
        if (!hasChanged) {
            // if the new props are an object then implicitly since no change, the old props are an object
            const newProps = templater.props;
            if (newProps && typeof (newProps) === 'object') {
                // const newestTag = oldTagSupport.templater.global.newest
                // const oldProps = existingTag.tagSupport.propsConfig.latestCloned as Record<string,any> // newestTag.props as Record<string, any>
                syncFunctionProps(templater, existingTag, ownerTag, newProps);
            }
            return existingTag; // its the same tag component
        }
    }
    const oldestTag = templater.global.oldest; // oldTagSupport.oldest as Tag // existingTag
    const previous = templater.global.newest;
    if (!previous || !oldestTag) {
        throw new Error('how no previous or oldest nor newest?');
    }
    const newTag = (0,_renderTagSupport_function__WEBPACK_IMPORTED_MODULE_3__.renderTagSupport)(templater.tagSupport, false);
    existingTag = subject.tag;
    const newOldest = newTag.tagSupport.templater.global.oldest;
    const hasOldest = newOldest ? true : false;
    if (!hasOldest) {
        return buildNewTag(newTag, 
        // ??? newly changed
        insertBefore, // oldInsertBefore,
        oldTagSupport, subject);
    }
    if (newOldest && templater.children.value.length) {
        const oldKidsSub = newOldest.tagSupport.templater.children;
        oldKidsSub.set(templater.children.value);
    }
    // const newTag = tempResult.newest as Tag
    if (previous && !oldestTag) {
        throw new Error('bad elders');
    }
    // detect if both the function is the same and the return is the same
    const isLikeTag = isSameTag && previous.isLikeTag(newTag);
    if (previous && !oldestTag) {
        throw new Error('bad elders');
    }
    let oldest = oldTagSupport.templater.global.oldest;
    if (isLikeTag) {
        if (!newTag.tagSupport.templater.global.oldest) {
            throw new Error('maybe 6');
        }
        subject.tag = newTag;
        oldestTag.updateByTag(newTag); // the oldest tag has element references
        return newTag;
    }
    else {
        // Although function looked the same it returned a different html result
        if (isSameTag && existingTag) {
            (0,_destroyTag_function__WEBPACK_IMPORTED_MODULE_2__.destroyTagMemory)(existingTag, subject);
            newTag.tagSupport.templater.global.context = {}; // do not share previous outputs
        }
        oldest = undefined;
    }
    if (!oldest) {
        buildNewTag(newTag, oldTagSupport.templater.global.insertBefore, oldTagSupport, subject);
    }
    oldTagSupport.templater.global.newest = newTag;
    return newTag;
}
function checkStateChanged(state) {
    return !state.newest.every(state => {
        const lastValue = state.lastValue;
        const nowValue = state.get();
        const matched = lastValue === nowValue;
        if (matched) {
            return true;
        }
        return false;
    });
}
function buildNewTag(newTag, oldInsertBefore, oldTagSupport, subject) {
    newTag.buildBeforeElement(oldInsertBefore, {
        forceElement: true,
        counts: { added: 0, removed: 0 },
    });
    newTag.tagSupport.templater.global.oldest = newTag;
    newTag.tagSupport.templater.global.newest = newTag;
    oldTagSupport.templater.global.oldest = newTag;
    oldTagSupport.templater.global.newest = newTag;
    subject.tag = newTag;
    return newTag;
}
function syncFunctionProps(templater, existingTag, ownerTag, newProps) {
    existingTag = existingTag.tagSupport.templater.global.newest;
    // const templater = existingTag.tagSupport.templater
    const priorProps = existingTag.tagSupport.propsConfig.latestCloned;
    const oldLatest = ownerTag.tagSupport.templater.global.newest;
    const ownerSupport = oldLatest.tagSupport;
    Object.entries(priorProps).forEach(([name, value]) => {
        if (!(value instanceof Function)) {
            return;
        }
        const newOriginal = value.original;
        // TODO: The code below maybe irrelevant
        const newCallback = newProps[name];
        const original = newCallback.original;
        if (original) {
            return; // already previously converted
        }
        // Currently, call self but over parent state changes, I may need to call a newer parent tag owner
        priorProps[name].toCall = (...args) => {
            return (0,_alterProps_function__WEBPACK_IMPORTED_MODULE_4__.callbackPropOwner)(newCallback, // value, // newOriginal,
            args, templater, ownerSupport);
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
/* harmony import */ var _isInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isInstance */ "./ts/isInstance.ts");
/* harmony import */ var _processTagArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./processTagArray */ "./ts/processTagArray.ts");
/* harmony import */ var _updateExistingTagComponent_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./updateExistingTagComponent.function */ "./ts/updateExistingTagComponent.function.ts");
/* harmony import */ var _processRegularValue_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./processRegularValue.function */ "./ts/processRegularValue.function.ts");
/* harmony import */ var _checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./checkDestroyPrevious.function */ "./ts/checkDestroyPrevious.function.ts");
/* harmony import */ var _processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./processSubjectComponent.function */ "./ts/processSubjectComponent.function.ts");
/* harmony import */ var _isLikeTags_function__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./isLikeTags.function */ "./ts/isLikeTags.function.ts");
/* harmony import */ var _bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./bindSubjectCallback.function */ "./ts/bindSubjectCallback.function.ts");
/* harmony import */ var _processTag_function__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./processTag.function */ "./ts/processTag.function.ts");
/* harmony import */ var _insertAfter_function__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./insertAfter.function */ "./ts/insertAfter.function.ts");











function updateExistingValue(subject, value, ownerTag, insertBefore) {
    const subjectTag = subject;
    const isComponent = (0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagComponent)(value);
    // const global = subjectTag.tag?.tagSupport.templater.global
    // const placeholderElm = global?.placeholderElm || global?.insertBefore || (subject as DisplaySubject).insertBefore
    // const oldInsertBefore = placeholderElm || (subject as DisplaySubject).clone
    const destroyType = (0,_checkDestroyPrevious_function__WEBPACK_IMPORTED_MODULE_5__.checkDestroyPrevious)(subject, value, insertBefore);
    // handle already seen tag components
    if (isComponent) {
        const templater = value;
        // When was something before component
        if (!subjectTag.tag) {
            const tag = (0,_processSubjectComponent_function__WEBPACK_IMPORTED_MODULE_6__.processSubjectComponent)(templater, subjectTag, insertBefore, // oldInsertBefore as InsertBefore,
            ownerTag, {
                forceElement: true,
                counts: { added: 0, removed: 0 },
            });
            return subjectTag;
        }
        // ??? - new put back down template tag before redraw
        const placeholderElm = subjectTag.tag.tagSupport.templater.global.placeholderElm;
        if (placeholderElm) {
            (0,_insertAfter_function__WEBPACK_IMPORTED_MODULE_10__.insertAfter)(insertBefore, placeholderElm);
            delete subjectTag.tag.tagSupport.templater.global.placeholderElm;
        }
        templater.tagSupport = new _TagSupport_class__WEBPACK_IMPORTED_MODULE_0__.TagSupport(
        // subjectTag.tag.tagSupport.ownerTagSupport,
        ownerTag.tagSupport, templater, subjectTag);
        const tag = (0,_updateExistingTagComponent_function__WEBPACK_IMPORTED_MODULE_3__.updateExistingTagComponent)(ownerTag, templater, // latest value
        subjectTag, insertBefore);
        if (insertBefore.parentNode) {
            tag.tagSupport.templater.global.placeholderElm = insertBefore.previousSibling;
            insertBefore.parentNode.removeChild(insertBefore);
        }
        return subjectTag;
    }
    // was component but no longer
    const tag = subjectTag.tag;
    if (tag) {
        handleStillTag(tag, subject, value, ownerTag);
        return subjectTag;
    }
    // its another tag array
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagArray)(value)) {
        (0,_processTagArray__WEBPACK_IMPORTED_MODULE_2__.processTagArray)(subject, value, insertBefore, // oldInsertBefore as InsertBefore,
        ownerTag, { counts: {
                added: 0,
                removed: 0,
            } });
        return subject;
    }
    // now its a function
    if (value instanceof Function) {
        // const newSubject = getSubjectFunction(value, ownerTag)
        const bound = (0,_bindSubjectCallback_function__WEBPACK_IMPORTED_MODULE_8__.bindSubjectCallback)(value, ownerTag);
        subject.set(bound);
        return subject;
    }
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isTagInstance)(value)) {
        if (insertBefore.tagName !== 'TEMPLATE') {
            throw new Error(`expected template - ${insertBefore.nodeName}`);
        }
        (0,_processTag_function__WEBPACK_IMPORTED_MODULE_9__.processTag)(value, subjectTag, insertBefore, ownerTag);
        return subjectTag;
    }
    // we have been given a subject
    if ((0,_isInstance__WEBPACK_IMPORTED_MODULE_1__.isSubjectInstance)(value)) {
        return value;
    }
    // This will cause all other values to render
    (0,_processRegularValue_function__WEBPACK_IMPORTED_MODULE_4__.processRegularValue)(value, subject, 
    // ??? - changed to insertBefore for tag switching with template removal
    insertBefore // oldInsertBefore as InsertBefore,
    );
    return subjectTag;
}
function handleStillTag(existingTag, subject, value, ownerTag) {
    // TODO: We shouldn't need both of these
    const isSameTag = value && (0,_isLikeTags_function__WEBPACK_IMPORTED_MODULE_7__.isLikeTags)(existingTag, value);
    const isSameTag2 = value && value.getTemplate && existingTag.isLikeTag(value);
    const tag = value;
    if (!tag.tagSupport) {
        (0,_processTag_function__WEBPACK_IMPORTED_MODULE_9__.applyFakeTemplater)(tag, ownerTag, subject);
    }
    if (isSameTag) {
        existingTag.updateByTag(tag);
        return;
    }
    if (isSameTag || isSameTag2) {
        const subjectTag = subject;
        const global = existingTag.tagSupport.templater.global;
        delete global.placeholderElm;
        const insertBefore = global.insertBefore;
        return (0,_processTag_function__WEBPACK_IMPORTED_MODULE_9__.processTag)(value, subjectTag, insertBefore, ownerTag);
    }
    return (0,_processRegularValue_function__WEBPACK_IMPORTED_MODULE_4__.processRegularValue)(value, subject, subject.insertBefore);
}


/***/ }),

/***/ "./ts/watch.function.ts":
/*!******************************!*\
  !*** ./ts/watch.function.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   watch: () => (/* binding */ watch)
/* harmony export */ });
/* harmony import */ var _setLet_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setLet.function */ "./ts/setLet.function.ts");

/** When an item in watch array changes, callback function will be triggered */
function watch(currentValues, callback) {
    let previousValues = (0,_setLet_function__WEBPACK_IMPORTED_MODULE_0__.setLet)(undefined)(x => [previousValues, previousValues = x]);
    if (previousValues === undefined) {
        callback(currentValues, previousValues);
        // const result = {currentValues, previousValues}
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
/* harmony export */   Tag: () => (/* reexport safe */ _Tag_class__WEBPACK_IMPORTED_MODULE_10__.Tag),
/* harmony export */   TagError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_4__.TagError),
/* harmony export */   TagSupport: () => (/* reexport safe */ _TagSupport_class__WEBPACK_IMPORTED_MODULE_8__.TagSupport),
/* harmony export */   ValueSubject: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.ValueSubject),
/* harmony export */   combineLatest: () => (/* reexport safe */ _subject_index__WEBPACK_IMPORTED_MODULE_5__.combineLatest),
/* harmony export */   getCallback: () => (/* reexport safe */ _getCallback__WEBPACK_IMPORTED_MODULE_19__.getCallback),
/* harmony export */   hmr: () => (/* binding */ hmr),
/* harmony export */   html: () => (/* reexport safe */ _html__WEBPACK_IMPORTED_MODULE_3__.html),
/* harmony export */   interpolateElement: () => (/* reexport safe */ _interpolateElement__WEBPACK_IMPORTED_MODULE_9__.interpolateElement),
/* harmony export */   interpolateString: () => (/* reexport safe */ _interpolateElement__WEBPACK_IMPORTED_MODULE_9__.interpolateString),
/* harmony export */   isSubjectInstance: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_6__.isSubjectInstance),
/* harmony export */   isTagArray: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_6__.isTagArray),
/* harmony export */   isTagComponent: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_6__.isTagComponent),
/* harmony export */   isTagInstance: () => (/* reexport safe */ _isInstance__WEBPACK_IMPORTED_MODULE_6__.isTagInstance),
/* harmony export */   onDestroy: () => (/* reexport safe */ _onDestroy__WEBPACK_IMPORTED_MODULE_18__.onDestroy),
/* harmony export */   onInit: () => (/* reexport safe */ _onInit__WEBPACK_IMPORTED_MODULE_17__.onInit),
/* harmony export */   providers: () => (/* reexport safe */ _providers__WEBPACK_IMPORTED_MODULE_13__.providers),
/* harmony export */   runBeforeRender: () => (/* reexport safe */ _tagRunner__WEBPACK_IMPORTED_MODULE_11__.runBeforeRender),
/* harmony export */   set: () => (/* reexport safe */ _set_function__WEBPACK_IMPORTED_MODULE_14__.set),
/* harmony export */   setLet: () => (/* reexport safe */ _setLet_function__WEBPACK_IMPORTED_MODULE_15__.setLet),
/* harmony export */   setProp: () => (/* reexport safe */ _setProp_function__WEBPACK_IMPORTED_MODULE_16__.setProp),
/* harmony export */   setUse: () => (/* reexport safe */ _setUse_function__WEBPACK_IMPORTED_MODULE_12__.setUse),
/* harmony export */   tag: () => (/* reexport safe */ _tag__WEBPACK_IMPORTED_MODULE_2__.tag),
/* harmony export */   tagElement: () => (/* reexport safe */ _tagElement__WEBPACK_IMPORTED_MODULE_0__.tagElement),
/* harmony export */   tags: () => (/* reexport safe */ _tag__WEBPACK_IMPORTED_MODULE_2__.tags),
/* harmony export */   watch: () => (/* reexport safe */ _watch_function__WEBPACK_IMPORTED_MODULE_7__.watch),
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
/* harmony import */ var _watch_function__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./watch.function */ "./ts/watch.function.ts");
/* harmony import */ var _TagSupport_class__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./TagSupport.class */ "./ts/TagSupport.class.ts");
/* harmony import */ var _interpolateElement__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./interpolateElement */ "./ts/interpolateElement.ts");
/* harmony import */ var _Tag_class__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Tag.class */ "./ts/Tag.class.ts");
/* harmony import */ var _tagRunner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./tagRunner */ "./ts/tagRunner.ts");
/* harmony import */ var _setUse_function__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./setUse.function */ "./ts/setUse.function.ts");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./providers */ "./ts/providers.ts");
/* harmony import */ var _set_function__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./set.function */ "./ts/set.function.ts");
/* harmony import */ var _setLet_function__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./setLet.function */ "./ts/setLet.function.ts");
/* harmony import */ var _setProp_function__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./setProp.function */ "./ts/setProp.function.ts");
/* harmony import */ var _onInit__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./onInit */ "./ts/onInit.ts");
/* harmony import */ var _onDestroy__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./onDestroy */ "./ts/onDestroy.ts");
/* harmony import */ var _getCallback__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./getCallback */ "./ts/getCallback.ts");
// import { redrawTag } from "./redrawTag.function"









// export * from "./redrawTag.function"

// TODO: export *




/* hooks */
// TODO: export *







/* end: hooks */
const hmr = {
    tagElement: _tagElement__WEBPACK_IMPORTED_MODULE_0__.tagElement,
    // redrawTag
};

})();

var __webpack_exports__ArrayNoKeyError = __webpack_exports__.ArrayNoKeyError;
var __webpack_exports__BaseTagSupport = __webpack_exports__.BaseTagSupport;
var __webpack_exports__StateMismatchError = __webpack_exports__.StateMismatchError;
var __webpack_exports__Subject = __webpack_exports__.Subject;
var __webpack_exports__Tag = __webpack_exports__.Tag;
var __webpack_exports__TagError = __webpack_exports__.TagError;
var __webpack_exports__TagSupport = __webpack_exports__.TagSupport;
var __webpack_exports__ValueSubject = __webpack_exports__.ValueSubject;
var __webpack_exports__combineLatest = __webpack_exports__.combineLatest;
var __webpack_exports__getCallback = __webpack_exports__.getCallback;
var __webpack_exports__hmr = __webpack_exports__.hmr;
var __webpack_exports__html = __webpack_exports__.html;
var __webpack_exports__interpolateElement = __webpack_exports__.interpolateElement;
var __webpack_exports__interpolateString = __webpack_exports__.interpolateString;
var __webpack_exports__isSubjectInstance = __webpack_exports__.isSubjectInstance;
var __webpack_exports__isTagArray = __webpack_exports__.isTagArray;
var __webpack_exports__isTagComponent = __webpack_exports__.isTagComponent;
var __webpack_exports__isTagInstance = __webpack_exports__.isTagInstance;
var __webpack_exports__onDestroy = __webpack_exports__.onDestroy;
var __webpack_exports__onInit = __webpack_exports__.onInit;
var __webpack_exports__providers = __webpack_exports__.providers;
var __webpack_exports__runBeforeRender = __webpack_exports__.runBeforeRender;
var __webpack_exports__set = __webpack_exports__.set;
var __webpack_exports__setLet = __webpack_exports__.setLet;
var __webpack_exports__setProp = __webpack_exports__.setProp;
var __webpack_exports__setUse = __webpack_exports__.setUse;
var __webpack_exports__tag = __webpack_exports__.tag;
var __webpack_exports__tagElement = __webpack_exports__.tagElement;
var __webpack_exports__tags = __webpack_exports__.tags;
var __webpack_exports__watch = __webpack_exports__.watch;
var __webpack_exports__willCallback = __webpack_exports__.willCallback;
var __webpack_exports__willPromise = __webpack_exports__.willPromise;
var __webpack_exports__willSubscribe = __webpack_exports__.willSubscribe;
export { __webpack_exports__ArrayNoKeyError as ArrayNoKeyError, __webpack_exports__BaseTagSupport as BaseTagSupport, __webpack_exports__StateMismatchError as StateMismatchError, __webpack_exports__Subject as Subject, __webpack_exports__Tag as Tag, __webpack_exports__TagError as TagError, __webpack_exports__TagSupport as TagSupport, __webpack_exports__ValueSubject as ValueSubject, __webpack_exports__combineLatest as combineLatest, __webpack_exports__getCallback as getCallback, __webpack_exports__hmr as hmr, __webpack_exports__html as html, __webpack_exports__interpolateElement as interpolateElement, __webpack_exports__interpolateString as interpolateString, __webpack_exports__isSubjectInstance as isSubjectInstance, __webpack_exports__isTagArray as isTagArray, __webpack_exports__isTagComponent as isTagComponent, __webpack_exports__isTagInstance as isTagInstance, __webpack_exports__onDestroy as onDestroy, __webpack_exports__onInit as onInit, __webpack_exports__providers as providers, __webpack_exports__runBeforeRender as runBeforeRender, __webpack_exports__set as set, __webpack_exports__setLet as setLet, __webpack_exports__setProp as setProp, __webpack_exports__setUse as setUse, __webpack_exports__tag as tag, __webpack_exports__tagElement as tagElement, __webpack_exports__tags as tags, __webpack_exports__watch as watch, __webpack_exports__willCallback as willCallback, __webpack_exports__willPromise as willPromise, __webpack_exports__willSubscribe as willSubscribe };

//# sourceMappingURL=bundle.js.map