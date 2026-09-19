"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const product_entity_1 = require("../database/Entity/product.entity");
const connect_db_1 = require("../database/connect.db");
const enums_1 = require("../enum/enums");
class ProductRepository {
    productRepo;
    constructor() {
        this.productRepo = connect_db_1.appDataSource.getRepository(product_entity_1.Product);
    }
    checkProductItem = async (product_id) => {
        return await this.productRepo.exists({
            where: {
                product_id: product_id
            }
        });
    };
    findProductItem = async (key, value, role) => {
        return await this.productRepo.findOne({
            where: {
                [`${key}`]: value
            },
            select: {
                product_id: true,
                price: true,
                stock: true,
                product_image: true,
                product_name: true,
                product_type: true,
                description: true
            },
        });
    };
    createProduct = async (productData) => {
        const product = this.productRepo.create({
            ...productData,
        });
        return await this.productRepo.save(product);
    };
    findAllProducts = async (userData, where = {}) => {
        return this.productRepo.find({
            where: {
                ...where,
            },
            select: {
                product_id: true,
                product_name: true,
                product_type: true,
                product_image: true,
                price: true
            }
        });
    };
    deleteProduct = async (productId) => {
        const product = await this.productRepo.findOne({
            where: {
                product_id: productId
            }
        });
        await this.productRepo.remove(product);
    };
    deleteAllProducts = async () => {
        const products = await this.productRepo.find();
        await this.productRepo.remove(products);
    };
    updateProduct = async (productId, productData) => {
        await this.productRepo.update({
            product_id: productId
        }, {
            ...productData
        });
        const product = await this.findProductItem("product_id", productId, enums_1.ROLES.ADMIN);
        return product;
    };
}
exports.ProductRepository = ProductRepository;
