"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const key_value_store_1 = require("./Service/key-value-store");
const routes_1 = __importDefault(require("./Routes/routes"));
const app = (0, express_1.default)();
app.set('KeyValueStore', new key_value_store_1.KeyValueStore);
app.use(express_1.default.json());
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});
app.use('/', routes_1.default);
exports.default = app;
