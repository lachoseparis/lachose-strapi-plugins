'use strict';

const { isAPIRequest } = require('../utils');

const transform = async (strapi, ctx, next) => {
  await next();
  if (!ctx.body) {
    return;
  }
  if (isAPIRequest(ctx, strapi.config.api?.rest?.prefix)) {
    const { data } = ctx.body;
    if (data && data.attributes && data.attributes.____cl____) {
      ctx.body.meta = {
        ...ctx.body.meta,
        customLink: data.attributes.____cl____,
      };
      delete data.attributes.____cl____;
    }
  }
};

module.exports = ({ strapi }) => {
  strapi.server.use((ctx, next) => transform(strapi, ctx, next));
};
