import { StorageStrategy } from "@/types";

/**
 * Options for configuring cookies.
 */
interface CookieOptions {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
    httpOnly?: boolean;
}

/**
 * A storage strategy that uses cookies to store data.
 * @implements {StorageStrategy}
 */
export class CookieStorageStrategy implements StorageStrategy {
    /**
     * The default options for cookies.
     * @type {CookieOptions}
     * @private
     * @readonly
     */
    private readonly defaultOptions: CookieOptions;

    /**
     * Creates an instance of CookieStorageStrategy.
     * @param {CookieOptions} [options={}] - The options for configuring cookies.
     */
    constructor(options: CookieOptions = {}) {
        this.defaultOptions = {
            path: '/',
            secure: true,
            sameSite: 'Lax',
            ...options
        };
    }

    /**
     * Gets the value of a cookie by its key.
     * @param {string} key - The key of the cookie.
     * @returns {Promise<string | null>} - A promise that resolves to the value of the cookie or null if not found.
     */
    async getItem(key: string): Promise<string | null> {
        const cookies = document.cookie.split(';');
        const cookie = cookies.find(c => c.trim().startsWith(`${key}=`));

        if (!cookie) {
            return null;
        }

        const [, value] = cookie.split('=');
        try {
            return decodeURIComponent(value.trim());
        } catch {
            return null;
        }
    }

    /**
     * Sets the value of a cookie.
     * @param {string} key - The key of the cookie.
     * @param {string} value - The value of the cookie.
     * @param {CookieOptions} [options] - Additional options for the cookie.
     * @returns {Promise<void>} - A promise that resolves when the cookie is set.
     */
    async setItem(key: string, value: string, options?: CookieOptions): Promise<void> {
        const mergedOptions = { ...this.defaultOptions, ...options };
        let cookie = `${key}=${encodeURIComponent(value)}`;

        if (mergedOptions.path) {
            cookie += `;path=${mergedOptions.path}`;
        }

        if (mergedOptions.domain) {
            cookie += `;domain=${mergedOptions.domain}`;
        }

        if (mergedOptions.maxAge !== undefined) {
            cookie += `;max-age=${mergedOptions.maxAge}`;
        }

        if (mergedOptions.expires) {
            cookie += `;expires=${mergedOptions.expires.toUTCString()}`;
        }

        if (mergedOptions.secure) {
            cookie += ';secure';
        }

        if (mergedOptions.sameSite) {
            cookie += `;samesite=${mergedOptions.sameSite}`;
        }

        document.cookie = cookie;
    }

    /**
     * Removes a cookie by its key.
     * @param {string} key - The key of the cookie to remove.
     * @returns {Promise<void>} - A promise that resolves when the cookie is removed.
     */
    async removeItem(key: string): Promise<void> {
        // Set expires to a past date to remove the cookie
        await this.setItem(key, '', {
            ...this.defaultOptions,
            expires: new Date(0),
            maxAge: 0
        });
    }

    /**
     * Clears all cookies.
     * @returns {Promise<void>} - A promise that resolves when all cookies are cleared.
     */
    async clear(): Promise<void> {
        const cookies = document.cookie.split(';');

        for (const cookie of cookies) {
            const key = cookie.split('=')[0].trim();
            await this.removeItem(key);
        }
    }
}
