"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopCart = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const browser_1 = require("typeorm/browser");
const shop_cart_item_entity_1 = require("./shop_cart_item.entity");
let ShopCart = class ShopCart {
    cart_id;
    customer;
    items;
};
exports.ShopCart = ShopCart;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int" }),
    __metadata("design:type", Number)
], ShopCart.prototype, "cart_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => customer_entity_1.Customer, (customer) => customer.cart, { onDelete: "CASCADE" }),
    (0, browser_1.JoinColumn)({ name: "customer_id" }),
    __metadata("design:type", customer_entity_1.Customer)
], ShopCart.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shop_cart_item_entity_1.ShopCartItem, (cart) => cart.cart),
    __metadata("design:type", Array)
], ShopCart.prototype, "items", void 0);
exports.ShopCart = ShopCart = __decorate([
    (0, typeorm_1.Entity)()
], ShopCart);
