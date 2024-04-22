<p align="center"><img src="https://www.windy.com/img/logo201802/logo-full-windycom-gray-v3.svg"></p>

Windy plugin that gives shows sun and moon position on the map and gives details about sunset and sunrise times as well as other sun and moon details. This is a full rewrite of [version 1](https://github.com/jacobsjo/windy-plugin-sun-position) to work with the new windy plugin api and includes a number of improvements.

![Sun detail pane](src/screenshot.png?raw=true "Screenshot of a dial showing directions and an info window")

### Dial
The dial displays the current sun and moon azimuth on the map using a black line from the picker position. Additionally, dashed lines show the azimuth of sunrise and sunset and dotted lines show the azimuth of moonrise and moonset.

### Detail pane
The detail pane on the right shows current azimuth and altitude of the sun and moon and their rise and set times. It also shows the current sunlight condition (such as golden hour), and moon phase. Optionally, a timeline can be activated, that shows the timing of astronomical and nautical twilight, and blue and golden hour.

The top of the pane shows a diagram of the sun and moon altitudes over the curse of the current day.

## Changelog
See https://github.com/jacobsjo/windy-plugin-sun-position for the changelog of version 1
### v2.0.0-alpha.8 (compared to v0.3.6)
- Completely rewritten plugin for windy plugin api v2.
- Using svelte to make plugin more modular
- more compact design
- the dial is no longer bound to the picker and can be moved independently
- added weather information to the timeline
- separate small mobile ui with 3 tabs
- removed the option to hide specific parts of the timeline

### V2.0.0-beta.1
- support for radar and satellite timelines
- fix bug when clicking on nadir time in timeline

## Development
Contributions are welcome!

To develop, run:
```sh
npm i
npm run start
```
then accept the self-signed certificate by going to https://localhost:9999/plugin.js. Finally, go to https://www.windy.com/developer-mode to load the plugin.

See https://docs.windy-plugins.com/getting-started/ for how to develop a windy plugin. 
