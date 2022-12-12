'use strict';

const path = require('path');
const fs = require('fs-extra');
const { isNil } = require('lodash');

const { CUSTOM_LINKS_UID, PLUGIN_ID } = require('../utils');

const configFileParams = {
  dir: './config/',
  filename: `${PLUGIN_ID}`,
};

module.exports = ({ strapi }) => ({
  async getFiles(dir) {
    const files = await fs.readdir(path.join(dir));
    const fileList = [];
    for await (const file of files) {
      const stat = await fs.stat(path.join(dir, file));
      if (!stat.isDirectory()) {
        fileList.push(path.join(dir, file));
      }
    }
    return fileList;
  },
  async isUsingTypescript() {
    try {
      const filePath = path.resolve(configFileParams.dir);
      const files = await this.getFiles(filePath);
      const extTs = files.find(file => {
        return path.extname(file) === '.ts';
      });
      const useTs = extTs !== undefined;
      return useTs;
    } catch (e) {
      return false;
    }
  },
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
    const isTypescript = this.isUsingTypescript();
    const ext = isTypescript ? 'ts' : 'js';
    const filePath = path.resolve(
      path.join(configFileParams.dir, configFileParams.filename + '.' + ext)
    );
    await fs.ensureFile(filePath);
    let strScript = '';
    if (isTypescript) {
      strScript = `
export default {
  contentTypes: [${value.contentTypes.map(ct => `'${ct}'`).join(', ')}],
};
`;
    } else {
      strScript = `'use strict';

module.exports = {
  contentTypes: [${value.contentTypes.map(ct => `'${ct}'`).join(', ')}],
};
`;
    }
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
    strapi.reload.isWatching = false;
    await setImmediate(() => strapi.reload()); //eslint-disable-line
  },
});
