'use client';
import { useQuery } from '@tanstack/react-query';
import { API } from '../api-functions.ts';

export const useGetCourier = () => {
  return useQuery({
    queryKey: ['courier'],
    queryFn: API.getCouriers,
  });
};
