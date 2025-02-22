export class RegisterUserRequest {
  identifier: string;
  username: string;
  password: string;
  confirm_password: string;
  full_name: string;
}

export class UserResponse {
  message?: string;
  token?: string;
}

export class LoginUserRequest {
  identifier: string;
  identifier_type: string;
  password: string;
}
