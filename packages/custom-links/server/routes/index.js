'use strict';
const customLinksRoutes = require('./custom-links');

module.exports = {
  admin: {
    type: 'admin',
    routes: [...require('./settings'), ...customLinksRoutes],
  },
  'content-api': {
    type: 'content-api',
    routes: customLinksRoutes.filter(route => route.api),
  },
};
