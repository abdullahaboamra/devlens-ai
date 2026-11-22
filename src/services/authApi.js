import { fetchGithubProfile } from "./githubApi";

export async function loginUser(username) {
	const { profile } = await fetchGithubProfile(username);
	return {
		username: profile.login,
		name: profile.name,
		avatarUrl: profile.avatar_url,
	};
}
