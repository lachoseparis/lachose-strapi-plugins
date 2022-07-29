import { useState, useCallback } from 'react';
import { useNotification } from '@strapi/helper-plugin';
import { updateCustomLink, createCustomLink, getCustomLinkByKindAndId } from '../utils/api';

const useCreateOrUpdate = () => {
  const toggleNotification = useNotification();
  const [isSaving, setIsSaving] = useState(false);
  const createOrUpdate = useCallback(
    async customLinkData => {
      try {
        setIsSaving(true);
        const customLink = await getCustomLinkByKindAndId(customLinkData);

        if (!customLink) {
          await createCustomLink(customLinkData);
        } else {
          await updateCustomLink(customLink.id, customLinkData);
        }
        toggleNotification({
          type: 'success',
          message: {
            id: 'custom-links.components.edit.inputs.uri.success',
          },
        });
        setIsSaving(false);
      } catch (e) {
        setIsSaving(false);
        toggleNotification({
          type: 'warning',
          message: { id: 'custom-links.components.edit.inputs.uri.error' },
        });
        throw e;
      }
    },
    [toggleNotification]
  );

  return { createOrUpdate, isSaving };
};

export default useCreateOrUpdate;
