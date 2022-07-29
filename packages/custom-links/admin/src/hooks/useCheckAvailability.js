import { useState, useCallback } from 'react';
import { checkAvailability } from '../utils/api';

const useCheckAvailability = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [available, setAvailable] = useState({
    isAvailable: true,
  });
  const check = useCallback(async data => {
    setIsChecking(true);
    const result = await checkAvailability(data);
    setAvailable({ ...result });
    setIsChecking(false);
  }, []);
  const clearCheck = useCallback(() => {
    setAvailable({ isAvailable: true });
  }, []);

  return { check, isChecking, available, clearCheck };
};

export default useCheckAvailability;
