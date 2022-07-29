'use strict';

const {
  getCustomLinksService,
  getSettingsService,
  CUSTOM_LINKS_UID,
  TEMPURI_UID,
  PLUGIN_ID,
} = require('./utils');
const transformMiddleware = require('./middlewares/transform');

module.exports = async ({ strapi }) => {
  // middleware add meta attribures custom-link
  transformMiddleware({ strapi });
  // check config current vs previous config
  await getSettingsService(strapi).checkConfig();
  // add lifecycles
  const config = getSettingsService(strapi).getConfig();
  const models = config.contentTypes;
  strapi.db.lifecycles.subscribe({
    models,
    async beforeCreate(event) {
      const { uri } = event.params.data;
      if (uri) {
        // clear tempuri
        await strapi.db.query(TEMPURI_UID).deleteMany({
          where: {
            id: {
              $notNull: true,
            },
          },
        });
        // record uri to tempuri
        const data = {
          uri,
        };
        await strapi.db.query(TEMPURI_UID).create({
          data,
        });
      }
    },
    async afterCreate(event) {
      const { id } = event.result;
      const { uid } = event.model;
      const result = await strapi.db.query(TEMPURI_UID).delete({
        where: {
          uri: {
            $notNull: true,
          },
        },
      });
      if (result) {
        const { uri } = result;
        const data = {
          kind: uid,
          contentId: id,
          uri,
        };
        // create custom link
        await getCustomLinksService(strapi).create({ data });
      }
    },
    async beforeUpdate(event) {
      const { id } = event.params.where;
      const { uri } = event.params.data;
      const { uid } = event.model;
      const result = await strapi.entityService.findMany(CUSTOM_LINKS_UID, {
        filters: { kind: uid, contentId: id },
      });
      if (result && result.length) {
        // update or delete
        if (uri) {
          if (uri !== result[0].uri) {
            // update custom link
            const data = {
              uri,
            };
            await getCustomLinksService(strapi).update(result[0].id, { data });
          }
        }
      } else if (uri) {
        // no custom link but uri is not null so create a new custom link
        const data = {
          kind: uid,
          contentId: id,
          uri,
        };
        await getCustomLinksService(strapi).create({ data });
      }
    },
    async afterDelete(event) {
      if (event.result) {
        const { id } = event.result;
        const { uid } = event.model;
        if (id) {
          const result = await strapi.entityService.findMany(CUSTOM_LINKS_UID, {
            filters: { kind: uid, contentId: id },
          });
          if (result && result.length) {
            await getCustomLinksService(strapi).delete(result[0].id);
          }
        }
      }
    },
    async afterDeleteMany(event) {
      if (event.result) {
        const { count } = event.result;
        let ids = [];
        try {
          ids = event.params.where.$and[0].id.$in;
        } catch (e) {
          ids = [];
        }

        const { uid } = event.model;
        if (count && count >= 1) {
          const data = await strapi.entityService.findMany(CUSTOM_LINKS_UID, {
            filters: { kind: uid, contentId: { $in: ids } },
          });
          const plIds = data.map(item => item.id);
          await getCustomLinksService(strapi).deleteMany(plIds);
        }
      }
    },
    async afterFindOne(event) {
      if (event.result) {
        const { model, result } = event;
        const data = await strapi.entityService.findMany(CUSTOM_LINKS_UID, {
          filters: { kind: model.uid, contentId: result.id },
        });
        // add ____cl____ for meta insertion via middleware
        if (data && data.length) event.result.____cl____ = data[0].uri;
      }
    },
  });

  const configuration = await strapi
    .plugin('content-manager')
    .service('content-types')
    .findConfiguration(strapi.contentTypes[CUSTOM_LINKS_UID]);
  configuration.layouts.edit = [[{ name: 'uri', size: 6 }]];
  configuration.layouts.list = ['uri'];
  await strapi
    .plugin('content-manager')
    .service('content-types')
    .updateConfiguration(strapi.contentTypes[CUSTOM_LINKS_UID], configuration);
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access the plugin settings',
      uid: 'settings.read',
      pluginName: PLUGIN_ID,
    },
    {
      section: 'plugins',
      displayName: 'Update the plugin settings',
      uid: 'settings.update',
      pluginName: PLUGIN_ID,
    },
    {
      section: 'plugins',
      displayName: 'Access the Custom Links list',
      uid: 'menu-link.read',
      pluginName: PLUGIN_ID,
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
