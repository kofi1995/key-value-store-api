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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./../src/app"));
const supertest_1 = __importDefault(require("supertest"));
beforeEach(() => {
    const store = app_1.default.get('KeyValueStore');
    store.reset();
});
describe("GET /store/:key", () => {
    it("should return a key value pair response", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        store.add('key1', '12345');
        const res = yield (0, supertest_1.default)(app_1.default).get("/store/key1");
        expect(res.statusCode).toBe(200);
        expect(res.body.key).toBe("key1");
        expect(res.body.value).toBe("12345");
    }));
    it("should return 404 if key does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/store/key1");
        expect(res.statusCode).toBe(404);
    }));
    it("should return 404 if key has expired", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        store.add('key1', '12345', 30);
        // change now to 31 seconds in the future, key should be expired by then
        jest.useFakeTimers({
            now: new Date().getTime() + (31 * 1000),
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/store/key1");
        expect(res.statusCode).toBe(404);
        jest.useRealTimers();
    }));
    it("should store data with string key and string value", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        const res = yield (0, supertest_1.default)(app_1.default).post("/store").send({ key: 'key1', value: '123456' });
        expect(res.statusCode).toBe(201);
        expect(store.get('key1')).toBe('123456');
    }));
    it("should store data with string key and number value", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        const res = yield (0, supertest_1.default)(app_1.default).post("/store").send({ key: 'key1', value: 123456.8 });
        expect(res.statusCode).toBe(201);
        expect(store.get('key1')).toBe(123456.8);
    }));
    it("should store data with string key and boolean value", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        const res = yield (0, supertest_1.default)(app_1.default).post("/store").send({ key: 'key1', value: true });
        expect(res.statusCode).toBe(201);
        expect(store.get('key1')).toBe(true);
    }));
    it("should store data with expiry", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        const res = yield (0, supertest_1.default)(app_1.default).post("/store").send({ key: 'key1', value: '123456', ttl: 30 });
        expect(res.statusCode).toBe(201);
        // change now to 31 seconds in the future, key should be expired by then
        jest.useFakeTimers({
            now: new Date().getTime() + (31 * 1000),
        });
        expect(store.get('key1')).toBe(null);
        jest.useRealTimers();
    }));
    it("should not store data if key is an integer", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        const res = yield (0, supertest_1.default)(app_1.default).post("/store").send({ key: 12345, value: '123456' });
        expect(res.statusCode).toBe(422);
        expect(store.get('key1')).toBe(null);
    }));
    it("should not store data if key is an object", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        const res = yield (0, supertest_1.default)(app_1.default).post("/store").send({ key: { 'object': 'object' }, value: '123456' });
        expect(res.statusCode).toBe(422);
        expect(store.get('key1')).toBe(null);
    }));
    it("should not store data if value is an object", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        const res = yield (0, supertest_1.default)(app_1.default).post("/store").send({ key: 'key1', value: { 'object': 'object' } });
        expect(res.statusCode).toBe(422);
        expect(store.get('key1')).toBe(null);
    }));
    it("should not store data if ttl is a string", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        const res = yield (0, supertest_1.default)(app_1.default).post("/store").send({ key: 'key1', value: '12345', ttl: '300' });
        expect(res.statusCode).toBe(422);
        expect(store.get('key1')).toBe(null);
    }));
    it("should not store data if ttl is a float", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        const res = yield (0, supertest_1.default)(app_1.default).post("/store").send({ key: 'key1', value: '12345', ttl: 300.25 });
        expect(res.statusCode).toBe(422);
        expect(store.get('key1')).toBe(null);
    }));
    it("should not store data if body is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        const res = yield (0, supertest_1.default)(app_1.default).post("/store");
        expect(res.statusCode).toBe(422);
        expect(store.get('key1')).toBe(null);
    }));
    it("should return 409 conflict if key already exists, and not overwrite", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        store.add('key1', '12345');
        const res = yield (0, supertest_1.default)(app_1.default).post("/store").send({ key: 'key1', value: '123456' });
        expect(res.statusCode).toBe(409);
        expect(store.get('key1')).toBe('12345');
    }));
    it("should delete key if it exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        store.add('key1', '12345');
        const res = yield (0, supertest_1.default)(app_1.default).delete("/store/key1");
        expect(res.statusCode).toBe(200);
        expect(store.get('key1')).toBe(null);
    }));
    it("should return 404 if key does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete("/store/key1");
        expect(res.statusCode).toBe(404);
    }));
    it("should return 404 if key exists but has expired", () => __awaiter(void 0, void 0, void 0, function* () {
        const store = app_1.default.get('KeyValueStore');
        store.add('key1', '12345', 30);
        // change now to 31 seconds in the future, key should be expired by then
        jest.useFakeTimers({
            now: new Date().getTime() + (31 * 1000),
        });
        const res = yield (0, supertest_1.default)(app_1.default).delete("/store/key1");
        expect(res.statusCode).toBe(404);
    }));
});
