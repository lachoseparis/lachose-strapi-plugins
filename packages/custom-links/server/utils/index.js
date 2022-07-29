'use strict';

const PLUGIN_ID = 'custom-links';
const CUSTOM_LINKS_UID = 'plugin::custom-links.custom-link';
const TEMPURI_UID = 'plugin::custom-links.tempuri';
module.exports = {
  PLUGIN_ID,
  CUSTOM_LINKS_UID,
  TEMPURI_UID,
  getCustomLinksService: strapi => strapi.plugin(PLUGIN_ID).service('customLinks'),
  getSettingsService: strapi => strapi.plugin(PLUGIN_ID).service('settings'),
  isAPIRequest: (ctx, prefix = '/api/') =>
    ctx.request && ctx.request.url && ctx.request.url.indexOf(prefix) !== -1,
};
