interface Store {
    [key: string]: {
        value: string | number | boolean,
        ttl: Date | null
    }
}

export class KeyValueStore {
    private kvStore: Store;

    constructor() {
        this.kvStore = {};
    }

    add(key: string, value: string | number | boolean, ttlInSeconds: number | null = null): boolean {
        if (!this.isExpired(key)) {
            // prevent conflicts
            return false;
        }
        let expiry = null;
        if (ttlInSeconds !== null) {
            expiry = new Date(new Date().getTime() + ttlInSeconds * 1000);
        }
        this.kvStore[key] = {
            value: value,
            ttl: expiry,
        };

        return true;
    }

    get(key: string, defaultValueIfNull: string | number | null = null): string | number | boolean | null {
        if (this.isExpired(key)) {
            return defaultValueIfNull;
        }

        return this.kvStore[key].value;
    }

    delete(key: string): boolean {
        if (!this.isExpired(key)) {
            // prevent conflicts
            delete this.kvStore[key];

            return true;
        }

        // key was expired and was already scheduled to be deleted
        // or it did not exist
        return false;
    }

    reset() {
        this.kvStore = {};
    }

    private isExpired(key: string): boolean {
        if (this.kvStore[key] === undefined) {
            // key does not exist so we don't care
            return true;
        }
        const item = this.kvStore[key];
        if (item.ttl !== null && item.ttl.getTime() < new Date().getTime()) {
            // remove it from the store
            // An advanced version will store the data in an ordered set, and have a background job running
            // to remove expired data. Also thread locks for multithreading??????????
            delete this.kvStore[key];

            return true;
        }

        return false;
    }
}
