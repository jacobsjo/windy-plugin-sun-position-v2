<script lang="ts">
    import { getMoonPhaseName, radsToDeg } from 'src/util';
    import {
        GetMoonIlluminationResult,
        GetMoonPositionResult,
        GetSunPositionResult,
    } from 'suncalc';

    export var isMoon: boolean = false;
    export var title: string;
    export var pos: GetMoonPositionResult | GetSunPositionResult;
    export var moonIlumination: GetMoonIlluminationResult | undefined = undefined;

    $: moonPhase = getMoonPhaseName(moonIlumination?.phase ?? 0);
</script>

<div class="box">
    <span class="title" class:moon={isMoon}>{title}</span><br />
    <div class="line">
        <span class="label">Azimuth</span>
        <span class="value">{radsToDeg(pos.azimuth).toFixed(1)}°</span>
    </div>
    <div class="line">
        <span class="label">Altitude</span>
        <span class="value">{radsToDeg(pos.altitude).toFixed(1)}°</span>
    </div>
    {#if isMoon && moonIlumination !== undefined}
    <div class="line">
        <span class="label">Illumination</span>
        <span class="value">{(moonIlumination.fraction * 100).toFixed(1)}%</span>
    </div>
    <span class="large-value">{moonPhase}</span>
    {/if}
</div>



<style lang="less">
    .box{
        border-radius: 10pt;
        background-color: rgb(83, 83, 83);
        border: 0.1rem solid rgb(179, 179, 179);
        width: 0;
        flex-grow: 1;
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

    .label {
        display: inline-block;
        width: 8rem;
        text-align: right;
    }

    .value, .large-value{
        color: rgb(255, 255, 201)
    }
</style>
