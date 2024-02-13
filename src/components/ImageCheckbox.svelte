
<script lang="ts">
    export let enabled = true;
    export let title: string;
    export let emote: string;
    export let isMoon: boolean = false;
</script>

<span class:deactivated={!enabled} class:isMoon={isMoon} title={title} on:click={() => {enabled = !enabled}}>{emote}</span>

<style scoped lang="less">
    span {
        font-size: 22pt;
        text-align: center;
        display: inline-block;
        width: 30pt;
        height: 30pt;
        border-radius: 15pt;
        font-family: "Symbola";
        cursor: pointer;

        user-select: none;
        background-color: #C0C000;
    }

    .isMoon {
        background-color: #C0C0C0;
    }

    .deactivated {
        background-color: #2b2b2b;
    }

</style>