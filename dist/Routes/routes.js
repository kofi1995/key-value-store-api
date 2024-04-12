"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_controller_1 = require("../Controller/store-controller");
const router = (0, express_1.Router)();
router.get('/store/:key', store_controller_1.StoreController.get);
router.post('/store', store_controller_1.StoreController.add);
router.delete('/store/:key', store_controller_1.StoreController.delete);
exports.default = router;
