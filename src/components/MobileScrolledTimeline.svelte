
<script lang="ts">
    import { Times } from "src/util";
    import Timeline from "./Timeline.svelte";
    import store from "@windy/store";
    import config from "src/pluginConfig";

    export var time: number;
    export var timezone: string;
    export var zuluMode: boolean;
    export var times: Times;
    export var moonTimes: {rise: Date | undefined, set: Date | undefined}
    export var noonDaytime: boolean

    export var iconByDate: Map<number, [number, number]> | undefined

    var lastScrollTimestamp: number = 0

    var timeout = 0

    var box: HTMLElement | undefined = undefined

    var first = true;
    var isScrolling = false;

    $: time, isScrolling, setTimeout(setHeighlight, 0)
    function setHeighlight(){
        if (isScrolling) return
        const current: HTMLElement | null = document.querySelector(".timelineEntry.current")
        if (!current) return;
        current.scrollIntoView({behavior: "instant", block: "center", inline: "center"})        
        first = false
    }

    function onScroll(evt: UIEvent & {currentTarget: EventTarget & HTMLDivElement;}) {
        if (first) return
        isScrolling = true;
        clearTimeout(timeout)
        timeout = setTimeout(selectByScroll, 50)
    }

    function selectByScroll(){

        if (!box) return
        const timelineElement = box.children[0]
        var selectedElement = undefined
        for (var child_id = 0 ; child_id < timelineElement.childElementCount; child_id++){
            const child = timelineElement.children[child_id] as HTMLElement
            const distance = Math.abs(child.offsetTop + child.offsetHeight / 2 - (box.scrollTop + box.offsetHeight / 2))
            if (distance < 1){
                selectedElement = child
                break;
            }
        }

        if (!selectedElement || !selectedElement.dataset.timestamp || !selectedElement.dataset.current) return
        isScrolling = false
        if (selectedElement.classList.contains('current')) return

        const scrollTimestamp = Number.parseInt(selectedElement.dataset.timestamp)
        if (isNaN(scrollTimestamp)) return

        if (scrollTimestamp !== lastScrollTimestamp){
            store.set("timestamp", Number.parseInt(selectedElement.dataset.timestamp), {UIident: `${config.name}-timeline-drag`})
        }
        lastScrollTimestamp = scrollTimestamp

    }
</script>

<div class="mobile-timeline-hightlight" />
<div class="mobile-timeline-box" on:scroll={onScroll} bind:this={box}>
    <Timeline current={time} timezone={timezone} zuluMode={zuluMode} times={times} moonTimes={moonTimes} noonDaytime={noonDaytime} iconByDate={iconByDate} extend={4}/>
</div>


<style lang="less">
    .mobile-timeline-box {
        scroll-snap-type: y mandatory;
        scroll-snap-stop: always;
        -ms-overflow-style: none;
        scrollbar-width: none;
        width: 90%;
        padding-left: 3rem;
        overflow: scroll;
        position: relative;
        margin-top: -1.5rem;
        margin-bottom: -1.5rem;
    }

    .mobile-timeline-box::-webkit-scrollbar {
        display: none;
    }

    .mobile-timeline-hightlight {
        position: absolute;
        top: 50%;
        left: 2rem;
        height: 1.5rem;
        transform: translateY(-0.1rem);
        width: calc(100% - 4rem);
        background-color: rgb(104, 104, 104);
        border: 2px solid rgb(58, 58, 58);
        border-radius: 2rem;
    }
</style>