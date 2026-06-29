import type { UserRecord } from "@/db/models/User";

import type { SessionUser, UserDTO } from "./types";

export function toUserDTO(user: UserRecord): UserDTO {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
}

export function toSessionUser(user: UserRecord): SessionUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
}
