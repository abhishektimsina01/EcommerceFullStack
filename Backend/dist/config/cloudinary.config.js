"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const getEnvPropery_utils_1 = require("../utils/getEnvPropery.utils");
cloudinary_1.v2.config({
    cloud_name: (0, getEnvPropery_utils_1.getEnvProperty)("CLOUDINARY_CLOUD_NAME"),
    api_key: (0, getEnvPropery_utils_1.getEnvProperty)("CLOUDINARY_API_KEY"),
    api_secret: (0, getEnvPropery_utils_1.getEnvProperty)("CLOUDINARY_API_SECRET")
});
