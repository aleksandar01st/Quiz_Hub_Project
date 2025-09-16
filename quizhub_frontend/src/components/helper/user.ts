export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
  profileImage: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: string;
  profileImage?: string;
}
