import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

export const useInvalidateAll = () => {
  const queryClient = useQueryClient();

  return React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['baskets'] });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['couriers'] });
  }, [queryClient]);
};
