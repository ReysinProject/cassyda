import "./App.css";
import {useEffect, useState} from "react";
import type { AuthClient} from "@cassyda/core";
import {auth} from "./authClient.ts";

function App() {
	const [accessToken, setAccessToken] = useState<string | null>(null);

	const [authClient] = useState<AuthClient>(auth);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		window.history.replaceState({}, document.title, "/");
		if (code) {
			authClient.login({
				scheme: 'default',
				provider: 'discord',
				params: {
					code
				}
			}).then(() => {
				authClient.getAccessToken().then((e) => {
					setAccessToken(e);
				})
			})
		}
	}, [authClient]);

	useEffect(() => {
		authClient.getAccessToken().then((e) => {
			setAccessToken(e);
		})
	}, [authClient. getAccessToken]);

	const handleLogin = () => {
		authClient.login({
			scheme: 'default',
			provider: 'discord'
		}).then((e) => {
			console.log(e)
			console.log('Logged in!');
		})
	}

	const handleLogout = () => {
		authClient.logout().then(() => {
			setAccessToken(null);
		})
	}

	return (
		<div>
			<button type={"button"} onClick={() => handleLogin()}>Login</button>
			<p>token :</p>
			<p>{accessToken}</p>
			<button type={"button"} onClick={() => handleLogout()}>Logout</button>
		</div>
	);
}

export default App;
