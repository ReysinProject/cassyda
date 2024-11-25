/**
 * Interface for a storage strategy.
 */
export interface StorageStrategy {
    /**
     * Gets the value of an item by its key.
     * @param {string} key - The key of the item.
     * @returns {Promise<string | null>} - A promise that resolves to the value of the item or null if not found.
     */
    getItem(key: string): Promise<string | null>;

    /**
     * Sets the value of an item.
     * @param {string} key - The key of the item.
     * @param {string} value - The value of the item.
     * @returns {Promise<void>} - A promise that resolves when the item is set.
     */
    setItem(key: string, value: string): Promise<void>;

    /**
     * Removes an item by its key.
     * @param {string} key - The key of the item to remove.
     * @returns {Promise<void>} - A promise that resolves when the item is removed.
     */
    removeItem(key: string): Promise<void>;

    /**
     * Clears all items.
     * @returns {Promise<void>} - A promise that resolves when all items are cleared.
     */
    clear(): Promise<void>;
}

/**
 * Interface for an authentication provider.
 */
export interface AuthProvider {
    /**
     * The unique identifier for the provider.
     * @type {string}
     */
    id: string;

    /**
     * The name of the provider.
     * @type {string}
     */
    name: string;

    /**
     * The type of authentication provider.
     * @type {'oauth' | 'credentials' | 'passwordless'}
     */
    type: 'oauth' | 'credentials' | 'passwordless';

    /**
     * Authorizes the user and handles the authentication flow.
     * @param {AuthorizeOptions} options - The options for authorization.
     * @returns {Promise<AuthResponse>} - A promise that resolves to the authentication response.
     */
    authorize(options: AuthorizeOptions): Promise<AuthResponse>;

    /**
     * Validates the access token.
     * @param {string} token - The access token to validate.
     * @returns {Promise<boolean>} - A promise that resolves to true if the token is valid, false otherwise.
     */
    validateToken(token: string): Promise<boolean>;
}

/**
 * Interface for an authentication scheme.
 */
export interface AuthScheme {
    /**
     * The unique identifier for the scheme.
     * @type {string}
     */
    id: string;

    /**
     * The name of the scheme.
     * @type {string}
     */
    name: string;

    /**
     * The providers associated with the scheme.
     * @type {AuthProvider[]}
     */
    providers: AuthProvider[];

    /**
     * The options for the scheme.
     * @type {AuthSchemeOptions}
     */
    options: AuthSchemeOptions;
}

/**
 * Core configuration for the authentication system.
 */
export interface AuthConfig {
    /**
     * The authentication schemes.
     * @type {Record<string, AuthScheme>}
     */
    schemes: Record<string, AuthScheme>;

    /**
     * The default authentication scheme.
     * @type {string}
     */
    defaultScheme: string;

    /**
     * The storage strategy to use.
     * @type {StorageStrategy}
     */
    storage: StorageStrategy;

    /**
     * Optional endpoints for authentication.
     * @type {AuthEndpoints}
     */
    endpoints?: AuthEndpoints;
}

/**
 * Interface for authentication endpoints.
 */
export interface AuthEndpoints {
    /**
     * The login endpoint.
     * @type {string}
     */
    login?: string;

    /**
     * The logout endpoint.
     * @type {string}
     */
    logout?: string;

    /**
     * The callback endpoint.
     * @type {string}
     */
    callback?: string;

    /**
     * The refresh endpoint.
     * @type {string}
     */
    refresh?: string;
}

/**
 * Options for an authentication scheme.
 */
export interface AuthSchemeOptions {
    /**
     * The type of token used.
     * @type {'Bearer' | 'JWT'}
     */
    tokenType: 'Bearer' | 'JWT';

    /**
     * The key for the access token.
     * @type {string}
     */
    accessTokenKey?: string;

    /**
     * The key for the refresh token.
     * @type {string}
     */
    refreshTokenKey?: string;

    /**
     * The key for the token expiration.
     * @type {string}
     */
    expiresKey?: string;
}

/**
 * Options for authorization.
 */
export interface AuthorizeOptions {
    /**
     * The provider to use for authorization.
     * @type {string}
     */
    provider: string;

    /**
     * The scheme to use for authorization.
     * @type {string}
     */
    scheme: string;

    /**
     * Additional parameters for authorization.
     * @type {Record<string, any>}
     */
    params?: Record<string, any>;
}

/**
 * The response from an authentication process.
 */
export interface AuthResponse {
    /**
     * The access token.
     * @type {string}
     */
    accessToken: string;

    /**
     * The refresh token.
     * @type {string}
     */
    refreshToken?: string;

    /**
     * The expiration time of the token in seconds.
     * @type {number}
     */
    expiresIn?: number;

    /**
     * The user information.
     * @type {any}
     */
    user?: any;
}

/**
 * Configuration interface for OAuth2 providers.
 */
export interface OAuth2Config {
    /**
     * The client ID for the OAuth2 provider.
     * @type {string}
     */
    clientId: string;

    /**
     * The client secret for the OAuth2 provider.
     * @type {string}
     */
    clientSecret: string;

    /**
     * The redirect URI for the OAuth2 provider.
     * @type {string}
     */
    redirectUri: string;

    /**
     * The scope of permissions requested from the OAuth2 provider.
     * @type {string[]}
     */
    scope?: string[];

    /**
     * Additional parameters for the OAuth2 provider.
     * @type {Record<string, string>}
     */
    additionalParams?: Record<string, string>;
}
