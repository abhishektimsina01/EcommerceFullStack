"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../enum/enums");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const role_helper_1 = require("../helper/role.helper");
const product_repository_1 = require("../repository/product.repository");
const checkKeyAndRetrieveValue_1 = require("../utils/checkKeyAndRetrieveValue");
``;
const admin_repository_1 = require("../repository/admin.repository");
class ProductService {
    productRepo;
    adminRepo;
    roleHelper;
    constructor() {
        this.productRepo = new product_repository_1.ProductRepository();
        this.roleHelper = new role_helper_1.RoleHelper();
        this.adminRepo = new admin_repository_1.AdminRepository();
    }
    getProductService = async (userData, productId) => {
        const role = userData.role;
        const isProduct = await this.productRepo.checkProductItem(productId);
        if (!isProduct) {
            const err = new custom_exceptions_1.APIError("product couldnot be found", 404);
            throw err;
        }
        else {
            const product = await this.productRepo.findProductItem("product_id", productId, role);
            return product;
        }
    };
    createProduct = async (userData, productData, path = null) => {
        if (path) {
            // const cloud_path : UploadApiResponse = await uploader(path)
            // productData.product_image = cloud_path.secure_url
            productData.product_image = path ?? "image";
        }
        const productItem = await this.productRepo.createProduct(productData);
        return productItem;
    };
    getAllProducts = async (userData, filters) => {
        let where = {};
        const { product_type, max, min, stock } = filters;
        if (product_type != undefined && Object.values(enums_1.ITEM_CATEGORY).includes(product_type)) {
            where.product_type = product_type;
        }
        if (max != undefined && min != undefined) {
            where.price = (0, typeorm_1.Between)(min, max);
        }
        else if (min != undefined) {
            where.price = (0, typeorm_1.MoreThan)(min);
        }
        else if (max != undefined) {
            where.price = (0, typeorm_1.LessThan)(max);
        }
        else {
        }
        if (stock != undefined) {
            where.stock = (0, typeorm_1.LessThanOrEqual)(stock);
        }
        const products = await this.productRepo.findAllProducts(userData, where);
        return products;
    };
    deleteProduct = async (userData, productId) => {
        const product = await this.productRepo.checkProductItem(productId);
        if (!product) {
            const error = new custom_exceptions_1.APIError("not found", 404);
            error.name = "NOT_FOUND";
            throw error;
        }
        await this.productRepo.deleteProduct(productId);
    };
    updateProduct = async (userData, productId, productData) => {
        const product = await this.productRepo.checkProductItem(productId);
        if (!product) {
            const error = new custom_exceptions_1.APIError("not found", 404);
            error.name = "NOT_FOUND";
            throw error;
        }
        const updatePayload = (0, checkKeyAndRetrieveValue_1.extractKeysFromObj)(productData, ["product_name", "product_type", "description", "price", "stock"]);
        const updatedProducts = await this.productRepo.updateProduct(productId, updatePayload);
        return updatedProducts;
    };
}
exports.ProductService = ProductService;
