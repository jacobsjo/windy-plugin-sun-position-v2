<script lang="ts">
    import { GetMoonPositionResult, GetSunPositionResult } from "suncalc";

    const SIZE = 300;
    const MID = SIZE/2;

    export var sunrisePos: GetSunPositionResult | undefined
    export var sunsetPos: GetSunPositionResult | undefined
    export var moonrisePos: GetMoonPositionResult | undefined
    export var moonsetPos: GetMoonPositionResult | undefined
    export var sunPos: GetSunPositionResult
    export var moonPos: GetMoonPositionResult

    $: sunLineLenght = sunPos.altitude > 0 ? Math.cos(sunPos.altitude) * MID : MID;
    $: sunOppacity = sunPos.altitude > 0 ? 1 : sunPos.altitude > -0.1 ? 1 + 10 * sunPos.altitude : 0;

    $: moonLineLenght = moonPos.altitude > 0 ? Math.cos(moonPos.altitude) * MID : MID;
    $: moonOppacity = moonPos.altitude > 0 ? 1 : moonPos.altitude > -0.1 ? 1 + 10 * moonPos.altitude : 0;

    $: sunX = MID - Math.sin(sunPos.azimuth) * sunLineLenght
    $: sunY = MID + Math.cos(sunPos.azimuth) * sunLineLenght
    $: moonX = MID - Math.sin(moonPos.azimuth) * moonLineLenght
    $: moonY = MID + Math.cos(moonPos.azimuth) * moonLineLenght

</script>

<svg width="{SIZE}" height="{SIZE}">
    {#if sunrisePos} <line class="sunRiseSet" x1="{MID}" y1="{MID}" x2="{MID - Math.sin(sunrisePos.azimuth) * MID}" y2="{MID + Math.cos(sunrisePos.azimuth) * MID}" /> {/if}
    {#if sunsetPos} <line class="sunRiseSet" x1="{MID}" y1="{MID}" x2="{MID - Math.sin(sunsetPos.azimuth) * MID}" y2="{MID + Math.cos(sunsetPos.azimuth) * MID}" /> {/if}
    {#if moonrisePos} <line class="moonRiseSet" x1="{MID}" y1="{MID}" x2="{MID - Math.sin(moonrisePos.azimuth) * MID}" y2="{MID + Math.cos(moonrisePos.azimuth) * MID}" /> {/if}
    {#if moonsetPos} <line class="moonRiseSet" x1="{MID}" y1="{MID}" x2="{MID - Math.sin(moonsetPos.azimuth) * MID}" y2="{MID + Math.cos(moonsetPos.azimuth) * MID}" /> {/if}

    <line class="sunLine" x1="{MID}" y1="{MID}" x2="{sunX}" y2="{sunY}" stroke-opacity="{sunOppacity}" />
    <line class="moonLine" x1="{MID}" y1="{MID}" x2="{moonX}" y2="{moonY}" stroke-opacity="{moonOppacity}" />
    <circle class="sunCircle" r="4" cx="{sunX}" cy="{sunY}" fill-opacity={sunOppacity} />
    <circle class="moonCircle" r="4" cx="{moonX}" cy="{moonY}" fill-opacity={moonOppacity}/>
    <circle class="center" r="6" cx="{MID}" cy="{MID}"/>
</svg>

<style lang="less">
    @sunDasharray: 10 2 1 2;
    @moonDasharray: 0 1 2 2 3 2 3 1;

    svg {
        z-index: 1000000;
        position: absolute;
        left: calc(-150px + 15px);
        top: calc(-150px + 15px);
        width: 300px;
        height: 300px;
        pointer-events: none !important;

        * {
            pointer-events: none !important;
        }

        .sunLine {
            stroke: rgba(68, 65, 65, 0.84);
            stroke-width: 3;
        }

        .moonLine {
            stroke: rgba(68, 65, 65, 0.84);
            stroke-width: 3;
        }

        .sunCircle {
            fill: yellow;
        }

        .moonCircle {
            fill: gray;
        }

        .center {
            fill: rgba(68, 65, 65, 0.84);;
        }

        .sunRiseSet,
        .moonRiseSet {
            stroke: rgba(68, 65, 65, 0.84);
            stroke-width: 2;
            stroke-dasharray: @sunDasharray;
            pointer-events: auto;
        }

        .moonRiseSet {
            stroke-dasharray: @moonDasharray;
        }

        #hover.sunRiseSet,
        #hover.moonRiseSet {
            stroke-width: 4;
        }
    }
</style>
