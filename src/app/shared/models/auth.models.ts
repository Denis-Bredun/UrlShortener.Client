export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  username: string;
  role: string;
}

export interface UserInfoDto {
  id: string;
  email: string;
  username: string;
  role: string;
} 