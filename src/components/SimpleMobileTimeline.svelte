<script lang="ts">
    import { Times } from "src/util";
    import Timeline from "./Timeline.svelte";

    export var time: number;
    export var timezone: string;
    export var zuluMode: boolean;
    export var times: Times;
    export var moonTimes: {rise: Date | undefined, set: Date | undefined}
    export var noonDaytime: boolean
    export var iconByDate: Map<number, [number, number]> | undefined

    var hightlightElement: HTMLElement

    $: time, setTimeout(setHeighlight, 0)
    function setHeighlight(){
        const current: HTMLElement | null = document.querySelector(".timelineEntry.current")
        if (!current) return;
        hightlightElement.style.top = current.offsetTop + "px"
        current.scrollIntoView({behavior: "smooth", block: "center", inline: "center"}) 
    }
</script>

<div class="timeline-box">
    <div bind:this={hightlightElement} class="timeline-hightlight" />
    <div class="timeline">
        <Timeline current={time} timezone={timezone} zuluMode={zuluMode} times={times} moonTimes={moonTimes} noonDaytime={noonDaytime} iconByDate={iconByDate} extend={1} tolerance={600000}/>
    </div>
</div>

<style lang="less">
    .timeline-box {
        width: 100%;
        overflow: scroll;
        position: relative;
    }

    .timeline {
        max-width: 15rem;
        margin: auto;
    }

    .timeline-hightlight {
        position: absolute;
        left: 0.25rem;
        width: calc(100% - 0.5rem);
        height: 1.5rem;
        background-color: rgb(104, 104, 104);
        border: 2px solid rgb(58, 58, 58);
        border-radius: 2rem;
        transform: translateY(-0.1rem);
        transition: top 0.5s;
    }

</style>