import {OAuth2Provider} from "@/providers/OAuth2Provider";
import {OAuth2Config} from "@/types";

/**
 * A provider for authenticating with GitHub using OAuth2.
 * @extends OAuth2Provider
 */
export class GitHubProvider extends OAuth2Provider {
    /**
     * The endpoint for authorizing the user.
     * @type {string}
     */
    protected authorizeEndpoint = 'https://github.com/login/oauth/authorize';

    /**
     * The endpoint for obtaining the access token.
     * @type {string}
     */
    protected tokenEndpoint = 'https://github.com/login/oauth/access_token';

    /**
     * The endpoint for retrieving user information.
     * @type {string}
     */
    protected userInfoEndpoint = 'https://api.github.com/user';

    /**
     * Creates an instance of GitHubProvider.
     * @param {OAuth2Config} config - The configuration object for the OAuth2 provider.
     */
    constructor(config: OAuth2Config) {
        super('github', 'GitHub', {
            ...config,
            scope: config.scope || ['read:user', 'user:email'],
        });
    }

    /**
     * Retrieves user information using the access token.
     * @param {string} accessToken - The access token to use for retrieving user information.
     * @returns {Promise<any>} - A promise that resolves to the user information.
     */
    protected async getUserInfo(accessToken: string): Promise<any> {
        const [userResponse, emailsResponse] = await Promise.all([
            fetch(this.userInfoEndpoint, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }),
            fetch(`${this.userInfoEndpoint}/emails`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }),
        ]);

        const user = await userResponse.json();
        const emails = await emailsResponse.json();

        return {
            ...user,
            email: emails.find((email: any) => email.primary)?.email,
        };
    }
}
