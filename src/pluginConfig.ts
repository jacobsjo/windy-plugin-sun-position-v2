import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-sun-position',
    version: '2.0.0', // TODO: windy doesn't allow alpha versions
    icon: '☼',
    title: 'Sun Position',
    description: 'Shows sun and moon position on the map and gives details about sunset and sunrise times.',
    author: 'jacobsjo (Jochen Jacobs)',
    repository: 'https://github.com/jacobsjo/windy-plugin-sun-position',
    desktopUI: 'embedded',
    mobileUI: 'fullscreen',
    addToContextmenu: true,
    routerPath: '/sun-position/:showtimeline?/:lat?/:lon?',
    private: true, // TODO change this when ready to publish,
};

export default config;
