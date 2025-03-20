export interface UserRole {
  id: string;
  roles: {
    id: string;
    name: string;
  } | null;
}

interface User {
  id: string;
  username: string;
}

export interface UserRolesResponse {
  id: string;
  user: User;
  roles: {
    id: string;
    name: string;
  } | null;
}
