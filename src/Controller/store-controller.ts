import {RequestHandler, Request, Response} from "express";

export class StoreController {
    public static get: RequestHandler = async (
        req: Request, res: Response, next
    ): Promise<void> => {
        const keyValueStore = req.app.get('KeyValueStore');
        const value = keyValueStore.get(req.params.key);

        if (value === null) {
            res.status(404).json(req.params.key + ' not found');
            return;
        }

        res.json({key: req.params.key, value: value});
    };

    public static add: RequestHandler = async (
        req: Request, res: Response, next
    ): Promise<void> => {
        const data = req.body;
        if (
            data.key === undefined ||
            data.value === undefined ||
            typeof data.key !== 'string' ||
            (typeof data.value !== 'string' && typeof data.value !== 'number' && typeof data.value !== 'boolean') ||
            (data.ttl !== undefined && (typeof data.ttl !== 'number' || !Number.isInteger(data.ttl)))
        ) {
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
    };

    public static delete: RequestHandler = async (
        req: Request, res: Response, next
    ): Promise<void> => {
        const keyValueStore = req.app.get('KeyValueStore');
        const result = keyValueStore.delete(req.params.key);

        if (!result) {
            res.status(404).json('Key not found.');
            return;
        }

        res.json('deleted');
    };
}
