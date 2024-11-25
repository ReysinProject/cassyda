import {AuthConfig, AuthorizeOptions, AuthResponse, AuthScheme} from "@/index";

/**
 * A client for handling authentication using various schemes and providers.
 */
export class AuthClient {
    private config: AuthConfig;
    private currentScheme?: AuthScheme;

    /**
     * Creates an instance of AuthClient.
     * @param {AuthConfig} config - The configuration object containing authentication schemes and storage.
     */
    constructor(config: AuthConfig) {
        this.config = config;
        this.currentScheme = config.schemes[config.defaultScheme];
    }

    /**
     * Switch between different authentication schemes.
     * @param {string} schemeName - The name of the scheme to switch to.
     * @returns {AuthClient} - The current instance of AuthClient for method chaining.
     * @throws {Error} - If the specified scheme is not found.
     */
    public useScheme(schemeName: string): AuthClient {
        if (!this.config.schemes[schemeName]) {
            throw new Error(`Scheme ${schemeName} not found`);
        }
        this.currentScheme = this.config.schemes[schemeName];
        return this;
    }

    /**
     * Login using the current scheme and specified provider.
     * @param {AuthorizeOptions} options - The options for authorization, including scheme and provider.
     * @returns {Promise<AuthResponse>} - The response from the authorization process.
     * @throws {Error} - If the specified provider is not found in the scheme.
     */
    public async login(options: AuthorizeOptions): Promise<AuthResponse> {
        const scheme = this.config.schemes[options.scheme];
        const provider = scheme.providers.find(p => p.id === options.provider);

        if (!provider) {
            throw new Error(`Provider ${options.provider} not found in scheme ${options.scheme}`);
        }

        const response = await provider.authorize(options);
        await this.setTokens(response);
        return response;
    }

    /**
     * Logout from the current session.
     * @returns {Promise<void>} - A promise that resolves when the logout process is complete.
     */
    public async logout(): Promise<void> {
        await this.config.storage.clear();
    }

    /**
     * Check if the user is authenticated.
     * @returns {Promise<boolean>} - A promise that resolves to true if the user is authenticated, false otherwise.
     */
    public async isAuthenticated(): Promise<boolean> {
        const token = await this.getAccessToken();
        if (!token) return false;

        const scheme = this.currentScheme;
        if (!scheme) return false;

        return scheme.providers.some(async provider => await provider.validateToken(token));
    }

    /**
     * Get the current access token.
     * @returns {Promise<string | null>} - A promise that resolves to the access token or null if not found.
     */
    public async getAccessToken(): Promise<string | null> {
        const key = this.currentScheme?.options.accessTokenKey || 'access_token';
        return this.config.storage.getItem(key);
    }

    /**
     * Set the tokens in storage.
     * @param {AuthResponse} response - The response containing the access token and optionally the refresh token.
     * @returns {Promise<void>} - A promise that resolves when the tokens are set.
     * @throws {Error} - If no scheme is selected.
     */
    private async setTokens(response: AuthResponse): Promise<void> {
        const scheme = this.currentScheme;
        if (!scheme) throw new Error('No scheme selected');

        await this.config.storage.setItem(
            scheme.options.accessTokenKey || 'access_token',
            response.accessToken
        );

        if (response.refreshToken) {
            await this.config.storage.setItem(
                scheme.options.refreshTokenKey || 'refresh_token',
                response.refreshToken
            );
        }
    }
}