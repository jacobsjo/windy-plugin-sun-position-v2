<script lang="ts">
    import store from '@windy/store';
    import { map } from '@windy/map';
    import picker from '@windy/picker';
    import { setUrl } from '@windy/location';
    import { onDestroy, onMount } from 'svelte';
    import SunCalc from 'suncalc';
    import tzlookup from 'tz-lookup';

    import config from './pluginConfig';
    const { name } = config;

//    const { title } = config;
//    import ImageCheckbox from "./components/ImageCheckbox.svelte";
    import { Times, time_format } from "./util";
    import AltitudeDiagram from "./components/AltitudeDiagram.svelte";
    import CurrentPosInfobox from "./components/CurrentPosInfobox.svelte";
    import { LatLon } from '@windycom/plugin-devtools/types/interfaces';
    import SunDial from './components/SunDial.svelte';
    import Timeline from './components/Timeline.svelte';


    SunCalc.addTime(-4, "blueHourEnd", "blueHour")

//    let showPhotoSun = true
//    let showAstroSun = true
//    let showMoon = true

    var mounted = false;

    var showTimeline = false;

//    let time = new Date(2023, 12, 15, 10, 0, 0, 0)
    let time = store.get('timestamp')
    store.on('timestamp', ovr => time = ovr)


    let pos: LatLon = {lat: 0, lon: 0};

    function setPosition(setPos?: any): boolean{
        if (setPos && setPos.lat && setPos.lon){
            pos = {lat: setPos.lat, lon: setPos.lon}
            updateMarker()
            return true
        }
        return false
    }

    picker.emitter.on('pickerOpened', (ovr: LatLon) => {
        setPosition(ovr)
    })

    picker.emitter.on('pickerMoved', (ovr: LatLon) => {
        setPosition(ovr)
    })

    store.on('detailLocation', (ovr) => {
        if (ovr){
            setPosition(ovr)
        }
    })

    const dialIcon = L.divIcon({className: 'dial', iconAnchor: [0, 0], iconSize: [200, 200]})
    const dialMarker = L.marker({lat: 0, lng: 0}, {icon: dialIcon})

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
            dial?.$destroy()
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

    function setTime(event: any){
        store.set('timestamp', event.detail.time)
    }
    
    $: timezone = tzlookup(pos.lat, pos.lon)

    // get sun directions
    $: times = SunCalc.getTimes(time, pos.lat, pos.lon) as Times;
    $: sunPos = SunCalc.getPosition(time, pos.lat, pos.lon)
    $: sunrisePos = SunCalc.getPosition(times.sunrise, pos.lat, pos.lon)
    $: sunsetPos = SunCalc.getPosition(times.sunset, pos.lat, pos.lon)

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
    
    $: setUrl(name, {lat: pos.lat, lon: pos.lon, showtimeline: showTimeline ? "showTimeline" : "hideTimeline"})

    export const onopen = (params?: Partial<LatLon & {showtimeline: string}> ) => {
        if (params?.showtimeline){
            console.log(params.showtimeline)
            showTimeline = params.showtimeline === "showTimeline";
        }

        if (setPosition(params)) return
        if (setPosition(store.get('pickerLocation'))) return
        const mapCenter = map.getCenter()
        setPosition({lat: mapCenter.lat, lon: mapCenter.lng})
    };

    onMount(() => {
        mounted = true;
    });

    onDestroy(() => {
        mounted = false;
        dialMarker.remove()
        dialDiv = null
        console.log(showTimeline)
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

<!--div class="footnote">
    <div>windy-plugin-sun-position@<span class=plugin-version></span></div>
    <div>by Jochen Jacobs (@jacobsjo)</div><br />
    <a href="https://community.windy.com/topic/9017/sun-position-plugin">plugin page</a>
    <a href="https://github.com/jacobsjo/windy-plugin-sun-position">GitHub</a>
</div-->

<div class="current">
    <AltitudeDiagram nadir={times.nadir.getTime()} pos={pos} time={time} moonAltitude={moonPos.altitude} sunAltitude={sunPos.altitude} />
    <div class="current-time" id=current_time>{ time_format(time, timezone, zuluMode) }</div>
    <div class="infoboxes">
        <CurrentPosInfobox on:setTime={setTime} on:showTimeline={(evt) => showTimeline = evt.detail.enabled} showTimeline={showTimeline} title="Sun" timezone={timezone} zuluMode={zuluMode} rise={times.sunrise} set={times.sunset} pos={sunPos} />
        <CurrentPosInfobox on:setTime={setTime} isMoon title="Moon" timezone={timezone} zuluMode={zuluMode} rise={moonTimes.rise} set={moonTimes.set} pos={sunPos} moonIlumination={moonIllumination} />
    </div>
    {#if showTimeline}
        <Timeline current={time} timezone={timezone} zuluMode={zuluMode} times={times} />
    {/if}
</div>

<style lang="less">
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

    :global([id='Nighttime']) {
        --color: @nightColor;
    }

    :global([id='Astronomical Twilight']) {
        --color: @astroColor;
    }

    :global([id='Nautical Twilight']) {
        --color: @nauticalColor;
    }

    :global([id='Blue Hour']) {
        --color: @blueColor;
    }

    :global([id='Golden Hour']) {
        --color: @goldenColor;
    }

    :global([id='Daytime']) {
        --color: @dayColor;
    }


.current {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 290px;
    gap: 0.5rem;
    max-height: calc(100vh - 22rem);
    overflow-y: scroll;
}

.current-time{
    font-size:20pt;
}

.infoboxes{
    width: 100%;
    display: flex;
    gap: 1rem;
}

</style>

