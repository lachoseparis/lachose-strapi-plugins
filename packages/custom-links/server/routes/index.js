'use strict';

module.exports = {
  admin: {
    type: 'admin',
    routes: [...require('./settings'), ...require('./custom-links')],
  },
  'content-api': {
    type: 'content-api',
    routes: require('./custom-links'),
  },
};
