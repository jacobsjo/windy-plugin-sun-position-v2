import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-sun-position',
    version: '2.0.0-alpha.1',
    icon: '☼',
    title: 'Sun Position',
    description:
        'Shows sun and moon position on the map and gives details about sunset and sunrise times.',
    author: 'jacobsjo (Jochen Jacobs)',
    repository: 'https://github.com/jacobsjo/windy-plugin-sun-position',
    routerPath: '/sun-position/:lat?/:lon?',

    desktopUI: 'rhpane',
    desktopWidth: 340,

    mobileUI: 'fullscreen',

    private: true, // TODO change this when ready to publish,

    addToContextmenu: true,
    listenToSingleclick: true,

    homepage: 'https://community.windy.com/topic/9017/sun-position-plugin',
};

export default config;
