
export interface User {
  name: string;
  username: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

