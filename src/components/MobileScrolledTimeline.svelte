
<script lang="ts">
    import { Times, time_format } from "src/util";
    import Timeline from "./Timeline.svelte";
    import store from "@windy/store";
    import config from "src/pluginConfig";

    export var time: number;
    export var timezone: string;
    export var zuluMode: boolean;
    export var times: Times;
    export var moonTimes: {rise: Date | undefined, set: Date | undefined}
    export var noonDaytime: boolean
    export var pauseDragUpdate: boolean = false

    export var iconByDate: Map<number, [number, number]> | undefined

    var lastScrollTimestamp: number = 0

    var timeout = 0

    function onScroll(evt: UIEvent & {currentTarget: EventTarget & HTMLDivElement;}) {
        if (pauseDragUpdate) return
        const currentTarget = evt.currentTarget
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            if (pauseDragUpdate) return
            const timelineElement = currentTarget.children[0]
            var selectedElement = undefined
            for (var child_id = 0 ; child_id < timelineElement.childElementCount; child_id++){
                const child = timelineElement.children[child_id] as HTMLElement
                const distance = Math.abs(child.offsetTop + child.offsetHeight / 2 - (currentTarget.scrollTop + currentTarget.offsetHeight / 2))
                if (distance < 1){
                    selectedElement = child
                    break;
                }
            }

            if (!selectedElement || !selectedElement.dataset.timestamp || !selectedElement.dataset.current) return

            const scrollTimestamp = Number.parseInt(selectedElement.dataset.timestamp)
            if (isNaN(scrollTimestamp)) return

            if (scrollTimestamp !== lastScrollTimestamp){
                store.set("timestamp", Number.parseInt(selectedElement.dataset.timestamp), {UIident: `${config.name}-timeline-drag`})
            }
            lastScrollTimestamp = scrollTimestamp
        }, 50)
    }
</script>

<div class="mobile-timeline-hightlight" />
<div class="mobile-timeline-box" on:scroll={onScroll} class:noScroll={pauseDragUpdate}>
    <Timeline current={time} timezone={timezone} zuluMode={zuluMode} times={times} moonTimes={moonTimes} noonDaytime={noonDaytime} iconByDate={iconByDate} extend={4}/>
</div>


<style lang="less">
    .mobile-timeline-box {
        scroll-snap-type: y mandatory;
        scroll-snap-stop: always;
        -ms-overflow-style: none;
        scrollbar-width: none;
        height: 100%;
        width: 90%;
        padding-left: 3rem;
        overflow: scroll;
        position: relative;
    }

    .mobile-timeline-box.noScroll{
        overflow-y: hidden;
    }

    .mobile-timeline-box::-webkit-scrollbar {
        display: none;
    }

    .mobile-timeline-hightlight {
        position: absolute;
        top: 50%;
        left: 2rem;
        height: 1.5rem;
        transform: translateY(-0.15rem);
        width: calc(100% - 4rem);
        background-color: rgb(104, 104, 104);
        border: 2px solid rgb(58, 58, 58);
        border-radius: 2rem;
    }
</style>