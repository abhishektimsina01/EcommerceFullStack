"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractKeysFromObj = exports.checkKeyAndValue = void 0;
const checkKeyAndValue = (obj, key) => {
    if (Object.hasOwn(obj, key)) {
        return obj[key];
    }
};
exports.checkKeyAndValue = checkKeyAndValue;
const extractKeysFromObj = (obj, keys) => {
    let newObj = {};
    if (Object.keys(obj).length != 0) {
        if (Array.isArray(keys)) {
            if (keys.length > 0) {
                for (let key of keys) {
                    if (obj[key] != undefined) {
                        newObj[key] = obj[key];
                    }
                }
                return newObj;
            }
            return newObj;
        }
        else {
            if (obj[keys] != undefined) {
                newObj[keys] = obj[keys];
            }
            return newObj;
        }
    }
    else {
        return newObj;
    }
};
exports.extractKeysFromObj = extractKeysFromObj;
