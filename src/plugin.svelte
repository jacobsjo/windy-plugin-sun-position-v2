<script lang="ts">
    import store from '@windy/store';
    import { map } from '@windy/map';
    import { setUrl } from '@windy/location';
    import bcast from '@windy/broadcast';
    import { isMobileOrTablet } from '@windy/rootScope';
    
    import { onDestroy, onMount } from 'svelte';
    import SunCalc from 'suncalc';
    import tzlookup from 'tz-lookup';

    import { singleclick } from '@windy/singleclick';
    import { get as getReverseName } from '@windy/reverseName';
    import { getPointForecastData } from '@windy/fetch';

    import config from './pluginConfig';

    import { Times, mod, time_format } from "./util";
    import AltitudeDiagram from "./components/AltitudeDiagram.svelte";
    import CurrentPosInfobox from "./components/CurrentPosInfobox.svelte";
    import type { LatLon } from '@windy/interfaces';
    import SunDial from './components/SunDial.svelte';
    import Timeline from './components/Timeline.svelte';
    import type { Timestamp } from '@windy/types';
    import Tabber from './components/Tabber.svelte';


    SunCalc.addTime(-4, "blueHourEnd", "blueHour")

    var mounted = false;

    var active_mobile_tab = "current"

//    let time = new Date(2023, 12, 15, 10, 0, 0, 0)
    let time = store.get('timestamp')
    let model = store.get('product')

    var customTimecodeElement = document.createElement('div');
    customTimecodeElement.className = "box"
    customTimecodeElement.id = "custom_timecode"

    function changeTime(_tm: Timestamp){
        time = _tm;
        if (isMobileOrTablet){
            const timecodeElement = document.getElementsByClassName("timecode")[0]
            if (!timecodeElement.children.namedItem('custom_timecode')){
                timecodeElement.insertBefore(customTimecodeElement, timecodeElement.firstChild)
            }

            customTimecodeElement.innerHTML = time_format(time, timezone, zuluMode)
        }
    }


    let pos: LatLon = {lat: 0, lon: 0};

    let reverseName: null | string = null;
    let reverseNameOutdated: boolean = true;

    let iconByDate: Map<number, [number, number]> | undefined = undefined;

    function setPosition(setPos?: any, isDrag: boolean = false): boolean{
        if (setPos && setPos.lat && (setPos.lon || setPos.lng)){
            pos = {lat: setPos.lat, lon: setPos.lon ?? setPos.lng}
            updateMarker()

            if (!isDrag){
                //console.log('settings url')
                setUrl(config.name, pos)

                getReverseName(pos).then(({name, region}) => {
                    reverseName = (region && region !== name) ? `${ name }, ${ region }` : name;
                    reverseNameOutdated = false
                    updateForecastData()
                });




            } else {
                reverseNameOutdated = true
                iconByDate = undefined
            }

            return true
        }
        return false
    }

    function setModel(setModel: string){
        model = setModel
        updateForecastData()
    }

    function updateForecastData(){
        getPointForecastData(model, {lat: pos.lat, lon: pos.lon, step: 1, interpolate: true}, config.name).then((forecast) => {
            const data = forecast.data.data
            const map = new Map<number, [number, number]>()
            for (var i = 0 ; i < data.icon.length; i++){
                map.set(data.origTs[i], [data.icon[i], data.moonPhase[i]])
            }
            iconByDate = map
        }).catch((reason) => {
            iconByDate = undefined
        })
    }

    const dialIcon = L.divIcon({className: 'dial', iconAnchor: [15, 15], iconSize: [30, 30]})
    const dialMarker = L.marker({lat: 0, lng: 0}, {icon: dialIcon, draggable: true})

    dialMarker.on('drag', (evt) => {
        setPosition(dialMarker.getLatLng(), true)
    })

    dialMarker.on('dragend', (evt) => {
        setPosition(dialMarker.getLatLng())
    })


    let zuluMode = store.get('zuluMode') // windy required reload for this to take effect anyways, so no store.on needed

    var dialDiv: Element | null

    var dial: SunDial | undefined;

    $: dial?.$set({
        sunrisePos: sunrisePos,
        sunsetPos: sunsetPos,
        moonrisePos: moonrisePos,
        moonsetPos: moonsetPos,
        sunPos: sunPos,
        moonPos: moonPos
    });

    function updateMarker(){
        if (mounted){
            dialMarker.addTo(map)
            dialMarker.setLatLng({lat: pos?.lat ?? 0, lng: pos?.lon ?? 0})

            dialDiv = document.getElementsByClassName('dial').item(0)!
            if (!dial){
                dial = new SunDial({
                    target: dialDiv,
                    props: {
                        sunrisePos: sunrisePos,
                        sunsetPos: sunsetPos,
                        moonrisePos: moonrisePos,
                        moonsetPos: moonsetPos,
                        sunPos: sunPos,
                        moonPos: moonPos
                    }
                })
            }
        }
    }

    function setTime(event: any){
        store.set('timestamp', event.detail.time)
    }

    $: timezone = tzlookup(pos.lat, pos.lon)

    // get sun directions
    $: times = SunCalc.getTimes(time, pos.lat, pos.lon) as Times;
    $: sunPos = SunCalc.getPosition(time, pos.lat, pos.lon)
    $: sunrisePos = !isNaN(times.sunrise.getTime()) ? SunCalc.getPosition(times.sunrise, pos.lat, pos.lon) : undefined
    $: sunsetPos = !isNaN(times.sunset.getTime()) ? SunCalc.getPosition(times.sunset, pos.lat, pos.lon) : undefined
    $: noonAltitude = SunCalc.getPosition(times.solarNoon, pos.lat, pos.lon).altitude

    // get moon directions
    $: nextNadir = new Date(times.nadir.getTime() + 24 * 60 * 60 * 1000);

    $: moonTimes1 = SunCalc.getMoonTimes(times.nadir, pos.lat, pos.lon) // moon times of first day
    $: moonTimes2 = SunCalc.getMoonTimes(nextNadir, pos.lat, pos.lon) // moon times of second day

    $: moonTimes = {
        rise: (moonTimes1.rise >= times.nadir) ? moonTimes1.rise : (moonTimes2.rise <= nextNadir ? moonTimes2.rise : undefined),
        set: (moonTimes1.set >= times.nadir) ? moonTimes1.set : (moonTimes2.set <= nextNadir ? moonTimes2.set : undefined)
    }

    $: moonPos = SunCalc.getMoonPosition(time, pos.lat, pos.lon)
    $: moonrisePos = moonTimes.rise ? SunCalc.getMoonPosition(moonTimes.rise, pos.lat, pos.lon) : undefined
    $: moonsetPos = moonTimes.set ? SunCalc.getMoonPosition(moonTimes.set, pos.lat, pos.lon) : undefined

    $: moonIllumination = SunCalc.getMoonIllumination(time)

    export const onopen = (params?: Partial<LatLon> ) => {
        if (setPosition(params)) return
        if (setPosition(store.get('pickerLocation'))) return
        const mapCenter = map.getCenter()
        setPosition({lat: mapCenter.lat, lon: mapCenter.lng})
    };

    onMount(() => {
        mounted = true;

        singleclick.on(config.name, setPosition);
        store.on('timestamp', changeTime )
        store.on('product', setModel)
    });

    onDestroy(() => {

        singleclick.off(config.name, setPosition);
        store.off('timestamp', changeTime)
        store.off('product', setModel)

        mounted = false;
        dialMarker.remove()
        dialDiv = null

        if (isMobileOrTablet){
            document.getElementsByClassName("timecode")[0].removeChild(customTimecodeElement)
        }
    });

