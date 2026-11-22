import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { fetchGithubProfile } from "../services/githubApi";
import { useAuth } from "../context/AuthContext";
import { useSaved } from "../context/SavedContext";
import { useTheme } from "../context/ThemeContext";
import "./App.css";

const copy = {
	en: {
		home: "Explore", saved: "Saved reports", compare: "Compare", signIn: "Sign in", signOut: "Sign out", dark: "Dark", light: "Light", language: "العربية", welcome: "Welcome back,",
		eyebrow: "GitHub profile analyzer", headline: "Understand your work.", headlineAccent: "Find your next move.", intro: "A clear view of a developer's profile and repositories, built directly from public GitHub data.", username: "Username", analyze: "Analyze profile", analyzing: "Analyzing...", hint: "No access token needed. Only public GitHub data is used.",
		visualTitle: "DEVLENS / ANALYSIS", visualStatus: "PROFILE TOOL", visualCaption: "GITHUB INSIGHTS\nAT A GLANCE",
		compareHeading: "Compare developers", compareDescription: "Compare public GitHub profiles and repository metrics side by side.", firstUsername: "First username", secondUsername: "Second username", compareNow: "Compare profiles", comparing: "Comparing...", compareResults: "Comparison", languageCountMetric: "Languages (up to 100 repos)", forkCountMetric: "Forks (up to 100 repos)", totalStars: "Stars (up to 100 repos)", enterTwo: "Enter two GitHub usernames.", sameAccount: "Choose two different GitHub accounts.",
		repositoryActivity: "Repository activity", repositorySummary: "Repository count and language breakdown", developerProfile: "Developer profile", developerSummary: "Followers, location, and join date", saveableReport: "Saveable report", saveableSummary: "Keep the results and return to them later", report: "ACCOUNT REPORT", profileActivity: "Profile & activity", saveReport: "+ Save report", savedMark: "✓ Saved", exportCsv: "Export CSV", savePdf: "Print / Save PDF",
		repositories: "Public repositories", stars: "Stars (up to 100 repos)", followers: "Followers", following: "Following", languages: "Languages (up to 100 repos)", recent: "Repositories", repoSearch: "Search repositories", sortUpdated: "Recently updated", sortStars: "Most stars", sortForks: "Most forks", reposFound: "repositories", noMatches: "No repositories match your search.", repoName: "Repository", description: "Description", languageLabel: "Language", forks: "Forks", updated: "Updated", noData: "No language data available.", noDescription: "No description", noRepos: "No public repositories.", noBio: "No bio added.", noLocation: "Location not specified", joined: "Joined", account: "Developer account", connect: "Connect your profile", continue: "Continue", checking: "Checking...", back: "Back to explore", view: "View account", remove: "Remove report", emptyTitle: "No reports yet", emptyText: "Analyze an account and save its report to find it here.", start: "Start analyzing", error: "Could not load this GitHub account. Please try again.", notFound: "No GitHub account was found with that username.", rateLimit: "GitHub's request limit was reached. Please try again later.", connection: "Could not connect to GitHub. Check your internet connection."
	},
	ar: {
		home: "استكشاف", saved: "التقارير المحفوظة", compare: "مقارنة", signIn: "تسجيل الدخول", signOut: "تسجيل الخروج", dark: "داكن", light: "فاتح", language: "English", welcome: "مرحبًا بعودتك،",
		eyebrow: "محلل ملفات GitHub", headline: "افهم عملك.", headlineAccent: "طوّر خطوتك التالية.", intro: "نظرة واضحة على ملف المطور ومستودعاته، مبنية مباشرة على بيانات GitHub العامة.", username: "اسم المستخدم", analyze: "حلّل الحساب", analyzing: "جارٍ التحليل...", hint: "لا حاجة لرمز وصول. نستخدم بيانات GitHub العامة فقط.",
		visualTitle: "DEVLENS / تحليل الملف", visualStatus: "أداة تحليل", visualCaption: "مؤشرات GitHub\nفي لمحة",
		compareHeading: "قارن بين المطورين", compareDescription: "قارن الملفات العامة ومؤشرات المستودعات جنبًا إلى جنب.", firstUsername: "اسم المستخدم الأول", secondUsername: "اسم المستخدم الثاني", compareNow: "قارن الحسابين", comparing: "جارٍ المقارنة...", compareResults: "نتيجة المقارنة", languageCountMetric: "اللغات (حتى 100 مستودع)", forkCountMetric: "التفرعات (حتى 100 مستودع)", totalStars: "النجوم (حتى 100 مستودع)", enterTwo: "أدخل اسمي مستخدم GitHub.", sameAccount: "اختر حسابين مختلفين للمقارنة.",
		repositoryActivity: "نشاط المستودعات", repositorySummary: "عدد المستودعات وتوزيع لغات البرمجة", developerProfile: "ملف المطور", developerSummary: "المتابعون والموقع وتاريخ الانضمام", saveableReport: "تقرير قابل للحفظ", saveableSummary: "احتفظ بالنتائج للعودة إليها لاحقًا", report: "تقرير الحساب", profileActivity: "الملف والنشاط", saveReport: "+ حفظ التقرير", savedMark: "✓ محفوظ", exportCsv: "تصدير CSV", savePdf: "طباعة / حفظ PDF",
		repositories: "المستودعات العامة", stars: "النجوم (حتى 100 مستودع)", followers: "المتابعون", following: "المتابَعون", languages: "اللغات (حتى 100 مستودع)", recent: "المستودعات", repoSearch: "ابحث في المستودعات", sortUpdated: "الأحدث تحديثًا", sortStars: "الأكثر نجومًا", sortForks: "الأكثر تفرعًا", reposFound: "مستودعًا", noMatches: "لا توجد مستودعات تطابق البحث.", repoName: "المستودع", description: "الوصف", languageLabel: "اللغة", forks: "التفرعات", updated: "آخر تحديث", noData: "لا تتوفر بيانات لغة لهذا الحساب.", noDescription: "لا يوجد وصف", noRepos: "لا توجد مستودعات عامة.", noBio: "لم يضف هذا المطور نبذة تعريفية.", noLocation: "الموقع غير محدد", joined: "انضم", account: "حساب المطور", connect: "اربط ملفك", continue: "متابعة", checking: "جارٍ التحقق...", back: "العودة للاستكشاف", view: "عرض الحساب", remove: "حذف التقرير", emptyTitle: "لا توجد تقارير بعد", emptyText: "حلّل حسابًا واحفظ تقريره ليظهر هنا.", start: "ابدأ التحليل", error: "تعذر تحميل حساب GitHub. حاول مرة أخرى.", notFound: "لم نعثر على حساب بهذا الاسم.", rateLimit: "وصلنا إلى حد طلبات GitHub. حاول لاحقًا.", connection: "تعذر الاتصال بـ GitHub. تحقق من اتصالك بالإنترنت."
	}
};

