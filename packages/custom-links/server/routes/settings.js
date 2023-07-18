'use strict';

module.exports = () => [
  {
    method: 'GET',
    path: '/settings/content-types',
    handler: 'settings.getContentTypes',
    config: {
      policies: [
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::custom-links.settings.read'],
          },
        },
      ],
    },
  },
  {
    method: 'PUT',
    path: '/settings/config',
    handler: 'settings.updateConfig',
    config: {
      policies: [
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::custom-links.settings.update'],
          },
        },
      ],
    },
  },
];
