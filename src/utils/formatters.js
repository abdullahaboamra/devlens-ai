export function formatCompactNumber(value = 0) {
	return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatDate(value) {
	if (!value) return "غير متاح";
	return new Intl.DateTimeFormat("ar", { month: "short", year: "numeric" }).format(new Date(value));
}

export function getInitials(value = "?") {
	return value.trim().slice(0, 2).toUpperCase();
}