</script>

{#if !isMobileOrTablet}
<section class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={() => bcast.emit('rqstOpen', 'menu')}
    >
        {config.title}
    </div>
    <h3 class:outdated={reverseNameOutdated}>{ reverseName ?? "..." }</h3>
    <div class="current-time" id=current_time>{ time_format(time, timezone, zuluMode) }</div>
    <div class="infoboxes">
        <CurrentPosInfobox on:setTime={setTime} title="Sun" timezone={timezone} zuluMode={zuluMode} rise={times.sunrise} set={times.sunset} pos={sunPos} />
        <CurrentPosInfobox on:setTime={setTime} isMoon title="Moon" timezone={timezone} zuluMode={zuluMode} rise={moonTimes.rise} set={moonTimes.set} pos={moonPos} moonIlumination={moonIllumination} />
    </div>
    <AltitudeDiagram nadir={times.nadir.getTime()} pos={pos} time={time} moonAltitude={moonPos.altitude} sunAltitude={sunPos.altitude} />
    <div class="timeline-box">
        <Timeline current={time} timezone={timezone} zuluMode={zuluMode} times={times} moonTimes={moonTimes} noonDaytime={noonAltitude > 0} iconByDate={iconByDate}/>
    </div>

    <div class="footnote">
        <div>windy-plugin-sun-position-v2@{config.version}</div>
        <div>by <a href="https://jacobsjo.eu" target="_blank">Jochen Jacobs (@jacobsjo)</a></div>
        <a href="https://community.windy.com/topic/9017/sun-position-plugin" target="_blank">plugin page</a>
        <a href="https://github.com/jacobsjo/windy-plugin-sun-position-v2" target="_blank">GitHub</a>
        <a href="https://github.com/jacobsjo/windy-plugin-sun-position-v2/issues" target="_blank">Report Issue</a>
    </div>

</section>
{:else}
<section class="mobile_ui">
    <Tabber active_tab={active_mobile_tab} on:setTab={(tab) => active_mobile_tab = tab.detail} />
    <div class="mobile_content">
        {#if active_mobile_tab === "current"}
            <div class="infoboxes">
                <CurrentPosInfobox on:setTime={setTime} title="Sun" timezone={timezone} zuluMode={zuluMode} rise={times.sunrise} set={times.sunset} pos={sunPos} />
                <CurrentPosInfobox on:setTime={setTime} isMoon title="Moon" timezone={timezone} zuluMode={zuluMode} rise={moonTimes.rise} set={moonTimes.set} pos={moonPos} moonIlumination={moonIllumination} />
            </div>
        {:else if active_mobile_tab === "diagram"}
            <AltitudeDiagram nadir={times.nadir.getTime()} pos={pos} time={time} moonAltitude={moonPos.altitude} sunAltitude={sunPos.altitude} />
        {:else}
            <div class="mobile-timeline-box">
                <Timeline current={time} timezone={timezone} zuluMode={zuluMode} times={times} moonTimes={moonTimes} noonDaytime={noonAltitude > 0} iconByDate={iconByDate}/>
            </div>
        {/if}
    </div>
</section>
{/if}

<style lang="less">

    // hide the default windy mobile timecode, to display more precise timecode instead
    :global(.timecode :nth-child(2).box) {
        display: none;
    }

    .plugin__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        overflow: scroll;
        padding-bottom: 25pt !important;
    }

    .mobile_ui {
        display: flex;
        flex-direction: column;
        gap: 0rem;
        align-items: center;
        margin-top: -4pt;
        height: 150px;
    }

    .mobile_content {
        height: 0;
        flex-grow: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: scroll;
        padding: 0.3rem;
    }

    @nightColor: black;
    @astroColor: #040438;
    @nauticalColor: #1c1c75;
    @blueColor: rgb(3, 72, 199);
    @goldenColor: orange;
    @dayColor: yellow;
    @moonColor: rgb(148, 148, 148);

    :global([id='night']) {
        --color: @nightColor;
    }

    :global([id='astro']) {
        --color: @astroColor;
    }

    :global([id='nautical']) {
        --color: @nauticalColor;
    }

    :global([id='blue']) {
        --color: @blueColor;
    }

    :global([id='golden']) {
        --color: @goldenColor;
    }

    :global([id='day']) {
        --color: @dayColor;
    }

    :global([id='moon']) {
        --color: @moonColor;
    }

    h3 {
        font-size: large;
        color: #ffe3a1;
        min-height: 2.6rem;
        max-height: 2.6rem;
        margin: 0;
    }

    h3.outdated {
        color: rgb(158, 149, 132);
    }

    .current-time{
        font-size:17pt;
    }

    .infoboxes{
        width: 100%;
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .timeline-box {
        background-color: rgb(90, 90, 90);
        padding: 0.1rem 1rem;
        border-radius: 10px;
        border: 0.1rem solid rgb(179, 179, 179);
        width: 90%;
    }

    .mobile-timeline-box {
        margin-top: -1.2rem;
        margin-bottom: -1.2rem;
    }

    .footnote{
        color: rgb(172, 172, 172);

        a {
            text-decoration: underline;
        }
    }

</style>

