"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROVIDER_STATUS = exports.ITEM_CATEGORY = exports.PAYMENT_STATUS = exports.ORDER_STATUS = exports.ROLES = void 0;
var ROLES;
(function (ROLES) {
    ROLES["CUSTOMER"] = "customer";
    ROLES["ADMIN"] = "admin";
})(ROLES || (exports.ROLES = ROLES = {}));
var ORDER_STATUS;
(function (ORDER_STATUS) {
    ORDER_STATUS["PENDING"] = "pending";
    ORDER_STATUS["CONFIRMED"] = "confirmed";
    ORDER_STATUS["PROCESSING"] = "processing";
    ORDER_STATUS["DELIVERED"] = "delivered";
    ORDER_STATUS["CANCELED"] = "canceled";
})(ORDER_STATUS || (exports.ORDER_STATUS = ORDER_STATUS = {}));
var PAYMENT_STATUS;
(function (PAYMENT_STATUS) {
    PAYMENT_STATUS["PENDING"] = "pending";
    PAYMENT_STATUS["PAID"] = "paid";
})(PAYMENT_STATUS || (exports.PAYMENT_STATUS = PAYMENT_STATUS = {}));
var ITEM_CATEGORY;
(function (ITEM_CATEGORY) {
    ITEM_CATEGORY["ELECTRONICS"] = "electronics";
    ITEM_CATEGORY["CLOTHING"] = "clothing";
    ITEM_CATEGORY["FOOTWEAR"] = "footwear";
    ITEM_CATEGORY["BOOKS"] = "books";
    ITEM_CATEGORY["BEAUTY"] = "beauty";
    ITEM_CATEGORY["HOME"] = "home";
    ITEM_CATEGORY["SPORTS"] = "sports";
    ITEM_CATEGORY["TOYS"] = "toys";
    ITEM_CATEGORY["GROCERIES"] = "groceries";
    ITEM_CATEGORY["ACCESSORIES"] = "accessories";
    ITEM_CATEGORY["OTHER"] = "other";
})(ITEM_CATEGORY || (exports.ITEM_CATEGORY = ITEM_CATEGORY = {}));
var PROVIDER_STATUS;
(function (PROVIDER_STATUS) {
    PROVIDER_STATUS["ACTIVE"] = "active";
    PROVIDER_STATUS["INACTIVE"] = "inactive";
})(PROVIDER_STATUS || (exports.PROVIDER_STATUS = PROVIDER_STATUS = {}));
