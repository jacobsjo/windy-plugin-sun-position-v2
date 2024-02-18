<script lang="ts">
    import TimelineEntry from "./TimelineEntry.svelte";
    import { Times } from "src/util";

    export var extend: number; // extend timeline up and down in entry count

    export var timezone: string;
    export var zuluMode: boolean

    export var times: Times
    export var noonDaytime: boolean
    export var moonTimes: {rise: Date | undefined, set: Date | undefined}
    export var current: number

    export var iconByDate: Map<number, [number, number]> | undefined

    $: sortedTimes = composeTimes(times)

    function composeTimes(times: Times){
        const t = [
            {id:'night', name: 'Nighttime', time: NaN},
            {id:'astro', name: 'Astronomical Twilight', time: times.nightEnd.getTime()},
            {id:'nautical', name: 'Nautical Twilight', time: times.nauticalDawn.getTime()},
            {id:'blue', name: 'Blue Hour', time: times.dawn.getTime()},
            {id:'golden', name: 'Golden Hour', time: times.blueHourEnd.getTime()},
            {id:'day', name: 'Daytime', time: times.goldenHourEnd.getTime()},
            {id:'golden', name: 'Golden Hour', time: times.goldenHour.getTime()},
            {id:'blue', name: 'Blue Hour', time: times.blueHour.getTime()},
            {id:'nautical', name: 'Nautical Twilight', time: times.dusk.getTime()},
            {id:'astro', name: 'Astronomical Twilight', time: times.nauticalDusk.getTime()},
            {id:'night', name: 'Nighttime', time: times.night.getTime()},
        ]

        const mt = [
            {name: 'Moonrise', time: moonTimes.rise?.getTime() ?? NaN, moon: true},
            {name: 'Moonset', time: moonTimes.set?.getTime() ?? NaN, moon: true},
            {name: 'Nadir', time: times.nadir.getTime()},
            {name: 'Sunrise', time: times.sunrise.getTime()},
            {name: 'Solar noon', time: times.solarNoon.getTime()},
            {name: 'Sunset', time: times.sunset.getTime()},
        ].filter(a => !isNaN(a.time)).sort((a, b) => a.time - b.time)

        var sortedTimes: { id: string; name: string; time: number; moon?: boolean, minor?: boolean }[] = []

        var isStart = true;
        var lastId: string | undefined = undefined;
        for (var i = 0; i < t.length ; i++){
            if ((isNaN(t[i].time)) && (!isStart || isNaN(t[i+1]?.time))){
                continue
            }
            isStart = false;

            const time = isNaN(t[i].time) ? 0 : t[i].time
            while (mt.length > 0 && time > mt[0].time){
                sortedTimes.push({id: lastId!, name: mt[0].name, time: mt[0].time, moon: mt[0].moon, minor: true })
                mt.shift()
            }

            sortedTimes.push({id: t[i].id, name: t[i].name, time: t[i].time});
            lastId = t[i].id
        }

        if (lastId === undefined){
            if (noonDaytime){
                sortedTimes.push({id:'day', name: 'Daytime', time: NaN})
                lastId = 'day'
            } else {
                sortedTimes.push({id:'night', name: 'Nighttime', time: NaN})
                lastId = 'night'
            }
        }

        mt.forEach(a => sortedTimes.push({id: lastId!, name: a.name, time: a.time, moon: a.moon, minor: true}))

        return sortedTimes
    }

    $: selectedTimestamp = sortedTimes.reduce((last, t) => (!isNaN(t.time) && (t.time <= current + 100 || last === undefined)) ? t : last, undefined)?.time
</script>

<div class="timeline">
    {#each Array(extend) as _}
        <TimelineEntry timezone={timezone} zuluMode={zuluMode} iconByDate={iconByDate} name="" time={NaN} data="{sortedTimes[0].id ?? ''}" marker="none"/>      
    {/each}
    {#each sortedTimes as timeframe}
        {#if timeframe.minor}
            <TimelineEntry isCurrent={timeframe.time === selectedTimestamp} timezone={timezone} zuluMode={zuluMode} iconByDate={iconByDate} name="{timeframe.name}" time={timeframe.time} data="{timeframe.id ?? ''}" moon={timeframe.moon ?? false} marker="minor"/>      
        {/if}
        {#if !timeframe.minor}
            {#if !isNaN(timeframe.time)}
                <TimelineEntry isCurrent={timeframe.time === selectedTimestamp} timezone={timezone} zuluMode={zuluMode} iconByDate={iconByDate} name="" time={timeframe.time} data="{timeframe.id ?? ''}" marker="major"/>      
            {/if}
            <TimelineEntry timezone={timezone} zuluMode={zuluMode} iconByDate={iconByDate} name="{timeframe.name}" time={NaN} data="{timeframe.id ?? ''}" marker="none"/>      
        {/if}

    {/each}
    {#each Array(extend - 1) as _}
        <TimelineEntry timezone={timezone} zuluMode={zuluMode} iconByDate={iconByDate} name="" time={NaN} data="{sortedTimes[sortedTimes.length - 1].id ?? ''}" marker="none"/>      
    {/each}
</div>

<style lang="less">
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 0rem;

        .gap {
            height: 8px;
        }

        padding-bottom: 1.1rem;

    }

    #Daytime {
        color: yellow;
        text-align: center;
        width: 10rem;
    }
</style>