<script lang="ts">
    import store from '@windy/store';
    import { map } from '@windy/map';
    import { setUrl } from '@windy/location';
    import bcast from '@windy/broadcast';
    import { onDestroy, onMount } from 'svelte';
    import SunCalc from 'suncalc';
    import tzlookup from 'tz-lookup';

    import { singleclick } from '@windy/singleclick';
    import { get as getReverseName } from '@windy/reverseName';

    import config from './pluginConfig';

    import { Times, time_format } from "./util";
    import AltitudeDiagram from "./components/AltitudeDiagram.svelte";
    import CurrentPosInfobox from "./components/CurrentPosInfobox.svelte";
    import type { LatLon } from '@windy/interfaces';
    import SunDial from './components/SunDial.svelte';
    import Timeline from './components/Timeline.svelte';
    import type { Timestamp } from '@windy/types';


    SunCalc.addTime(-4, "blueHourEnd", "blueHour")

//    let showPhotoSun = true
//    let showAstroSun = true
//    let showMoon = true

    var mounted = false;

//    let time = new Date(2023, 12, 15, 10, 0, 0, 0)
    let time = store.get('timestamp')

    const changeTime = (_tm: Timestamp) => time = _tm;

    let pos: LatLon = {lat: 0, lon: 0};

    let reverseName: null | string = null;
    let reverseNameOutdated: boolean = true;

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
                });
            } else {
                reverseNameOutdated = true
            }

            return true
        }
        return false
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
    });

    onDestroy(() => {

        singleclick.off(config.name, setPosition);
        store.off('timestamp', changeTime)

        mounted = false;
        dialMarker.remove()
        dialDiv = null
    });

</script>

<!--
<div class="options">
    <ImageCheckbox enabled={showAstroSun} title="Show sun details (astronomical)" emote="&#x1f52d;" />
    <ImageCheckbox enabled={showPhotoSun} title="Show sun details (photography)" emote="&#x1f4f7;" />
    <ImageCheckbox enabled={showMoon} title="Show moon details" isMoon emote="&#x263E;" />
</div>
<div class="timeline"></div>

-->


<section class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={() => bcast.emit('rqstOpen', 'menu')}
    >
        {config.title}
    </div>
    <h3 class:outdated={reverseNameOutdated}>{ reverseName ?? "..." }</h3>

    <div class="current">
        <div class="current-time" id=current_time>{ time_format(time, timezone, zuluMode) }</div>
        <div class="infoboxes">
            <CurrentPosInfobox on:setTime={setTime} title="Sun" timezone={timezone} zuluMode={zuluMode} rise={times.sunrise} set={times.sunset} pos={sunPos} />
            <CurrentPosInfobox on:setTime={setTime} isMoon title="Moon" timezone={timezone} zuluMode={zuluMode} rise={moonTimes.rise} set={moonTimes.set} pos={sunPos} moonIlumination={moonIllumination} />
        </div>
        <AltitudeDiagram nadir={times.nadir.getTime()} pos={pos} time={time} moonAltitude={moonPos.altitude} sunAltitude={sunPos.altitude} />
        <Timeline current={time} timezone={timezone} zuluMode={zuluMode} times={times} moonTimes={moonTimes} noonDaytime={noonAltitude > 0} />
    </div>

    <div class="footnote">
        <div>windy-plugin-sun-position-v2@{config.version}</div>
        <div>by <a href="https://jacobsjo.eu" target="_blank">Jochen Jacobs (@jacobsjo)</a></div>
        <a href="https://community.windy.com/topic/9017/sun-position-plugin" target="_blank">plugin page</a>
        <a href="https://github.com/jacobsjo/windy-plugin-sun-position-v2" target="_blank">GitHub</a>
        <a href="https://github.com/jacobsjo/windy-plugin-sun-position-v2/issues" target="_blank">Report Issue</a>
    </div>

</section>

<style lang="less">

    section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
/*.options{
    display: flex;
    flex-direction: row;
    gap: 0.4rem;
    justify-content: center;
}*/

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
        height: 2.6rem;
        margin: 0;
    }

    h3.outdated {
        color: rgb(158, 149, 132);
    }

    .current {
        // Let's prepare the plugin for mobile UI also
        // and use relative sizes as much as possible
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
    }

    .current-time{
        font-size:17pt;
    }

    .infoboxes{
        width: 100%;
        display: flex;
        gap: 1rem;
    }

    .footnote{
        color: rgb(172, 172, 172);

        a {
            text-decoration: underline;
        }
    }

</style>

