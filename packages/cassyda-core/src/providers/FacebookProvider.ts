import {OAuth2Config} from "@/types";
import {OAuth2Provider} from "@/providers/OAuth2Provider";

/**
 * A provider for authenticating with Facebook using OAuth2.
 * @extends OAuth2Provider
 */
export class FacebookProvider extends OAuth2Provider {
    /**
     * The endpoint for authorizing the user.
     * @type {string}
     */
    protected authorizeEndpoint = 'https://facebook.com/v18.0/dialog/oauth';

    /**
     * The endpoint for obtaining the access token.
     * @type {string}
     */
    protected tokenEndpoint = 'https://graph.facebook.com/v18.0/oauth/access_token';

    /**
     * The endpoint for retrieving user information.
     * @type {string}
     */
    protected userInfoEndpoint = 'https://graph.facebook.com/me';

    /**
     * Creates an instance of FacebookProvider.
     * @param {OAuth2Config} config - The configuration object for the OAuth2 provider.
     */
    constructor(config: OAuth2Config) {
        super('facebook', 'Facebook', {
            ...config,
            scope: config.scope || ['email', 'public_profile'],
        });
    }

    /**
     * Retrieves user information using the access token.
     * @param {string} accessToken - The access token to use for retrieving user information.
     * @returns {Promise<any>} - A promise that resolves to the user information.
     */
    protected async getUserInfo(accessToken: string): Promise<any> {
        const response = await fetch(
            `${this.userInfoEndpoint}?fields=id,name,email,picture&access_token=${accessToken}`
        );
        return response.json();
    }
}
