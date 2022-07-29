'use strict';

const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(
        __dirname,
        '../',
        env('DATABASE_FILENAME', `../../.tmp/jest-test${Math.round(Math.random() * 10000)}.db`)
      ),
    },
    useNullAsDefault: true,
  },
});
