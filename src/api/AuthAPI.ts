import axiosInstance from "./Axios";

interface AuthBody {
  email: string;
  password: string;
}

interface Token {
  token: string;
}

export interface User {
  email: string;
  name: string;
  userId: string;
  role: string; // enum?
  permissions: string[]; // enum?
  createdAt: string;
  updatedAt: string;
}

export const createUser = async (body: AuthBody): Promise<Token> => {
  const { data } = await axiosInstance.post<Token>('/auth/', body);
  return data;
};

export const verifyUser = async (token: string): Promise<User> => {
  const { data } = await axiosInstance.get<User>('/auth/verify', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

