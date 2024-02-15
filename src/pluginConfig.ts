import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-sun-position',
    version: '2.0.0', // TODO: windy doesn't allow alpha versions
    icon: '☼',
    title: 'Sun Position',
    description:
        'Shows sun and moon position on the map and gives details about sunset and sunrise times.',
    author: 'jacobsjo (Jochen Jacobs)',
    repository: 'https://github.com/jacobsjo/windy-plugin-sun-position',

    // Embedded UI layout should have limited height, not to
    // interact with overlays menu. This content is prefect for rhpane
    // layout.
    desktopUI: 'rhpane',
    desktopWidth: 340,

    mobileUI: 'fullscreen',
    addToContextmenu: true,

    // The good practice is to put only the most important parameters
    // into URL
    routerPath: '/sun-position/:lat?/:lon?',
    private: true, // TODO change this when ready to publish,

    // Using picker to get the coordinates is depreciated
    // Let's use singleclick instead
    listenToSingleclick: true,

    homepage: 'https://community.windy.com/topic/9017/sun-position-plugin',
};

export default config;
