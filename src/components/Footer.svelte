<script lang="ts">
    import config from "src/pluginConfig";

</script>



<div class="footer">
    <p class="main">
        Sun Position Plugin made by <a href="https://jacobsjo.eu" target="_blank">jacobsjo</a>
    </p>
    <a href="https://github.com/sponsors/jacobsjo" class="support">♥ <span>Sponsor me on GitHub</span></a>
    <p class="links">
        <a href="https://community.windy.com/topic/32647/sun-position-plugin-v2" target="_blank">Community Post</a>
        <a href="https://github.com/jacobsjo/windy-plugin-sun-position-v2" target="_blank">Source</a>
        <a href="https://github.com/jacobsjo/windy-plugin-sun-position-v2/issues" target="_blank">Issues</a>
    </p>
    <p class="fineprint">windy-plugin-sun-position-v2@{config.version}</p>
</div>

<style lang="less">
    .footer{
        margin-top: 0.6rem;
        background-color: rgb(36, 36, 36);
        border: 0.1rem solid rgb(179, 179, 179);
        border-radius: 1rem;
        padding: 0.3rem 1rem;
        display: flex;
        gap: 0.3rem;
        flex-direction: column;
        align-items: center;

        * {
            user-select: text;
        }

        p {
            padding: 0;
            margin: 0;
        }

        a span, a{
            text-decoration: underline;
        }

        .support {
            color: rgb(255, 255, 194);
            text-decoration: none;
        }

        .links{
            display: flex;
            gap: 0.3rem;
            flex-wrap: wrap;
            row-gap: 0;


            a {
                padding: 0 0.3rem;
                white-space: nowrap;
            }
        }

        .fineprint{
            color: rgb(172, 172, 172);
            font-size: 10px;
        }
    }
</style>