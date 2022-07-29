import { useQuery } from 'react-query';
import { fetchAppInfo } from '../utils/api';

const useAppInfo = () => {
  const { isLoading, data, err } = useQuery('appInfo', async () => {
    const result = await fetchAppInfo();

    return result;
  });

  return { data, isLoading, err };
};

export default useAppInfo;
