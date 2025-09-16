import axios from "axios";
import { API_URL } from "../config/api";
import { LoginDto, AuthResponseDto } from "../helper/auth";

export const login = async (dto: LoginDto): Promise<AuthResponseDto> => {
  const response = await axios.post<AuthResponseDto>(
    `${API_URL}/auth/login`,
    dto
  );
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("token");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};
