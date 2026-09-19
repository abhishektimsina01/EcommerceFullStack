"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.deleteProduct = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
const products_service_1 = require("../service/products.service");
const response_utils_1 = require("../utils/response.utils");
const product_validation_1 = require("../validation/product.validation");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const checkKeyAndRetrieveValue_1 = require("../utils/checkKeyAndRetrieveValue");
const filters_constant_1 = require("../constant/filters.constant");
const enums_1 = require("../enum/enums");
const typeorm_1 = require("typeorm");
const productService = new products_service_1.ProductService();
const createProduct = async (req, res, next) => {
    try {
        const { error } = product_validation_1.productItemSchema.validate(req.body);
        if (error) {
            throw new custom_exceptions_1.ValidationError(error);
        }
        const path = req.file?.path ?? null;
        const response = await productService.createProduct(req.user, req.body, path);
        return (0, response_utils_1.sendAPIResponse)(res, "product added", 200, response);
    }
    catch (err) {
        if (err instanceof typeorm_1.QueryFailedError) {
            throw new custom_exceptions_1.QueryError(err);
        }
        next(err);
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res, next) => {
    try {
        const filters = req.query;
        const purifiedFilter = (0, checkKeyAndRetrieveValue_1.extractKeysFromObj)(filters, filters_constant_1.ProductFilterConstant[enums_1.ROLES.CUSTOMER]);
        const response = await productService.getAllProducts(req.user, purifiedFilter);
        return (0, response_utils_1.sendAPIResponse)(res, "products fetched", 200, response);
    }
    catch (err) {
        next(err);
    }
};
exports.getProducts = getProducts;
const getProduct = async (req, res, next) => {
    try {
        const user = req.user ?? { id: 0, username: "guest", role: enums_1.ROLES.CUSTOMER };
        const response = await productService.getProductService(user, +req.params.id);
        return (0, response_utils_1.sendAPIResponse)(res, "product fetched", 200, {
            ...response
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getProduct = getProduct;
const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.user, +req.params.id);
        return (0, response_utils_1.sendAPIResponse)(res, "removed the product", 200);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteProduct = deleteProduct;
const updateProduct = async (req, res, next) => {
    try {
        const { error } = product_validation_1.productItemSchemaUpdate.validate(req.body);
        if (error) {
            throw new custom_exceptions_1.ValidationError(error);
        }
        const response = await productService.updateProduct(req.user, +req.params.id, req.body);
        return (0, response_utils_1.sendAPIResponse)(res, "product changed", 200, response);
    }
    catch (err) {
        next(err);
    }
};
exports.updateProduct = updateProduct;
