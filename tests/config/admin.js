'use strict';

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '123456789'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', '123456789'),
  },
  transfer: {
    token: {
      salt: env('API_TOKEN_SALT', '987654321'),
    },
  },
});
