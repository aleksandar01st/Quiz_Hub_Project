export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  username: string;
  role: string;
}
