<script lang="ts">
    import { getMoonPhaseName, getSunlightName, radsToDeg, time_format } from 'src/util';
    import {
        GetMoonIlluminationResult,
        GetMoonPositionResult,
        GetSunPositionResult,
    } from 'suncalc';
    import { setTime } from 'src/util';

    export var isMoon: boolean = false;
    export var timezone: string;
    export var zuluMode: boolean;
    export var title: string;
    export var pos: GetMoonPositionResult | GetSunPositionResult;
    export var rise: Date | undefined;
    export var set: Date | undefined;
    export var moonIlumination: GetMoonIlluminationResult | undefined = undefined;

    $: moonPhase = getMoonPhaseName(moonIlumination?.phase ?? 0);
    $: sunlight = getSunlightName(radsToDeg(pos.altitude));
</script>

<div class="box">
    <span class="title" class:moon={isMoon}>{title}</span>
    <div class="line">
        <span class="small-label" title="{title}rise">↗</span>
        <span class="value linked" on:click={() => setTime(rise, `current`)}>{time_format(rise?.getTime() ?? NaN, timezone, zuluMode)}</span>
        <span class="small-label" title="{title}set">↘</span>
        <span class="value linked" on:click={() => setTime(set, `current`)}>{time_format(set?.getTime() ?? NaN, timezone, zuluMode)}</span>
    </div>
    <div class="line">
        <span class="small-label" title="Azimith">🧭</span>
        <span class="value">{radsToDeg(pos.azimuth).toFixed(1)}°</span>
        <span class="small-label" title="Altitude">∡</span>
        <span class="value">{radsToDeg(pos.altitude).toFixed(1)}°</span>
    </div>
    {#if isMoon && moonIlumination !== undefined}
    <div class="line">
        <span class="label">Illumination</span>
        <span class="value">{(moonIlumination.fraction * 100).toFixed(1)}%</span>
    </div>
    <span class="large-value">{moonPhase}</span>
    {/if}
    {#if !isMoon}
    <span class="large-value sunlight" data-sunphase="{sunlight[0]}">{sunlight[0] == "astro" ? "Astron. Twilight" : sunlight[1]}</span>
    {/if}
</div>



<style lang="less">
    .box{
        border-radius: 10pt;
        background-color: rgb(83, 83, 83);
        border: 0.1rem solid rgb(179, 179, 179);
        width: 0;
        flex-grow: 1;
        max-width: 10rem;
        display: flex;
        padding: 0.2rem;
        padding-top: 0.4rem;
        gap: 0.15rem;
        flex-direction: column;
        align-items: center;
    }

    .title {
        display: inline-block;
    }

    .title::before {
        content: ' ';
        display: inline-block;
        width: 15pt;
        height: 15pt;
        margin-bottom: -4pt;
        border-radius: 7pt;
        margin-right: 10pt;
        background-color: yellow;
    }

    .title.moon::before {
        background-color: gray;
    }

    .line {
        width: 100%;
        display: flex;
        gap: 0.4rem;
        align-items: center;
    }

    .value {
        display: inline-block;
        text-align: left;
        width: 5rem;
        
    }

    .linked {
        text-decoration: underline;
        cursor: pointer;
    }

    .linked:hover {
        color: rgb(253, 253, 141)
    }

    .linked.selected {
        color: rgb(218, 218, 80);
    }

    .label {
        display: inline-block;
        width: 8rem;
        text-align: right;
    }

    .small-label {
        display: inline-block;
        width: 2rem;
    }

    .value, .large-value{
        color: rgb(255, 255, 201);
        white-space: nowrap;
    }

    .sunlight {
        color: var(--color);
    }
</style>
