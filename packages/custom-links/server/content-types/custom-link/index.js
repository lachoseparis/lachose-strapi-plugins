'use strict';

module.exports = {
  kind: 'collectionType',
  collectionName: 'custom-links',
  info: {
    name: 'custom-link',
    singularName: 'custom-link',
    pluralName: 'custom-links',
    displayName: 'Custom Links',
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
    kind: {
      type: 'string',
      private: false,
    },
    contentId: {
      type: 'biginteger',
      private: false,
    },
  },
};
