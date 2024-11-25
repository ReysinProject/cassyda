import {AuthProvider, AuthorizeOptions, AuthResponse, OAuth2Config} from "@/types";

/**
 * An abstract base class for OAuth2 providers.
 * @implements {AuthProvider}
 */
export abstract class OAuth2Provider implements AuthProvider {
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
     * @type {'oauth'}
     */
    type: 'oauth' = 'oauth';

    /**
     * The client ID for the OAuth2 provider.
     * @type {string}
     * @protected
     */
    protected clientId: string;

    /**
     * The client secret for the OAuth2 provider.
     * @type {string}
     * @protected
     */
    protected clientSecret: string;

    /**
     * The redirect URI for the OAuth2 provider.
     * @type {string}
     * @protected
     */
    protected redirectUri: string;

    /**
     * The scope of permissions requested from the OAuth2 provider.
     * @type {string[]}
     * @protected
     */
    protected scope: string[];

    /**
     * Additional parameters for the OAuth2 provider.
     * @type {Record<string, string>}
     * @protected
     */
    protected additionalParams: Record<string, string>;

    /**
     * The endpoint for authorizing the user.
     * @type {string}
     * @protected
     * @abstract
     */
    protected abstract authorizeEndpoint: string;

    /**
     * The endpoint for obtaining the access token.
     * @type {string}
     * @protected
     * @abstract
     */
    protected abstract tokenEndpoint: string;

    /**
     * The endpoint for retrieving user information.
     * @type {string}
     * @protected
     * @abstract
     */
    protected abstract userInfoEndpoint: string;

    /**
     * Creates an instance of OAuth2Provider.
     * @param {string} id - The unique identifier for the provider.
     * @param {string} name - The name of the provider.
     * @param {OAuth2Config} config - The configuration object for the OAuth2 provider.
     */
    constructor(id: string, name: string, config: OAuth2Config) {
        this.id = id;
        this.name = name;
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.redirectUri = config.redirectUri;
        this.scope = config.scope || [];
        this.additionalParams = config.additionalParams || {};
    }

    /**
     * Authorizes the user and handles the OAuth2 flow.
     * @param {AuthorizeOptions} options - The options for authorization.
     * @returns {Promise<AuthResponse>} - A promise that resolves to the authentication response.
     */
    async authorize(options: AuthorizeOptions): Promise<AuthResponse> {
        if (options.params?.code) {
            return this.handleCallback(options.params.code);
        }

        this.redirectToProvider();
        // This won't actually be reached due to redirect
        return Promise.reject('Redirect in progress');
    }

    /**
     * Redirects the user to the OAuth2 provider's authorization endpoint.
     * @protected
     */
    protected redirectToProvider(): void {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            response_type: 'code',
            scope: this.scope.join(' '),
            ...this.additionalParams,
        });

        window.location.href = `${this.authorizeEndpoint}?${params.toString()}`;
    }

    /**
     * Handles the callback from the OAuth2 provider and exchanges the authorization code for tokens.
     * @param {string} code - The authorization code received from the provider.
     * @returns {Promise<AuthResponse>} - A promise that resolves to the authentication response.
     * @protected
     */
    protected async handleCallback(code: string): Promise<AuthResponse> {
        const tokenResponse = await fetch(this.tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.redirectUri,
            }),
        });

        const tokens = await tokenResponse.json();
        const userInfo = await this.getUserInfo(tokens.access_token);

        return {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresIn: tokens.expires_in,
            user: userInfo,
        };
    }

    /**
     * Retrieves user information using the access token.
     * @param {string} accessToken - The access token to use for retrieving user information.
     * @returns {Promise<any>} - A promise that resolves to the user information.
     * @protected
     */
    protected async getUserInfo(accessToken: string): Promise<any> {
        const response = await fetch(this.userInfoEndpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.json();
    }

    /**
     * Validates the access token by checking if it can retrieve user information.
     * @param {string} token - The access token to validate.
     * @returns {Promise<boolean>} - A promise that resolves to true if the token is valid, false otherwise.
     */
    async validateToken(token: string): Promise<boolean> {
        try {
            const response = await fetch(this.userInfoEndpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Refreshes the access token using the refresh token.
     * @param {string} refreshToken - The refresh token to use for obtaining a new access token.
     * @returns {Promise<AuthResponse>} - A promise that resolves to the authentication response.
     */
    async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
        const response = await fetch(this.tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });

        const tokens = await response.json();
        return {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresIn: tokens.expires_in,
        };
    }
}
