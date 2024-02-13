
<script lang="ts">
    import store from "@windy/store";
    import { time_format } from "src/util";

    export var name: string;
    export var startTime: Date;
    export var endTime: Date;

    export var current: Date;
    export var timezone: string;
    export var zuluMode: boolean;

    $: startNaN = isNaN(startTime.getTime())
    $: endNaN = isNaN(endTime.getTime())
    $: isCurrent = (startNaN || startTime <= current) && (endNaN || endTime > current)

    function setTimeToStart(){
        if (!startNaN){
            store.set('timestamp', startTime.getTime())
        }
    }

    function setTimeToEnd(){
        if (!endNaN){
            store.set('timestamp', endTime.getTime() - 1)
        }
    }

</script>

{#if !startNaN || !endNaN}
<div class="timelineEntry" class:current={isCurrent} id={name}>
    <span class="times">
        {#if !startNaN && !endNaN}
            <span on:click={setTimeToStart}>{time_format(startTime.getTime() , timezone, zuluMode)}</span> - <span on:click={setTimeToEnd}>{time_format(endTime.getTime(), timezone, zuluMode)}</span>
        {/if}
        {#if !startNaN && endNaN}
            starting <span on:click={setTimeToStart}>{time_format(startTime.getTime() , timezone, zuluMode)}</span>
        {/if}
        {#if startNaN && !endNaN}
            until <span on:click={setTimeToEnd}>{time_format(endTime.getTime() , timezone, zuluMode)}</span>
        {/if}
    </span>
    <span class="name">{name}</span>
</div>
{/if}

<style lang="less">
    @nightColor: black;
    @astroColor: #040438;
    @nauticalColor: #1c1c75;
    @blueColor: rgb(3, 72, 199);
    @goldenColor: orange;
    @dayColor: yellow;

    .timelineEntry[id='Nighttime'] {
        --color: @nightColor;
    }

    .timelineEntry[id='Astronomical Twilight'] {
        --color: @astroColor;
    }

    .timelineEntry[id='Nautical Twilight'] {
        --color: @nauticalColor;
    }

    .timelineEntry[id='Blue Hour'] {
        --color: @blueColor;
    }

    .timelineEntry[id='Golden Hour'] {
        --color: @goldenColor;
    }

    .timelineEntry[id='Daytime'] {
        --color: @dayColor;
    }

    .timelineEntry {
        display: flex;
        gap: 0.4rem;
        position: relative;
        color: var(--color);
    }

    .times {
        width: 5.8rem;
        text-align: right;
    }

    .times span{
        text-decoration: underline;
        display: inline-block;
        width: 2.3rem;
        text-align: center;
        cursor: pointer;
    }
    


    .timelineEntry.current{
        font-weight: 700;
    }

    .timelineEntry.current::before{
        content: " ";
        position: absolute;
        width: 1rem;
        height: 1rem;
        border-radius: 1rem;
        left: -0.9rem;
        background-color: var(--color);;
    }


</style>