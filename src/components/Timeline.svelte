<script lang="ts">
    import { GetTimesResult } from "suncalc";
    import TimelineEntry from "./TimelineEntry.svelte";
    import { Times } from "src/util";

    const timeframes = [
        'Nighttime',
        'Astronomical Twilight',
        'Nautical Twilight',
        'Blue Hour',
        'Golden Hour',
        'Daytime',
        'Golden Hour',
        'Blue Hour',
        'Nautical Twilight',
        'Astronomical Twilight',
        'Nighttime'
    ]

    export var timezone: string;
    export var zuluMode: boolean

    export var times: Times
    export var moonTimes: {rise: Date, set: Date}
    export var current: Date

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
            {name: 'Moonrise', time: moonTimes.rise?.getTime()},
            {name: 'Moonset', time: moonTimes.set?.getTime()},
            {name: 'Nadir', time: times.nadir.getTime()},
            {name: 'Sunrise', time: times.sunrise.getTime()},
            {name: 'Solar noon', time: times.solarNoon.getTime()},
            {name: 'Sunset', time: times.sunset.getTime()},
        ].filter(a => !isNaN(a.time)).sort((a, b) => a.time - b.time)

        var sortedTimes: { id?: string; name: string; time: number; }[] = []

        var isStart = true;
        var lastId: string | undefined = undefined;
        for (var i = 0; i < t.length ; i++){
            if ((isNaN(t[i].time)) && (!isStart || isNaN(t[i+1]?.time))){
                continue
            }
            isStart = false;

            const time = isNaN(t[i].time) ? 0 : t[i].time
            while (mt.length > 0 && time > mt[0].time){
                sortedTimes.push({id: lastId, name: mt[0].name, time: mt[0].time })
                mt.shift()
            }

            sortedTimes.push(t[i]);
            lastId = t[i].id
        }

        mt.forEach(a => sortedTimes.push({id: lastId, name: a.name, time: a.time }))

        return sortedTimes
    }
</script>

<div class="timeline">
    {#each sortedTimes as timeframe}
        <TimelineEntry isCurrent={false} timezone={timezone} zuluMode={zuluMode} name="{timeframe.name}" time={timeframe.time} id="{timeframe.id ?? ''}"/>      
    {/each}
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