import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useNotification } from '@strapi/helper-plugin';
import { fetchCustomLinksContentTypes, updateCustomLinksConfig } from '../utils/api';

const useCustomLinksConfig = () => {
  const queryClient = useQueryClient();
  const toggleNotification = useNotification();

  const { isLoading, data, err } = useQuery('customLinksConfig', async () => {
    const result = await fetchCustomLinksContentTypes(toggleNotification);

    return result;
  });

  const delayedRefetch = useCallback(async () => {
    return new Promise(resolve => {
      setTimeout(async () => {
        await queryClient.invalidateQueries('customLinksConfig');
        resolve();
      }, 300);
    });
  }, [queryClient]);

  const forceRefetch = useCallback(async () => {
    // hack if not doing that data is not refetch
    await delayedRefetch();
  }, [delayedRefetch]);

  const submitMutation = useCallback(
    async (...args) => {
      const handleError = () => {
        toggleNotification({
          type: 'warning',
          message: { id: 'custom-links.pages.settings.notification.submit.error' },
        });
      };
      try {
        await updateCustomLinksConfig(...args);
      } catch (e) {
        handleError();
      }
    },
    [toggleNotification]
  );

  return { data, isLoading, err, submitMutation, forceRefetch };
};

export default useCustomLinksConfig;