function formatNumber(value, language) {
	return new Intl.NumberFormat(language, { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
}

function formatDate(value, language) {
	if (!value) return language === "ar" ? "غير متاح" : "Not available";
	return new Intl.DateTimeFormat(language, { month: "short", year: "numeric" }).format(new Date(value));
}

function getErrorMessage(error, text) {
	const message = error?.message || "";
	if (message.includes("لم نعثر") || message.includes("404")) return text.notFound;
	if (message.includes("حد طلبات") || message.includes("429")) return text.rateLimit;
	if (message.includes("تعذر الاتصال") || message.includes("تعذر الاتصال بـ GitHub")) return text.connection;
	return text.error;
}

function exportReportCsv(report, text) {
	const { profile, repositories } = report;
	const rows = [
		[text.account, profile.login],
		[text.repositories, profile.public_repos],
		[text.followers, profile.followers],
		[text.following, profile.following],
		[],
		[text.repoName, text.description, text.languageLabel, text.stars, text.forks, text.updated, "URL"],
		...repositories.map((repository) => [repository.name, repository.description, repository.language, repository.stargazers_count, repository.forks_count, repository.updated_at, repository.html_url]),
	];
	const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
	const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
	const link = document.createElement("a");
	link.href = url;
	link.download = `devlens-${profile.login}-report.csv`;
	document.body.append(link);
	link.click();
	link.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Header({ text, language, onToggleLanguage }) {
	const { user, logout } = useAuth();
	const { savedReports } = useSaved();
	const { darkMode, toggleTheme } = useTheme();
	return (
		<header className="topbar">
			<Link className="brand" to="/" aria-label="DevLens home"><span className="brand-mark">D</span><span>devlens<span className="brand-dot">.</span></span></Link>
			<nav className="main-nav" aria-label={language === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
				<NavLink end to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{text.home}</NavLink>
				<NavLink to="/compare" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{text.compare}</NavLink>
				<NavLink to="/saved" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{text.saved} <span className="nav-count">{savedReports.length}</span></NavLink>
			</nav>
			<div className="header-actions">
				<button className="theme-button" type="button" onClick={toggleTheme} aria-label={darkMode ? text.light : text.dark}><span aria-hidden="true">{darkMode ? "☼" : "◐"}</span><span>{darkMode ? text.light : text.dark}</span></button>
				<button className="language-button" type="button" onClick={onToggleLanguage}>{text.language}</button>
				{user ? <button className="user-chip" type="button" onClick={logout} title={text.signOut}><img src={user.avatarUrl} alt="" /><span>{user.username}</span></button> : <Link className="login-link" to="/login">{text.signIn} ↗</Link>}
			</div>
		</header>
	);
}

function Dashboard({ text, language }) {
	const inputRef = useRef(null);
	const loadedUsername = useRef("");
	const [searchParams] = useSearchParams();
	const [username, setUsername] = useState(() => searchParams.get("user") || "");
	const [report, setReport] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { user } = useAuth();
	const { saveReport, isSaved } = useSaved();

	const loadReport = useCallback(async (value) => {
		const query = value.trim().replace(/^@/, "");
		if (!query) {
			inputRef.current?.focus();
			setError(language === "ar" ? "أدخل اسم مستخدم GitHub للبدء." : "Enter a GitHub username to get started.");
			return;
		}
		setLoading(true);
		setError("");
		try {
			const result = await fetchGithubProfile(query);
			setReport({ ...result, username: result.profile.login });
		} catch (requestError) {
			setReport(null);
			setError(getErrorMessage(requestError, text));
		} finally {
			setLoading(false);
		}
	}, [language, text]);

	const analyze = useCallback((event) => {
		event.preventDefault();
		void loadReport(username);
	}, [loadReport, username]);

	useEffect(() => {
		const savedUsername = searchParams.get("user");
		if (!savedUsername) {
			loadedUsername.current = "";
			return;
		}
		if (loadedUsername.current === savedUsername) return;
		loadedUsername.current = savedUsername;
		setUsername(savedUsername);
		void loadReport(savedUsername);
	}, [loadReport, searchParams]);

	const languages = useMemo(() => {
		if (!report) return [];
		const counts = report.repositories.reduce((result, repository) => {
			if (repository.language) result[repository.language] = (result[repository.language] || 0) + 1;
			return result;
		}, {});
		return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
	}, [report]);

	return (
		<main className="page-wrap">
			<section className="intro-grid">
				<div className="intro-copy">
					<p className="eyebrow"><span className="live-dot" /> {text.eyebrow}</p>
					{user && <p className="welcome-note" role="status">{text.welcome} <strong>{user.name || user.username}</strong></p>}
					<h1>{text.headline}<br /><span>{text.headlineAccent}</span></h1>
					<p className="intro-description">{text.intro}</p>
					<form className="search-form" onSubmit={analyze}>
						<span className="search-prefix">github.com /</span>
						<input ref={inputRef} value={username} onChange={(event) => setUsername(event.target.value)} placeholder={text.username} aria-label={text.username} autoComplete="off" />
						<button type="submit" disabled={loading}>{loading ? text.analyzing : text.analyze} ↗</button>
					</form>
					{error && <p className="error-message" role="alert">{error}</p>}
					<p className="form-hint">{text.hint}</p>
				</div>
				<div className="visual-panel" aria-hidden="true">
					<div className="visual-topline" dir="ltr"><span>{text.visualTitle}</span><span className="visual-status">● {text.visualStatus}</span></div>
					<div className="activity-grid">{Array.from({ length: 49 }, (_, index) => <i key={index} className={`activity-cell level-${(index * 7 + Math.floor(index / 7) * 3) % 5}`} />)}</div>
					<div className="visual-footer"><span>{text.visualCaption}</span><span className="visual-footer-mark" aria-hidden="true">●</span></div>
					<div className="visual-caption"><span>{text.visualCaption.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</span><span className="caption-arrow">↘</span></div>
				</div>
			</section>
			{report ? <Report report={report} languages={languages} text={text} language={language} saved={isSaved(report.username)} onSave={() => saveReport(report)} /> : (
				<section className="empty-state" aria-label={text.eyebrow}>
					<div><span className="empty-index">01</span><strong>{text.repositoryActivity}</strong><span>{text.repositorySummary}</span></div>
					<div><span className="empty-index">02</span><strong>{text.developerProfile}</strong><span>{text.developerSummary}</span></div>
					<div><span className="empty-index">03</span><strong>{text.saveableReport}</strong><span>{text.saveableSummary}</span></div>
				</section>
			)}
			<footer className="page-footer"><span>DEVLENS / OPEN SOURCE INSIGHTS</span><span>GITHUB API</span></footer>
		</main>
	);
}

function Report({ report, languages, text, language, saved, onSave }) {
	const { profile, repositories } = report;
	const [repositoryQuery, setRepositoryQuery] = useState("");
	const [sortBy, setSortBy] = useState("updated");
	const totalStars = repositories.reduce((sum, repository) => sum + repository.stargazers_count, 0);
	const stats = [[text.repositories, profile.public_repos], [text.stars, totalStars], [text.followers, profile.followers], [text.following, profile.following]];
	const filteredRepositories = useMemo(() => repositories
		.filter((repository) => `${repository.name} ${repository.description || ""} ${repository.language || ""}`.toLowerCase().includes(repositoryQuery.trim().toLowerCase()))
		.sort((first, second) => {
			if (sortBy === "stars") return second.stargazers_count - first.stargazers_count;
			if (sortBy === "forks") return second.forks_count - first.forks_count;
			return new Date(second.updated_at) - new Date(first.updated_at);
		}), [repositories, repositoryQuery, sortBy]);
	return (
		<section className="report-section" aria-live="polite">
			<div className="section-heading"><div><p className="eyebrow">{text.report}</p><h2>{text.profileActivity}</h2></div><div className="report-actions"><button className="export-button" type="button" onClick={() => exportReportCsv(report, text)}>{text.exportCsv}</button><button className="export-button" type="button" onClick={() => window.print()}>{text.savePdf}</button><button className={saved ? "save-button saved" : "save-button"} type="button" onClick={onSave}>{saved ? text.savedMark : text.saveReport}</button></div></div>
			<div className="profile-row"><img className="avatar" src={profile.avatar_url} alt="" /><div className="profile-info"><h3>{profile.name || profile.login}</h3><a href={profile.html_url} target="_blank" rel="noreferrer">@{profile.login} ↗</a><p>{profile.bio || text.noBio}</p></div><div className="profile-meta"><span>{profile.location || text.noLocation}</span><span>{text.joined} {formatDate(profile.created_at, language)}</span></div></div>
			<div className="stats-row">{stats.map(([label, value]) => <div className="stat" key={label}><span>{label}</span><strong>{formatNumber(value, language)}</strong></div>)}</div>
			<div className="details-grid">
				<div className="detail-panel"><div className="panel-heading"><h3>{text.languages}</h3><span>{languages.length}</span></div>{languages.length ? languages.map(([name, count], index) => <div className="language-row" key={name}><span className={`language-mark language-${index}`} /><span>{name}</span><div className="language-track"><i style={{ width: `${Math.max(8, count / repositories.length * 100)}%` }} /></div><b>{formatNumber(count, language)}</b></div>) : <p className="muted-copy">{text.noData}</p>}</div>
				<div className="detail-panel"><div className="panel-heading"><h3>{text.recent}</h3><span>{formatNumber(filteredRepositories.length, language)} {text.reposFound}</span></div><div className="repo-controls"><input type="search" value={repositoryQuery} onChange={(event) => setRepositoryQuery(event.target.value)} placeholder={text.repoSearch} aria-label={text.repoSearch} /><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label={text.recent}><option value="updated">{text.sortUpdated}</option><option value="stars">{text.sortStars}</option><option value="forks">{text.sortForks}</option></select></div>{filteredRepositories.length ? <div className="repository-list">{filteredRepositories.map((repository) => <a className="repository-row" href={repository.html_url} key={repository.id} target="_blank" rel="noreferrer"><span><strong>{repository.name}</strong><small>{repository.description || text.noDescription}</small></span><span className="repo-language">{repository.language || "—"}</span><span className="repo-stars">★ {formatNumber(repository.stargazers_count, language)}</span></a>)}</div> : <p className="muted-copy">{repositories.length ? text.noMatches : text.noRepos}</p>}</div>
			</div>
		</section>
	);
}

function Compare({ text, language }) {
	const [firstUsername, setFirstUsername] = useState("");
	const [secondUsername, setSecondUsername] = useState("");
	const [comparison, setComparison] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function compareAccounts(event) {
		event.preventDefault();
		const first = firstUsername.trim().replace(/^@/, "");
		const second = secondUsername.trim().replace(/^@/, "");
		if (!first || !second) {
			setError(text.enterTwo);
			return;
		}
		if (first.toLowerCase() === second.toLowerCase()) {
			setError(text.sameAccount);
			return;
		}
		setLoading(true);
		setError("");
		try {
			const results = await Promise.all([fetchGithubProfile(first), fetchGithubProfile(second)]);
			setComparison(results);
		} catch (requestError) {
			setComparison(null);
			setError(getErrorMessage(requestError, text));
		} finally {
			setLoading(false);
		}
	}

	const metrics = useMemo(() => {
		if (!comparison) return [];
		const [first, second] = comparison;
		const summarize = ({ profile, repositories }) => ({
			repositories: profile.public_repos,
			stars: repositories.reduce((sum, repository) => sum + repository.stargazers_count, 0),
			followers: profile.followers,
			forks: repositories.reduce((sum, repository) => sum + repository.forks_count, 0),
			languages: new Set(repositories.map((repository) => repository.language).filter(Boolean)).size,
		});
		return [summarize(first), summarize(second)];
	}, [comparison]);

	const metricRows = [
		[text.repositories, "repositories"], [text.totalStars, "stars"], [text.followers, "followers"], [text.forkCountMetric, "forks"], [text.languageCountMetric, "languages"],
	];

	return <main className="simple-page compare-page"><div className="compare-intro"><p className="eyebrow">DEVLENS / COMPARE</p><h1>{text.compareHeading}</h1><p className="intro-description">{text.compareDescription}</p></div><form className="compare-form" onSubmit={compareAccounts}><label><span>{text.firstUsername}</span><input value={firstUsername} onChange={(event) => setFirstUsername(event.target.value)} placeholder="octocat" required /></label><label><span>{text.secondUsername}</span><input value={secondUsername} onChange={(event) => setSecondUsername(event.target.value)} placeholder="torvalds" required /></label><button type="submit" disabled={loading}>{loading ? text.comparing : text.compareNow} ↗</button></form>{error && <p className="error-message" role="alert">{error}</p>}{comparison && <section className="comparison-results"><h2>{text.compareResults}</h2><div className="comparison-profiles">{comparison.map(({ profile }) => <a className="comparison-profile" href={profile.html_url} target="_blank" rel="noreferrer" key={profile.id}><img src={profile.avatar_url} alt="" /><span><strong>{profile.name || profile.login}</strong><small>@{profile.login}</small></span><b>↗</b></a>)}</div><div className="comparison-table">{metricRows.map(([label, key]) => <div className="compare-metric-row" key={key}><span>{label}</span><strong>{formatNumber(metrics[0][key], language)}</strong><strong>{formatNumber(metrics[1][key], language)}</strong></div>)}</div></section>}</main>;
}

function Login({ text }) {
	const { user, login } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	async function submit(event) {
		event.preventDefault();
		setLoading(true);
		setError("");
		try {
			await login(username);
			navigate("/", { replace: true });
		} catch (loginError) {
			setError(getErrorMessage(loginError, text));
		} finally {
			setLoading(false);
		}
	}
	return <main className="simple-page"><div className="simple-panel"><p className="eyebrow">{text.account}</p><h1>{user ? text.welcome : text.connect}</h1><p className="intro-description">{text.intro}</p>{user ? <p className="signed-user">{user.name || user.username}</p> : <form className="login-form" onSubmit={submit}><label htmlFor="login-username">{text.username}</label><input id="login-username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="octocat" required /><button type="submit" disabled={loading}>{loading ? text.checking : text.continue} ↗</button>{error && <p className="error-message" role="alert">{error}</p>}</form>}<Link className="back-link" to="/">{text.back} ←</Link></div></main>;
}

function SavedReports({ text, language }) {
	const { savedReports, removeReport } = useSaved();
	return <main className="simple-page saved-page"><div className="saved-heading"><div><p className="eyebrow">DEVLENS</p><h1>{text.saved}</h1></div><span className="saved-total">{String(savedReports.length).padStart(2, "0")} / REPORTS</span></div>{savedReports.length ? <div className="saved-list">{savedReports.map((item) => <article className="saved-item" key={item.username}><img src={item.profile.avatar_url} alt="" /><div className="saved-item-copy"><strong>{item.profile.name || item.username}</strong><span>@{item.username} · {formatDate(item.savedAt, language)}</span></div><Link className="open-report" to={`/?user=${encodeURIComponent(item.username)}`}>{text.view} ↗</Link><button className="remove-button" type="button" onClick={() => removeReport(item.username)} aria-label={`${text.remove}: ${item.username}`}>×</button></article>)}</div> : <div className="saved-empty"><span>✳</span><h2>{text.emptyTitle}</h2><p>{text.emptyText}</p><Link to="/">{text.start} ↗</Link></div>}</main>;
}

export default function App() {
	const [language, setLanguage] = useState(() => localStorage.getItem("devlens_language") === "ar" ? "ar" : "en");
	const text = copy[language];
	useEffect(() => {
		document.documentElement.lang = language;
		document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
		localStorage.setItem("devlens_language", language);
	}, [language]);
	const toggleLanguage = useCallback(() => setLanguage((current) => current === "en" ? "ar" : "en"), []);
	return <div className="app-shell"><Header text={text} language={language} onToggleLanguage={toggleLanguage} /><Routes><Route path="/" element={<Dashboard text={text} language={language} />} /><Route path="/compare" element={<Compare text={text} language={language} />} /><Route path="/login" element={<Login text={text} />} /><Route path="/saved" element={<SavedReports text={text} language={language} />} /><Route path="*" element={<Dashboard text={text} language={language} />} /></Routes></div>;
}
