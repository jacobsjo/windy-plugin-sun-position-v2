
<script lang="ts">
    import store from "@windy/store";
    import { isNight, time_format } from "src/util";

    export var name: string;
    export var time: number;
    export var id: string;
    export var marker: string = "none";
    export var moon: boolean = false;
    export var moonPhase: number = 6;

    export var timezone: string;
    export var zuluMode: boolean;
    export var iconByDate: Map<number, [number, number]> | undefined;

    function setTime(){
        if (!isNaN(time)){
            store.set('timestamp', time)
        }
    }

        $: selected_icon = iconByDate && !isNaN(time) ? Array.from(iconByDate).reduce((closest, current) => {
        return (Math.abs(closest[0] - time) < Math.abs(current[0] - time) ? closest : current)
    }) : undefined
    
        $: icon_string = selected_icon && Math.abs(selected_icon[0] - time) < 60 * 60 * 1000 ? selected_icon[1][0].toString() + (isNight(id) ? "_night_" + ((selected_icon[1][1] + 3) % 8 + 1).toString() : "") : undefined

</script>

<div class="timelineEntry" class:moon={moon} id={id}>
    <span class="time" >
        {#if !isNaN(time)}
            <a on:click={setTime}>{time_format(time , timezone, zuluMode)}</a>
        {/if}
    </span>
    <span class="{marker}" class:marker={true}/>
    <span class="icon" >
        {#if icon_string}
        <img src="/img/icons6/png_25px/{icon_string}.png" />
        {/if}
    </span>
    <span class="name">{name}</span>
</div>

<style lang="less">

    .timelineEntry {
        display: flex;
        gap: 0.2rem;
        height: 1.1rem;
        color: var(--color);
        align-items: center;
        --markerColor: var(--color);
    }

    .timelineEntry.moon {
        color: rgb(165, 165, 165);
        --markerColor: rgb(165, 165, 165);
    }

    .icon {
        width: 1rem;
        height: 1rem;

        img {
            width: 1rem;
        }
    }

    .time {
        width: 3rem;
        text-align: center;
        a {
            text-decoration: underline;
            text-align: right;
            cursor: pointer;
        }
    }
    
    .marker{
        height: 0rem;
        width: 0.8rem;
        position: relative;
    }

    .marker.major::after{
        content: " ";
        position: absolute;
        height: 0.8rem;
        width: 0.8rem;
        top: -0.4rem;
        border-radius: 1rem;
        background-color: var(--markerColor);
    }

    .marker.minor::after{
        content: " ";
        position: absolute;
        height: 0.25rem;
        width: 0.6rem;
        top: -0.125rem;
        left: 0.075rem;
        background-color: var(--markerColor);
    }

    .marker::before{
        content: " ";
        position: absolute;
        width: 0.2rem;
        height: 1.3rem;
        left: calc(0.4rem - 0.1rem);
        top: 0rem;
        background-color: var(--color);;
    }

</style>