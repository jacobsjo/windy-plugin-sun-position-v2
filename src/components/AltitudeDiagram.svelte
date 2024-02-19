<script lang="ts">
    import { LatLon } from '@windycom/plugin-devtools/types/interfaces';
    import SunCalc from 'suncalc';

    const WIDTH = 400;
    const HEIGHT = 150;
    const SECONDS_IN_DAY: number = 24 * 60 * 60 * 1000;
    const STEPS = 100
    const STEP_SIZE = 24.0 * 60 * 60 * 1000 / STEPS

    function LINE(data: [number, number][]){
        return 'M' + data.map(d => (d[0] * WIDTH) + "," + ((d[1]/ Math.PI + 0.5) * HEIGHT)).join('L');
    }


    export var nadir: number;
    export var time: number;
    export var pos: LatLon;
    export var sunAltitude: number;
    export var moonAltitude: number;

    $: markerXPos = (time - nadir) / SECONDS_IN_DAY * WIDTH
    $: sunYPos = -(sunAltitude / Math.PI - 0.5) * HEIGHT
    $: moonYPos = -(moonAltitude / Math.PI - 0.5) * HEIGHT

    $: sunData = Array(STEPS).fill(0).map((_, i) => [1.0 * i / STEPS, -SunCalc.getPosition(new Date(nadir + STEP_SIZE * i), pos.lat, pos.lon).altitude] as [number, number])
    $: moonData = Array(STEPS).fill(0).map((_, i) => [1.0 * i / STEPS, -SunCalc.getMoonPosition(new Date(nadir + STEP_SIZE * i), pos.lat, pos.lon).altitude] as [number, number])


</script>

<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="sun-path">
    <path id=sun_path d={LINE(sunData)} />
    <path id=moon_path d={LINE(moonData)}  />
    <path id=horizon d="M 0 {HEIGHT/2} H {WIDTH}" />
    <circle id=moon cx="{markerXPos}" cy="{moonYPos}" r="6"/>
    <circle id=sun cx="{markerXPos}" cy="{sunYPos}" r="6"/>
</svg>

<style lang="less">
    @sunDasharray: 10 2 1 2;
    @moonDasharray: 0 1 2 2 3 2 3 1;

    svg{
        width: 100%;
        max-height: 100%;
        min-height: 100px;
        path {
            fill: none;
            fill: none;
            stroke: #b1b1b1;
            stroke-width: 2px;

        }

        #sun_path {
            stroke-dasharray: @sunDasharray;
        }

        #moon_path {
            stroke-dasharray: @moonDasharray;
        }

        #sun{
            fill: yellow;
        }
        #moon{
            fill: gray;
        }
    }
</style>