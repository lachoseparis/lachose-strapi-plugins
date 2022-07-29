'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/proxy/:uri([A-Za-z0-9_/.-]*)?',
    handler: 'customLinks.useProxy',
    config: { policies: [] },
  },
  {
    method: 'GET',
    path: '/check-availability',
    handler: 'customLinks.checkAvailability',
    config: { policies: [] },
  },
  {
    method: 'GET',
    path: '/count',
    handler: 'customLinks.count',
    config: { policies: [] },
  },
  {
    method: 'GET',
    path: '/',
    handler: 'customLinks.find',
  },
  {
    method: 'POST',
    path: '/',
    handler: 'customLinks.create',
    config: { policies: [] },
  },
  {
    method: 'GET',
    path: '/:id',
    handler: 'customLinks.findOne',
    config: { policies: [] },
  },
  {
    method: 'PUT',
    path: '/:id',
    handler: 'customLinks.update',
    config: { policies: [] },
  },
  {
    method: 'DELETE',
    path: '/:id',
    handler: 'customLinks.delete',
    config: { policies: [] },
  },
  {
    method: 'POST',
    path: '/deleteBulk',
    handler: 'customLinks.deleteMany',
    config: { policies: [] },
  },
];
