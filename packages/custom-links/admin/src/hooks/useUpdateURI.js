import { useState, useCallback } from 'react';
import { useNotification } from '@strapi/helper-plugin';
import { updateCustomLink, getCustomLinkByKindAndId } from '../utils/api';

const useUpdateURI = () => {
  const toggleNotification = useNotification();
  const [isSaving, setIsSaving] = useState(false);
  const update = useCallback(
    async customLinkData => {
      try {
        setIsSaving(true);
        const customLink = await getCustomLinkByKindAndId(customLinkData);
        await updateCustomLink(customLink.id, customLinkData);
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

  return { update, isSaving };
};

export default useUpdateURI;
