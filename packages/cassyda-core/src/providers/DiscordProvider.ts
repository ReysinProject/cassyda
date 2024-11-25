import {OAuth2Provider} from "@/providers/OAuth2Provider";
import {OAuth2Config} from "@/types";

/**
 * A provider for authenticating with Discord using OAuth2.
 * @extends OAuth2Provider
 */
export class DiscordProvider extends OAuth2Provider {
    /**
     * The endpoint for authorizing the user.
     * @type {string}
     */
    protected authorizeEndpoint = 'https://discord.com/api/oauth2/authorize';

    /**
     * The endpoint for obtaining the access token.
     * @type {string}
     */
    protected tokenEndpoint = 'https://discord.com/api/oauth2/token';

    /**
     * The endpoint for retrieving user information.
     * @type {string}
     */
    protected userInfoEndpoint = 'https://discord.com/api/users/@me';

    /**
     * Creates an instance of DiscordProvider.
     * @param {OAuth2Config} config - The configuration object for the OAuth2 provider.
     */
    constructor(config: OAuth2Config) {
        super('discord', 'Discord', {
            ...config,
            scope: config.scope || ['identify', 'email'],
            additionalParams: {
                ...config.additionalParams,
                prompt: 'consent',
            },
        });
    }
}
