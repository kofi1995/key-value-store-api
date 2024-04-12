"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreController = void 0;
class StoreController {
}
exports.StoreController = StoreController;
_a = StoreController;
StoreController.get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const keyValueStore = req.app.get('KeyValueStore');
    const value = keyValueStore.get(req.params.key);
    if (value === null) {
        res.status(404).json(req.params.key + ' not found');
        return;
    }
    res.json({ key: req.params.key, value: value });
});
StoreController.add = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (data.key === undefined ||
        data.value === undefined ||
        typeof data.key !== 'string' ||
        (typeof data.value !== 'string' && typeof data.value !== 'number' && typeof data.value !== 'boolean') ||
        (data.ttl !== undefined && (typeof data.ttl !== 'number' || !Number.isInteger(data.ttl)))) {
        res.status(422).json('Validation failed');
        return;
    }
    const keyValueStore = req.app.get('KeyValueStore');
    const result = keyValueStore.add(data.key, data.value, data.ttl || null);
    if (!result) {
        // Conflict, key already exists
        res.status(409).json(data.key + ' already exists in store');
        return;
    }
    res.status(201).json('');
});
StoreController.delete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const keyValueStore = req.app.get('KeyValueStore');
    const result = keyValueStore.delete(req.params.key);
    if (!result) {
        res.status(404).json('Key not found.');
        return;
    }
    res.json('deleted');
});
