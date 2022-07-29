'use strict';

const { describe, beforeAll, afterAll, it, expect } = require('@jest/globals'); // eslint-disable-line
const request = require('supertest');
const { setupStrapi, stopStrapi, grantPrivileges } = require('../helpers/strapi');

/** this code is called once before any test is called */
beforeAll(async () => {
  await setupStrapi(); // singleton so it can be called many times
});
// /** this code is called once before all the tested are finished */
afterAll(async () => {
  await stopStrapi();
});

describe('Default custom links methods and requests', () => {
  beforeAll(async () => {
    // add public privileges
    await grantPrivileges(2, [
      'plugin::custom-links.controllers.customLinks.useProxy',
      'plugin::custom-links.controllers.customLinks.find',
      'plugin::custom-links.controllers.customLinks.findOne',
      'api::article.controllers.article.findOne',
    ]);
  });

  it('should create a Custom link by creating a new article with uri data', async () => {
    const article = await strapi.entityService.create('api::article.article', {
      data: {
        title: 'My Article',
        slug: 'my-article',
        uri: '/my-article',
      },
    });

    expect(article.title).toBe('My Article');

    await request(strapi.server.httpServer) // app server is and instance of Class: http.Server
      .get('/api/custom-links')
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(data => {
        expect(data.body).toBeDefined();
        expect(data.body.data.length).toBe(1);
        expect(data.body.data[0].attributes.uri).toBe('/my-article');
        expect(data.body.data[0].attributes.kind).toBe('api::article.article');
        expect(`${data.body.data[0].attributes.contentId}`).toBe(`${article.id}`);
      });
  });

  it('should delete a custom link when deleting associeted content', async () => {
    const post = await strapi.entityService.create('api::post.post', {
      data: {
        title: 'My Post',
        uri: '/my-post',
      },
    });

    expect(post.title).toBe('My Post');

    await request(strapi.server.httpServer) // app server is and instance of Class: http.Server
      .get('/api/custom-links?filters[uri][$eq]=/my-post')
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(data => {
        expect(data.body).toBeDefined();
        expect(data.body.data.length).toBe(1);
      });

    await strapi.entityService.delete('api::post.post', post.id);

    await request(strapi.server.httpServer) // app server is and instance of Class: http.Server
      .get('/api/custom-links?filters[uri][$eq]=/my-post')
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(data => {
        expect(data.body).toBeDefined();
        expect(data.body.data.length).toBe(0);
      });
  });
  const payload = {
    slug: 'slug-test',
    title: 'title-test',
    uri: '/uri-test-proxy',
    component: [{ text: 'Test component' }],
    content: [{ __component: 'core.component', text: 'Test dynamic zone' }],
  };
  it('custom links proxy query should retrieve article contents', async () => {
    await strapi.entityService.create('api::article.article', {
      data: payload,
    });
    await request(strapi.server.httpServer) // app server is and instance of Class: http.Server
      .get('/api/custom-links/proxy/uri-test-proxy')
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(data => {
        expect(data.body).toBeDefined();
        expect(data.body.data.attributes.slug).toBe(payload.slug);
        expect(data.body.data.attributes.title).toBe(payload.title);
        expect(data.body.data.attributes.component[0].text).toBe(payload.component[0].text);
        expect(data.body.data.attributes.content[0].text).toBe(payload.content[0].text);
      });
  });

  it('should find custom links meta inside article request', async () => {
    const articleTestMeta = await strapi.entityService.create('api::article.article', {
      data: {
        title: 'My Post for meta test',
        slug: 'my-post-for-meta-test',
        uri: '/my-post-for-meta-test',
      },
    });

    await request(strapi.server.httpServer) // app server is and instance of Class: http.Server
      .get(`/api/articles/${articleTestMeta.id}`)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(data => {
        expect(data.body.meta).toBeDefined();
        expect(data.body.meta.customLink).toBe('/my-post-for-meta-test');
      });
  });
});
