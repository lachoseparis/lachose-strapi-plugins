'use strict';

module.exports = () => {
  process.env.JWT_SECRET = 'Fe0tx2WADmZbXK14ML4Psg=='; /* force env JWT secret for test env */
  return {
    'custom-links': {
      enabled: true,
      resolve: '../packages/custom-links',
    },
  };
};
