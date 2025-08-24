import axiosInstance from "./Axios";
import { Month, PostStoreOverride, StoreOverride } from '../types/StoreTypes';

export const getStoreOverrides = async (): Promise<StoreOverride[]> => {
  const { data } = await axiosInstance.get<StoreOverride[]>('/store-overrides/');
  return data;
};

export const createStoreOverride = async (body: PostStoreOverride): Promise<StoreOverride> => {
  const { data } = await axiosInstance.post<StoreOverride>('/store-overrides/', body);
  return data;
};

export const getIndividualStoreOverride = async (id: string): Promise<StoreOverride> => {
  const { data } = await axiosInstance.get<StoreOverride>(`/store-overrides/${id}`);
  return data;
};

export const updateIndividualStoreOverride = async (id: string, body: Partial<PostStoreOverride>): Promise<StoreOverride> => {
  const { data } = await axiosInstance.put<StoreOverride>(`/store-overrides/${id}`, body);
  return data;
};

export const deleteIndividualStoreOverride = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/store-overrides/${id}`);
};

export const getStoreOverridesByMonthAndDay = async (month: Month, day: number): Promise<StoreOverride[]> => {
  const { data } = await axiosInstance.get<StoreOverride[]>(`/store-overrides/date/${month}/${day}`);
  return data;
};
