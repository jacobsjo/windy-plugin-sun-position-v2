
<script lang="ts">
    import store from "@windy/store";
    import { time_format } from "src/util";

    export var name: string;
    export var time: number;
    export var id: string;

    export var isCurrent: boolean;
    export var timezone: string;
    export var zuluMode: boolean;

    function setTime(){
        if (!isNaN(time)){
            store.set('timestamp', time)
        }
    }

</script>

<div class="timelineEntry" class:current={isCurrent} id={id}>
    <span class="times">
        {#if !isNaN(time)}
            <span on:click={setTime}>{time_format(time , timezone, zuluMode)}</span>
        {/if}
    </span>
    <span class="name">{name}</span>
</div>

<style lang="less">

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