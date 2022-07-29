'use strict';

const path = require('path');
const fs = require('fs-extra');
const { isNil } = require('lodash');

const { CUSTOM_LINKS_UID, PLUGIN_ID } = require('../utils');

const configFileParams = {
  dir: './config/',
  filename: `${PLUGIN_ID}.js`,
};

module.exports = ({ strapi }) => ({
  async checkConfig() {
    const savedConfig = this.getConfig();
    const storedConfig = await this.getStoredConfig();
    if (storedConfig && storedConfig.contentTypes) {
      const olds = storedConfig.contentTypes.filter(ct => !savedConfig.contentTypes.includes(ct));
      if (olds.length > 0) await this.deleteCustomLinksKinds(olds);
    }
    await this.saveStoreConfig(savedConfig);
  },
  async getContentTypes({ contentType }) {
    let contentTypes = await this.retrieveContentTypes();
    if (contentType) contentTypes = contentTypes.filter(item => item.uid === contentType);
    return {
      contentTypes,
    };
  },
  async getStore() {
    const store = await strapi.store({ type: 'plugin', name: PLUGIN_ID });
    return store;
  },
  getConfig() {
    return strapi.config.get(PLUGIN_ID) || { contentTypes: [] };
  },
  async getStoredConfig() {
    const store = await this.getStore();
    const config = await store.get({ key: 'config' });
    return config;
  },
  async saveStoreConfig(value) {
    const store = await this.getStore();
    await store.set({ key: 'config', value });
  },
  async updateConfigFile(value) {
    const filePath = path.resolve(path.join(configFileParams.dir, configFileParams.filename));
    await fs.ensureFile(filePath);
    const strScript = `'use strict';

module.exports = {
  contentTypes: [${value.contentTypes.map(ct => `'${ct}'`).join(', ')}],
};
`;
    await fs.outputFile(filePath, strScript);
    return value;
  },
  async updateConfig(newConfig) {
    const config = await this.updateConfigFile(newConfig);
    await this.reload();
    return config;
  },
  async retrieveContentTypes() {
    const config = await this.getConfig();
    const items = config.contentTypes
      .filter(contentType => !!strapi.contentTypes[contentType])
      .map(contentType => {
        const item = strapi.contentTypes[contentType];
        const { uid, options } = item;
        const { isManaged, hidden } = options;
        return {
          uid,
          visible: (isManaged || isNil(isManaged)) && !hidden,
        };
      });
    return items.filter(item => item.visible).map(item => strapi.contentTypes[item.uid]);
  },
  async deleteCustomLinksKinds(uids) {
    const result = await strapi.db.query(CUSTOM_LINKS_UID).deleteMany({
      where: {
        kind: {
          $in: uids,
        },
      },
    });
    return result;
  },
  async reload() {
    setImmediate(() => strapi.reload()); //eslint-disable-line
  },
});
