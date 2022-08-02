'use strict';

const { describe, beforeAll, afterAll, it, expect } = require('@jest/globals'); // eslint-disable-line
const request = require('supertest');
const { setupStrapi, stopStrapi } = require('../helpers/strapi');

const { createAdmin } = require('../admin/factory');

/** this code is called once before any test is called */
beforeAll(async () => {
  await setupStrapi(); // singleton so it can be called many times
});

// /** this code is called once before all the tested are finished */
afterAll(async () => {
  await stopStrapi();
});

describe('Admin custom links methods', () => {
  let jwt;
  beforeAll(async () => {
    const result = await createAdmin();
    jwt = result.body.data.token;
  });
  it('should create custom links config file', async () => {
    await request(strapi.server.httpServer) // app server is and instance of Class: http.Server
      .put('/custom-links/settings/config')
      .send({
        contentTypes: ['api::article.article', 'api::post.post'],
      })
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + jwt)
      .expect('Content-Type', /json/)
      .expect(201)
      .then(data => {
        expect(data.body).toBeDefined();
        expect(data.body.data.config.contentTypes.length).toBe(2);
      });
  });
});
