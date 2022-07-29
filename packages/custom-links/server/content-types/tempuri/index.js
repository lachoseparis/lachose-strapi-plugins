'use strict';

module.exports = {
  kind: 'collectionType',
  collectionName: 'tempuri',
  info: {
    singularName: 'tempuri',
    pluralName: 'tempuri',
    displayName: 'tempuri',
  },
  pluginOptions: {
    'content-manager': {
      visible: false,
    },
    'content-type-builder': {
      visible: false,
    },
  },
  options: {
    draftAndPublish: false,
    comment: '',
  },
  attributes: {
    uri: {
      type: 'string',
      unique: true,
      minLength: 1,
      regex: '^/[a-zA-Z0-9-_./]*$',
    },
  },
};
