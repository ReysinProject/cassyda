import { StorageStrategy } from "@/types";

/**
 * A storage strategy that uses the browser's localStorage to store data.
 * @implements {StorageStrategy}
 */
export class LocalStorageStrategy implements StorageStrategy {
    /**
     * Gets the value of an item from localStorage by its key.
     * @param {string} key - The key of the item.
     * @returns {Promise<string | null>} - A promise that resolves to the value of the item or null if not found.
     */
    async getItem(key: string): Promise<string | null> {
        return localStorage.getItem(key);
    }

    /**
     * Sets the value of an item in localStorage.
     * @param {string} key - The key of the item.
     * @param {string} value - The value of the item.
     * @returns {Promise<void>} - A promise that resolves when the item is set.
     */
    async setItem(key: string, value: string): Promise<void> {
        localStorage.setItem(key, value);
    }

    /**
     * Removes an item from localStorage by its key.
     * @param {string} key - The key of the item to remove.
     * @returns {Promise<void>} - A promise that resolves when the item is removed.
     */
    async removeItem(key: string): Promise<void> {
        localStorage.removeItem(key);
    }

    /**
     * Clears all items from localStorage.
     * @returns {Promise<void>} - A promise that resolves when all items are cleared.
     */
    async clear(): Promise<void> {
        localStorage.clear();
    }
}
