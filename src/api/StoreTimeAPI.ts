import axiosInstance from "./Axios";
import { DayOfWeek, PostStoreTime, StoreTime } from "../types/StoreTypes";

export const getStoreTimes = async (): Promise<StoreTime[]> => {
  const { data } = await axiosInstance.get<StoreTime[]>('/store-times/');
  return data;
};

export const createAStoreTime = async (body: PostStoreTime): Promise<StoreTime> => {
  const { data } = await axiosInstance.post<StoreTime>('/store-times/', body);
  return data;
};

export const getIndividualStoreTime = async (id: string): Promise<StoreTime> => {
  const { data } = await axiosInstance.get<StoreTime>(`/store-times/${id}`);
  return data;
};

export const updateIndividualStoreTime = async (id: string, body: Partial<PostStoreTime>): Promise<StoreTime> => {
  const { data } = await axiosInstance.put<StoreTime>(`/store-times/${id}`, body);
  return data;
};

export const deleteIndividualStoreTime = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/store-times/${id}`);
};

export const getStoreTimesByDay = async (day: DayOfWeek): Promise<StoreTime[]> => {
  const { data } = await axiosInstance.get<StoreTime[]>(`store-times/day/${day}`);
  return data;
};
