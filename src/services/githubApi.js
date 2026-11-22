const GITHUB_API = "https://api.github.com";

async function githubRequest(path) {
	const response = await fetch(`${GITHUB_API}${path}`, {
		headers: { Accept: "application/vnd.github+json" },
	});

	if (response.status === 404) {
		throw new Error("لم نعثر على حساب بهذا الاسم. تحقق من اسم المستخدم وحاول مجددًا.");
	}
	if (response.status === 403 || response.status === 429) {
		throw new Error("وصلنا إلى حد طلبات GitHub مؤقتًا. انتظر قليلًا ثم حاول مجددًا.");
	}
	if (!response.ok) {
		throw new Error("تعذر الاتصال بـ GitHub. تحقق من اتصالك بالإنترنت.");
	}

	return response.json();
}

export async function fetchGithubProfile(username) {
	const normalizedUsername = username.trim().replace(/^@/, "");
	if (!normalizedUsername) throw new Error("أدخل اسم مستخدم GitHub أولًا.");

	const [profile, repositories] = await Promise.all([
		githubRequest(`/users/${encodeURIComponent(normalizedUsername)}`),
		githubRequest(`/users/${encodeURIComponent(normalizedUsername)}/repos?sort=updated&per_page=100`),
	]);

	return { profile, repositories };
}
