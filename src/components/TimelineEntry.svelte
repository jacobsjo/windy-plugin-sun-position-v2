
<script lang="ts">
    import store from "@windy/store";
    import { time_format } from "src/util";

    export var name: string;
    export var time: number;
    export var id: string;
    export var marker: string = "none";
    export var moon: boolean = false;

    export var timezone: string;
    export var zuluMode: boolean;

    function setTime(){
        if (!isNaN(time)){
            store.set('timestamp', time)
        }
    }

</script>

<div class="timelineEntry" class:moon={moon} id={id}>
    <span class="time" >
        {#if !isNaN(time)}
            <a on:click={setTime}>{time_format(time , timezone, zuluMode)}</a>
        {/if}
    </span>
    <span class="{marker}" class:marker={true}/>
    <span class="name">{name}</span>
</div>

<style lang="less">

    .timelineEntry {
        display: flex;
        gap: 0.4rem;
        height: 1.1rem;
        color: var(--color);
        --markerColor: var(--color);
    }

    .timelineEntry.moon {
        color: rgb(165, 165, 165);
        --markerColor: rgb(165, 165, 165);
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
        height: 0.8rem;
        width: 0.8rem;
        position: relative;
    }

    .marker.major::after{
        content: " ";
        position: absolute;
        height: 0.8rem;
        width: 0.8rem;
        top: 0.2rem;
        border-radius: 1rem;
        background-color: var(--markerColor);
    }

    .marker.minor::after{
        content: " ";
        position: absolute;
        height: 0.25rem;
        width: 0.6rem;
        top: 0.5rem;
        left: 0.075rem;
        background-color: var(--markerColor);
    }

    .marker::before{
        content: " ";
        position: absolute;
        width: 0.2rem;
        height: 1.3rem;
        left: calc(0.4rem - 0.1rem);
        top: 0.5rem;
        background-color: var(--color);;
    }


</style>