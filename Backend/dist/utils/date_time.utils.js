"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTimeFromString = exports.extractTimeFromDate = void 0;
const extractTimeFromDate = (date) => {
    const time = {
        date: date.getDate(),
        day: date.getDay(),
        month: date.getMonth(),
        hours: date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    };
    return time;
};
exports.extractTimeFromDate = extractTimeFromDate;
const extractTimeFromString = (date) => {
    const [hours, minutes] = date.split(":");
    return { hours: parseInt(hours), minutes: parseInt(minutes) };
};
exports.extractTimeFromString = extractTimeFromString;
