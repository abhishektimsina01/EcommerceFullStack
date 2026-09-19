"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const fs_1 = __importDefault(require("fs"));
const cloudinary_config_1 = require("../config/cloudinary.config");
const uploader = async (path) => {
    const cloud_data = await cloudinary_config_1.cloudinary.uploader.upload(path);
    fs_1.default.unlink(path, (err) => {
        if (err) {
            throw err;
        }
        console.log("file was ");
    });
    return cloud_data;
};
exports.uploader = uploader;
