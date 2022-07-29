'use strict';

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '123456ABcdef'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', '123456ABcdefghij'),
  },
});
