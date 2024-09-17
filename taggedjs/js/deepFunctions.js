import { isArray, isFunction } from './isInstance.js';
import { BasicTypes } from './tag/ValueTypes.enum.js';
export function deepClone(obj, maxDepth) {
    // return makeDeepClone(obj, new WeakMap())
    return makeDeepClone(obj, maxDepth);
}
function makeDeepClone(obj, 
// visited: WeakMap<any, any>
maxDepth) {
    // If obj is a primitive type or null, return it directly
    if (obj === null || typeof obj !== BasicTypes.object) {
        return obj;
    }
    // If obj is already visited, return the cloned reference
    /*
    if (visited.has(obj)) {
      return visited.get(obj)
    }
    */
    if (maxDepth < 0) {
        return obj;
    }
    // Handle special cases like Date and RegExp
    if (obj instanceof Date) {
        return new Date(obj);
    }
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }
    // Create an empty object or array with the same prototype
    const clone = isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
    // Clone each property or element of the object or array
    if (isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            clone[i] = makeDeepClone(obj[i], maxDepth - 1);
        }
    }
    else {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = makeDeepClone(obj[key], maxDepth - 1);
            }
        }
    }
    return clone;
}
export function deepEqual(obj1, obj2, maxDepth) {
    return isDeepEqual(obj1, obj2, maxDepth);
}
function isDeepEqual(obj1, obj2, 
// visited: WeakMap<any, any>,
maxDepth) {
    const directEqual = obj1 === obj2;
    if (directEqual || isSameFunctions(obj1, obj2)) {
        return true;
    }
    // If obj is already visited, return the cloned reference
    // if (visited.has(obj1)) {
    if (maxDepth < 0) {
        return true;
    }
    if (typeof obj1 === BasicTypes.object && typeof obj2 === BasicTypes.object) {
        // both are dates and were already determined not the same
        if (obj1 instanceof Date && obj2 instanceof Date) {
            return obj1.getTime() === obj2.getTime();
        }
        // Register the cloned object to avoid cyclic references
        // visited.set(obj1, 0)
        // Check if obj1 and obj2 are both arrays
        if (isArray(obj1) && isArray(obj2)) {
            return isArrayDeepEqual(obj1, obj2, maxDepth - 1);
        }
        else if (isArray(obj1) || isArray(obj2)) {
            // One is an array, and the other is not
            return false;
        }
        // return isObjectDeepEqual(obj1, obj2, visited)
        return isObjectDeepEqual(obj1, obj2, maxDepth - 1);
    }
    return false;
}
function isObjectDeepEqual(obj1, obj2, 
// visited: WeakMap<any, any>,
maxDepth) {
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
        if (!keyFound || !isDeepEqual(obj1[key], obj2[key], maxDepth - 1)) {
            return false;
        }
    }
    return true;
}
function isArrayDeepEqual(obj1, obj2, maxDepth) {
    if (obj1.length !== obj2.length) {
        return false;
    }
    for (let i = 0; i < obj1.length; i++) {
        if (!isDeepEqual(obj1[i], obj2[i], maxDepth - 1)) {
            return false;
        }
    }
    return true;
}
function isSameFunctions(fn0, fn1) {
    const bothFunction = isFunction(fn0) && isFunction(fn1);
    return bothFunction && fn0.toString() === fn1.toString();
}
//# sourceMappingURL=deepFunctions.js.map