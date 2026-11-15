/** 75 -> "1:15", 3725 -> "1:02:05". Returns null for unknown (0) durations. */
export function formatDuration(totalSeconds: number | null | undefined): string | null {
    if (!totalSeconds || totalSeconds < 1) return null;
    const s = Math.round(totalSeconds);
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

/** ISO 8601 duration for structured data, e.g. "PT75S". */
export function isoDuration(totalSeconds: number | null | undefined): string | undefined {
    if (!totalSeconds || totalSeconds < 1) return undefined;
    return `PT${Math.round(totalSeconds)}S`;
}

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 365 * 24 * 3600],
    ["month", 30 * 24 * 3600],
    ["week", 7 * 24 * 3600],
    ["day", 24 * 3600],
    ["hour", 3600],
    ["minute", 60],
];

/** "3 days ago", "last month". Compute on the server and pass the string down. */
export function formatRelativeDate(date: Date, now: Date = new Date()): string {
    const diffSeconds = (date.getTime() - now.getTime()) / 1000;
    for (const [unit, unitSeconds] of RELATIVE_UNITS) {
        if (Math.abs(diffSeconds) >= unitSeconds) {
            return relativeFormatter.format(Math.round(diffSeconds / unitSeconds), unit);
        }
    }
    return "just now";
}

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

/** "Nov 15, 2026" */
export function formatDate(date: Date): string {
    return dateFormatter.format(date);
}

/** 734003200 -> "700 MB" */
export function formatBytes(bytes: number): string {
    const units = ["bytes", "KB", "MB", "GB", "TB"];
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024;
        unit++;
    }
    const digits = value >= 10 || unit === 0 ? 0 : 1;
    return `${value.toFixed(digits)} ${units[unit]}`;
}
