'use strict';

module.exports = () => [
  {
    method: 'GET',
    path: '/proxy/:uri([A-Za-z0-9_/.-]*)?',
    handler: 'customLinks.useProxy',
    api: true,
    config: { policies: [] },
  },
  {
    method: 'GET',
    path: '/check-availability',
    handler: 'customLinks.checkAvailability',
    api: false,
    config: { policies: [] },
  },
  {
    method: 'GET',
    path: '/count',
    handler: 'customLinks.count',
    api: true,
    config: { policies: [] },
  },
  {
    method: 'GET',
    path: '/',
    handler: 'customLinks.find',
    api: true,
    config: { policies: [] },
  },
  {
    method: 'POST',
    path: '/',
    handler: 'customLinks.create',
    api: true,
    config: { policies: [] },
  },
  {
    method: 'GET',
    path: '/:id',
    handler: 'customLinks.findOne',
    api: true,
    config: { policies: [] },
  },
  {
    method: 'PUT',
    path: '/:id',
    handler: 'customLinks.update',
    api: true,
    config: { policies: [] },
  },
  {
    method: 'DELETE',
    path: '/:id',
    handler: 'customLinks.delete',
    api: false,
    config: { policies: [] },
  },
  {
    method: 'POST',
    path: '/deleteBulk',
    handler: 'customLinks.deleteMany',
    api: false,
    config: { policies: [] },
  },
];
