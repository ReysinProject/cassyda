import {OAuth2Provider} from "@/providers/OAuth2Provider";
import {OAuth2Config} from "@/types";

/**
 * A provider for authenticating with Google using OAuth2.
 * @extends OAuth2Provider
 */
export class GoogleProvider extends OAuth2Provider {
    /**
     * The endpoint for authorizing the user.
     * @type {string}
     */
    protected authorizeEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    /**
     * The endpoint for obtaining the access token.
     * @type {string}
     */
    protected tokenEndpoint = 'https://oauth2.googleapis.com/token';

    /**
     * The endpoint for retrieving user information.
     * @type {string}
     */
    protected userInfoEndpoint = 'https://www.googleapis.com/oauth2/v3/userinfo';

    /**
     * Creates an instance of GoogleProvider.
     * @param {OAuth2Config} config - The configuration object for the OAuth2 provider.
     */
    constructor(config: OAuth2Config) {
        super('google', 'Google', {
            ...config,
            scope: config.scope || ['openid', 'email', 'profile'],
        });
    }
}
