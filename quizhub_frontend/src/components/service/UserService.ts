import axios from "axios";
import { API_URL } from "../config/api";
import { CreateUserDto, UserDto } from "../helper/user";

export const createUser = async (dto: CreateUserDto): Promise<UserDto> => {
  const response = await axios.post<UserDto>(`${API_URL}/user`, dto);
  return response.data;
};

export const getUsers = async (): Promise<UserDto[]> => {
  const response = await axios.get<UserDto[]>(`${API_URL}/user`);
  return response.data;
};

export const getUserById = async (id: number): Promise<UserDto> => {
  const response = await axios.get<UserDto>(`${API_URL}/user/${id}`);
  return response.data;
};
