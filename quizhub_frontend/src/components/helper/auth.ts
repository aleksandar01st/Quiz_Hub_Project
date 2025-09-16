export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto; // dodajemo user objekat
}
