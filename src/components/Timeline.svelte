<script lang="ts">
    import TimelineEntry from "./TimelineEntry.svelte";
    import { Times } from "src/util";

    export var timezone: string;
    export var zuluMode: boolean

    export var times: Times
    export var current: Date

    $: nightExists = !isNaN(times.nightEnd.getTime())
    $: noonExists = !isNaN(times.goldenHourEnd.getTime())

    $: astronomicalTwilightIsMax = isNaN(times.nauticalDawn.getTime()) && nightExists
    $: nauticalTwilightIsMax = isNaN(times.dawn.getTime()) && nightExists
    $: blueHourIsMax = isNaN(times.blueHourEnd.getTime()) && nightExists
    $: goldenHourIsMax = !noonExists && nightExists

    $: allDayDaytime = !noonExists && !nightExists
</script>

<div class="timeline">
    <TimelineEntry current={current} timezone={timezone} zuluMode={zuluMode} name="Nighttime" startTime={new Date(NaN)} endTime={times.nightEnd}/>      
    <TimelineEntry current={current} timezone={timezone} zuluMode={zuluMode} name="Astronomical Twilight" startTime={times.nightEnd} endTime={!astronomicalTwilightIsMax ? times.nauticalDawn : times.night}/>      
    {#if !astronomicalTwilightIsMax}   
        <TimelineEntry current={current} timezone={timezone} zuluMode={zuluMode} name="Nautical Twilight" startTime={times.nauticalDawn} endTime={!nauticalTwilightIsMax ? times.dawn : times.nauticalDusk}/>      
        {#if !nauticalTwilightIsMax}   
            <TimelineEntry current={current} timezone={timezone} zuluMode={zuluMode} name="Blue Hour" startTime={times.dawn} endTime={!blueHourIsMax ? times.blueHourEnd : times.dusk}/>   
            {#if !blueHourIsMax}   
                <TimelineEntry current={current} timezone={timezone} zuluMode={zuluMode} name="Golden Hour" startTime={times.blueHourEnd} endTime={!goldenHourIsMax ? times.goldenHourEnd : times.blueHour}/>      
                {#if !goldenHourIsMax}
                    {#if !allDayDaytime}
                        <TimelineEntry current={current} timezone={timezone} zuluMode={zuluMode} name="Daytime" startTime={times.goldenHourEnd} endTime={times.goldenHour}/>      
                    {/if}
                    <TimelineEntry current={current} timezone={timezone} zuluMode={zuluMode} name="Golden Hour" startTime={times.goldenHour} endTime={times.blueHour}/>      
                {/if}
                <TimelineEntry current={current} timezone={timezone} zuluMode={zuluMode} name="Blue Hour" startTime={times.blueHour} endTime={times.dusk}/>      
            {/if}
            <TimelineEntry current={current} timezone={timezone} zuluMode={zuluMode} name="Nautical Twilight" startTime={times.dusk} endTime={times.nauticalDusk}/>      
        {/if}
        <TimelineEntry current={current} timezone={timezone} zuluMode={zuluMode} name="Astronomical Twilight" startTime={times.nauticalDusk} endTime={times.night}/>      
    {/if}
    <TimelineEntry current={current} timezone={timezone} zuluMode={zuluMode} name="Nighttime" startTime={times.night} endTime={ new Date(NaN)}/>      
    {#if allDayDaytime}
        <div id="Daytime">24h Daytime</div>
    {/if}
</div>

<style lang="less">
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;

        width: 18rem;

        background-color: rgb(110, 110, 110);
        padding: 0.1rem 1rem;
        border-radius: 10px;
        border: 0.1rem solid rgb(179, 179, 179);

        .gap {
            height: 0.5rem;
        }

    }

    #Daytime {
        color: yellow;
        text-align: center;
        width: 10rem;
    }
</style>