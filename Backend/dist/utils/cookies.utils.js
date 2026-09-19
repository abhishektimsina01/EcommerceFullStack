"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = void 0;
const setCookies = (res, key, value) => {
    res.cookie(key, value, {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true
    });
};
exports.setCookies = setCookies;
