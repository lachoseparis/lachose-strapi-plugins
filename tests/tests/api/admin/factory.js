'use strict';

const request = require('supertest');

const defaultData = {
  password: '1234AbcD',
  firstname: 'admin',
  lastname: 'super',
  email: 'test@test.com',
};

const createAdmin = async () => {
  // eslint-disable-next-line no-return-await
  return await request(strapi.server.httpServer)
    .post('/admin/register-admin')
    .send(defaultData)
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json');
};

module.exports = {
  createAdmin,
};
