import {AuthClient, AuthConfig} from "@/index";

/**
 * Creates an instance of AuthClient with the provided configuration.
 * @param {AuthConfig} config - The configuration object containing authentication schemes and storage.
 * @returns {AuthClient} - An instance of AuthClient configured with the provided settings.
 */
export const createAuth = (config: AuthConfig): AuthClient => {
    return new AuthClient(config);
};
