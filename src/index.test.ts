import app from './../src/app';
import request from 'supertest';

beforeEach(() => {
    const store = app.get('KeyValueStore');
    store.reset();
});

describe("GET /store/:key", () => {
    it("should return a key value pair response", async () => {
        const store = app.get('KeyValueStore');
        store.add('key1', '12345')
        const res = await request(app).get(
            "/store/key1"
        );
        expect(res.statusCode).toBe(200);
        expect(res.body.key).toBe("key1");
        expect(res.body.value).toBe("12345");
    });

    it("should return 404 if key does not exist", async () => {
        const res = await request(app).get(
            "/store/key1"
        );
        expect(res.statusCode).toBe(404);
    });

    it("should return 404 if key has expired", async () => {
        const store = app.get('KeyValueStore');
        store.add('key1', '12345', 30);

        // change now to 31 seconds in the future, key should be expired by then
        jest.useFakeTimers({
            now: new Date().getTime() + (31 * 1000),
        });

        const res = await request(app).get(
            "/store/key1"
        );
        expect(res.statusCode).toBe(404);

        jest.useRealTimers();
    });

    it("should store data with string key and string value", async () => {
        const store = app.get('KeyValueStore');
        const res = await request(app).post(
            "/store"
        ).send({key: 'key1', value: '123456'});
        expect(res.statusCode).toBe(201);
        expect(store.get('key1')).toBe('123456');
    });

    it("should store data with string key and number value", async () => {
        const store = app.get('KeyValueStore');
        const res = await request(app).post(
            "/store"
        ).send({key: 'key1', value: 123456.8});
        expect(res.statusCode).toBe(201);
        expect(store.get('key1')).toBe(123456.8);
    });

    it("should store data with string key and boolean value", async () => {
        const store = app.get('KeyValueStore');
        const res = await request(app).post(
            "/store"
        ).send({key: 'key1', value: true});
        expect(res.statusCode).toBe(201);
        expect(store.get('key1')).toBe(true);
    });

    it("should store data with expiry", async () => {
        const store = app.get('KeyValueStore');
        const res = await request(app).post(
            "/store"
        ).send({key: 'key1', value: '123456', ttl: 30});
        expect(res.statusCode).toBe(201);
        // change now to 31 seconds in the future, key should be expired by then
        jest.useFakeTimers({
            now: new Date().getTime() + (31 * 1000),
        });

        expect(store.get('key1')).toBe(null);

        jest.useRealTimers();
    });

    it("should not store data if key is an integer", async () => {
        const store = app.get('KeyValueStore');
        const res = await request(app).post(
            "/store"
        ).send({key: 12345, value: '123456'});
        expect(res.statusCode).toBe(422);

        expect(store.get('key1')).toBe(null);
    });

    it("should not store data if key is an object", async () => {
        const store = app.get('KeyValueStore');
        const res = await request(app).post(
            "/store"
        ).send({key: {'object': 'object'}, value: '123456'});
        expect(res.statusCode).toBe(422);

        expect(store.get('key1')).toBe(null);
    });

    it("should not store data if value is an object", async () => {
        const store = app.get('KeyValueStore');
        const res = await request(app).post(
            "/store"
        ).send({key: 'key1', value: {'object': 'object'}});
        expect(res.statusCode).toBe(422);

        expect(store.get('key1')).toBe(null);
    });

    it("should not store data if ttl is a string", async () => {
        const store = app.get('KeyValueStore');
        const res = await request(app).post(
            "/store"
        ).send({key: 'key1', value: '12345', ttl: '300'});
        expect(res.statusCode).toBe(422);

        expect(store.get('key1')).toBe(null);
    });

    it("should not store data if ttl is a float", async () => {
        const store = app.get('KeyValueStore');
        const res = await request(app).post(
            "/store"
        ).send({key: 'key1', value: '12345', ttl: 300.25});
        expect(res.statusCode).toBe(422);

        expect(store.get('key1')).toBe(null);
    });

    it("should not store data if body is empty", async () => {
        const store = app.get('KeyValueStore');
        const res = await request(app).post(
            "/store"
        );
        expect(res.statusCode).toBe(422);

        expect(store.get('key1')).toBe(null);
    });

    it("should return 409 conflict if key already exists, and not overwrite", async () => {
        const store = app.get('KeyValueStore');
        store.add('key1', '12345');
        const res = await request(app).post(
            "/store"
        ).send({key: 'key1', value: '123456'});
        expect(res.statusCode).toBe(409);
        expect(store.get('key1')).toBe('12345');
    });

    it("should delete key if it exists", async () => {
        const store = app.get('KeyValueStore');
        store.add('key1', '12345');
        const res = await request(app).delete(
            "/store/key1"
        );
        expect(res.statusCode).toBe(200);
        expect(store.get('key1')).toBe(null);
    });

    it("should return 404 if key does not exist", async () => {
        const res = await request(app).delete(
            "/store/key1"
        );
        expect(res.statusCode).toBe(404);
    });

    it("should return 404 if key exists but has expired", async () => {
        const store = app.get('KeyValueStore');
        store.add('key1', '12345', 30);

        // change now to 31 seconds in the future, key should be expired by then
        jest.useFakeTimers({
            now: new Date().getTime() + (31 * 1000),
        });
        const res = await request(app).delete(
            "/store/key1"
        );
        expect(res.statusCode).toBe(404);
    });
});
