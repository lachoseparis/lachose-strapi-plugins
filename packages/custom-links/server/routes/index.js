'use strict';

/*
 * Using function so admin and content-api doesn't get the same instance.
 * to avoid 401 routes error for strapi 4.9.0 and above
 */

const getCustomLinksRoutes = require('./custom-links');
const getSettingsRoutes = require('./settings');

module.exports = {
  admin: {
    type: 'admin',
    routes: [...getSettingsRoutes(), ...getCustomLinksRoutes()],
  },
  'content-api': {
    type: 'content-api',
    routes: getCustomLinksRoutes().filter(route => route.api),
  },
};
