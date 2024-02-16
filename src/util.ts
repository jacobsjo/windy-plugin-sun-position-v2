import { GetTimesResult } from "suncalc";


export function time_format(d: number, timezone: string, zuluMode: boolean): string {
    if (isNaN(d)) {
        return "--:--" + (zuluMode ? "Z" : "");
    }

    const d_local = new Date(new Date(d).toLocaleString("en-US", { timeZone: zuluMode ? "UTC" : timezone }));

    const hours = format_two_digits(d_local.getHours());
    const minutes = format_two_digits(d_local.getMinutes());
    return hours + ":" + minutes + (zuluMode ? "Z" : "");
}

function format_two_digits(n: number) {
    return n < 10 ? '0' + n : n;
}

export function mod(x: number, n: number): number{
    return (x % n + n) % n;
}

const QUARTER_OFFSET = 0.02; //maximum distance from quater moon (including new and full moon) to be considered at quater (in oppose to in between quaters)

const PHASES = ["New Moon", "First Quarter", "Full Moon", "Last Quarter", "New Moon"];
const INBETWEEN_PHASES = ["Waxing Crescent", "Waxing Gibbous", "Waning Gibbous", "Waning Crescent"];

export function getMoonPhaseName(phase: number){
    const inPhase = phase % 0.25;
    if (inPhase < QUARTER_OFFSET) {
        return PHASES[Math.floor(phase * 4)];
    }

    if (inPhase > 0.25 - QUARTER_OFFSET) {
        return PHASES[Math.ceil(phase * 4)];
    }

    return INBETWEEN_PHASES[Math.floor(phase * 4)];
}

export function getSunlightName(altitude: number): [string, string]{
    if (altitude < -18){
        return ["night", "Nighttime"];
    } else if (altitude < -12){
        return ["astro", "Astronomical Twilight"];
    } else if (altitude < -6){
        return ["nautical", "Nautical Twilight"];
    } else if (altitude < -4){
        return ["blue", "Blue Hour"];
    } else if (altitude < 6){
        return ["golden", "Golden Hour"];
    } else {
        return ["day", "Daytime"];
    }
}

export function radsToDeg(rad: number){
    return rad / Math.PI * 180;
}

export type Times = GetTimesResult & {blueHour: Date; blueHourEnd: Date};