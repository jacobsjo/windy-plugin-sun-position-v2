<p align="center"><img src="https://www.windy.com/img/logo201802/logo-full-windycom-gray-v3.svg"></p>

Windy plugin that gives shows sun and moon position on the map and gives details about sunset and sunrise times as well as other sun and moon details. To use the published version, go to [www.windy.com](https://www.windy.com), open the menu, click on "Install Windy plugin", enter "windy-plugin-sun-position" and click "Load plugin".

**The access to the plugin has changed in Version 0.2.0 to allow for mobile usage!**
To open the display, right-click on the map (or tap and hold on mobile), then select "Sun Position". Then open a weather picker to see the sun dial and the details on the left

### Dial
The dial displays the current sun and moon azimuth on the map using a black line from the picker position. Additionally, dashed lines show the azimuth of sunrise and sunset and dotted lines show the azimuth of moonrise and moonset. Clicking on the sunrise, sunset, moonrise and moonset lines will set the current time to the respective time.

![Sun dial](pictures/sundial.jpg?raw=true "Sun dial")

### Detail pane
The detail pane on the left shows the time of astronomical, nautical, and civil dusk and dawn; start and end of blue and golden hour and solar noon. Moonrise and moonset times are also added to the timeline. Below, a diagram of the sun and moon altitudes over time is displayed. Below that, details about the current sun and moon position are shown.

On the top of the detail pane it is possible to enable and disable individual displays. The telescope toggles visibility of astronomical sun details (astronomical and nautical dawn and dusk). The camera toggles visibility of blue and golden hour times. The moon toggles visibility of moon details.

![Sun detail pane](pictures/sundetail.jpg?raw=true "Sun detail pane")

### Development
If you want to use the development build clone the git repository and run,
```sh
npm i
npm run start-dev
```
Now open your browser browser at [https://localhost:9999/plugin.js](https://localhost:9999/plugin.js) to accept self signed SSL certificate.

Then open your browser at [www.windy.com/dev](https://www.windy.com/dev) to test the plugin.

If it fails, make sure that the plugin is correctly built and accessible with your browser at [https://localhost:9999/plugin.js](https://localhost:9999/plugin.js).

### Changelog
#### V0.1.0
Original release
#### V0.1.1
Fixed timezone issues:
- Displays times in timezone of position selected (instead of local timezone of user)
- When Windy setting to display all times in UTC is selected, displays all times in UTC
#### V0.2.0
- **The hook has been changed from the Overlay layers menu to the context-menu.**
- Displays only times that exist: If the sun does not go far enough below the horizon, astronomical dawn and dusk might not exist and the entire night is astronomical twilight. In this (and more extreme) cases the non-existent times are hidden
- The plugin now works on mobile (thanks @rittels for the help)
- Fixed some delay issues that resulted from the timezone-lookup
#### V0.3.0
- reworked detail phase
- included details about the moon
- fixed blue hour times
- redesigned current sun position display
- added options to disable moon, astronomical details and photography details separately
- added footnote with links to plugin pages
#### V0.3.1
- desktop sidebar hotfix (broken by change on windy)
#### V0.3.2
- fixed plugin loading issue (broken by change on windy)
- changed timezone lookup to tz-lookup package
- added querry string
#### V0.3.3
- fixed plugin loading issue (broken by change on windy)
#### V0.3.4 and V0.3.5
- fixed issue finding location (broken by change on windy)
#### V0.3.6
- fixed plugin loading issue (broken by change on windy)