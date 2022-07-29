import { request } from '@strapi/helper-plugin';
import pluginId from '../pluginId';

const qs = require('qs');

export const getCustomLinkByKindAndId = async ({ kind, contentId }) => {
  try {
    const query = qs.stringify(
      {
        filters: {
          kind: {
            $eq: kind,
          },
          contentId: {
            $eq: contentId,
          },
        },
      },
      {
        encodeValuesOnly: true,
      }
    );
    const requestUrl = `/${pluginId}?${query}`;
    const { data } = await request(requestUrl);

    return data[0] || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCustomLinkConfigContentType = async ({ contentType }) => {
  try {
    const data = await request(`/${pluginId}/settings/content-types?contentType=${contentType}`, {
      method: 'GET',
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchCustomLinksContentTypes = async () => {
  try {
    const data = await request(`/${pluginId}/settings/content-types`, { method: 'GET' });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCustomLinksConfig = async ({ body }) => {
  try {
    request(`/${pluginId}/settings/config`, { method: 'PUT', body }, true);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchAllContentTypes = async () => {
  try {
    const { data } = await request('/content-manager/content-types');

    return { ...data };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCustomLink = async id => {
  try {
    const { data } = await request(`/${pluginId}/${id}`, {
      method: 'GET',
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCustomLink = async (id, data) => {
  try {
    await request(`/${pluginId}/${id}`, {
      method: 'PUT',
      body: data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createCustomLink = async data => {
  try {
    await request(`/${pluginId}`, {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchCustomLinks = async (query = {}) => {
  const pagination = { page: query?.page, pageSize: query?.pageSize };
  let uQuery = query._q ? { pagination, _q: query._q } : { pagination };
  uQuery = query.sort ? { ...uQuery, sort: query.sort } : uQuery;
  const qureyString = qs.stringify(uQuery, { encodeValuesOnly: true });
  try {
    const result = await request(`/${pluginId}?${qureyString}`);

    return { ...result };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCustomLinks = async data => {
  try {
    await request(`/${pluginId}/deleteBulk`, {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCustomLink = async id => {
  try {
    await request(`/${pluginId}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const checkAvailability = async data => {
  try {
    const result = await request(`/${pluginId}/check-availability`, {
      method: 'GET',
      params: data,
    });

    return { ...result };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchAppInfo = async () => {
  try {
    const { data } = await request('/admin/information');

    return { ...data };
  } catch (error) {
    throw new Error(error);
  }
};
