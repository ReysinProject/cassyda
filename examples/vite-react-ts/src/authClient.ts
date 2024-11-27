import {type AuthClient, createAuth, DiscordProvider, LocalStorageStrategy} from "@cassyda/core";

export const auth: AuthClient = createAuth({
	schemes: {
		default: {
			id: 'default',
			name: 'Default Scheme',
			providers: [
				new DiscordProvider({
					clientId: '1311221934461030430',
					redirectUri: 'http://localhost:5173/',
					scope: ['identify', 'guilds'],
					clientSecret: 'iZpWIbM9gx0Pk9mDwThSfyZTDwNUHqM-'
				})
			],
			options: {
				tokenType: 'JWT'
			}
		}
	},
	defaultScheme: 'default',
	storage: new LocalStorageStrategy()
})