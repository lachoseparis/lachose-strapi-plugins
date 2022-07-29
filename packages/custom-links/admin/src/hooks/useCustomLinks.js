import { useQuery } from 'react-query';
import { useNotification } from '@strapi/helper-plugin';
import { fetchCustomLinks } from '../utils/api';

const useCustomLinks = query => {
  const toggleNotification = useNotification();
  const { isLoading, data, err, refetch } = useQuery(['custom-links', query], async () => {
    const result = await fetchCustomLinks(query, toggleNotification);

    return result;
  });

  return { data, isLoading, err, refetch };
};

export default useCustomLinks;
