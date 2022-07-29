'use strict';

const POPULATE_TYPES = ['relation', 'component', 'dynamiczone'];
const { createCoreService } = require('@strapi/strapi').factories;
const { CUSTOM_LINKS_UID } = require('../utils');

module.exports = createCoreService(CUSTOM_LINKS_UID, ({ strapi }) => ({
  getProxyQuery(kind) {
    const { attributes } = strapi.contentTypes[kind];
    const populate = {};
    const fields = [];
    Object.entries(attributes).forEach(([attribute, value]) => {
      const vs = Object.prototype.hasOwnProperty.call(value, 'visible') ? value.visible : true;
      const pr = Object.prototype.hasOwnProperty.call(value, 'private') ? value.private : false;
      if (POPULATE_TYPES.includes(value.type) && !pr && vs) {
        if (value.type === 'dynamiczone') {
          populate[attribute] = {
            populate: '*',
          };
        } else {
          populate[attribute] = true;
        }
      } else if (!pr && vs) {
        fields.push(attribute);
      }
    });
    return { fields, populate };
  },
  async count(params) {
    const result = await strapi.db.query(CUSTOM_LINKS_UID).count(params);
    return result;
  },
  async delete(id) {
    const result = await strapi.db.query(CUSTOM_LINKS_UID).delete({
      where: { id },
    });
    return result;
  },
  async deleteMany(ids = []) {
    const entries = [];
    await Promise.all(
      ids.map(async id => {
        const entry = await strapi.db.query(CUSTOM_LINKS_UID).delete({
          where: { id },
        });
        entries.push(entry);
      })
    );
    return {
      count: entries.length,
    };
  },
  async getAvailability({ uri, contentId = '', kind = '' }) {
    const result = await strapi.db.query(CUSTOM_LINKS_UID).findMany({
      where: {
        uri,
        $not: {
          contentId,
          kind,
        },
      },
    });
    return {
      isAvailable: result.length === 0,
      uri,
      contentId,
      kind,
    };
  },
}));
