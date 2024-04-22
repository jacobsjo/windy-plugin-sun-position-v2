
<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export var active_tab: string = "current"

    const dispatch = createEventDispatcher();

</script>

<div class="tabber">
    <div class="tabber-button" class:active={active_tab === "current"} on:click={() => dispatch("setTab", "current")}>
        Current
    </div>
    <div class="tabber-button" class:active={active_tab === "diagram"} on:click={() => dispatch("setTab", "diagram")}>
        Diagram
    </div>
    <div class="tabber-button" class:active={active_tab === "timeline"} on:click={() => dispatch("setTab", "timeline")}>
        Timeline
    </div>
    <div class="tabber-button" class:active={active_tab === "about"} on:click={() => dispatch("setTab", "about")}>
        About
    </div>
</div>

<style lang="less">
    .tabber {
        display: flex;
        gap: 2px;
        border: 2px solid black;
        border-top: 0;
        background-color: black;
        border-radius: 0 0 1rem 1rem;
        overflow: hidden;
        z-index: 100;
    }

    .tabber-button {
        width: 5rem;
        height: 1.1rem;
        text-align: center;
        color: rgb(0, 0, 0);
        background-color: gray;
        cursor: pointer;
        transition: background-color 0.2s; 
    }

    .tabber-button:hover {
        background-color: rgb(168, 168, 168);
    }

    .tabber-button.active {
        background-color: rgb(192, 192, 192);
    }
</style>