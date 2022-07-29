'use strict';

const { getSettingsService } = require('../utils');

module.exports = ({ strapi }) => ({
  async getContentTypes(ctx) {
    return getSettingsService(strapi).getContentTypes(ctx.query);
  },

  async updateConfig(ctx) {
    const config = await getSettingsService(strapi).updateConfig(ctx.request.body);
    ctx.send({ data: { config } }, 201);
  },

  async reload() {
    await getSettingsService(strapi).reload();
  },
});
