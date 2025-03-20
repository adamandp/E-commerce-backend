interface UP {
  id: string;
  permission: {
    id: string;
    name: string;
  } | null;
}

interface User {
  id: string;
  username: string;
}

export interface UserPermissionResponse {
  user: User;
  userPermission: UP[];
}
