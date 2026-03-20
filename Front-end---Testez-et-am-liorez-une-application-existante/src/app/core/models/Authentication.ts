export interface Register {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
}

export interface Login {
  login: string;
  password: string;
}

export interface User {
  firstName: string;
  lastName: string;
}
export interface LoginResponse {
  token: string;
}
