import type { Prisma, User } from "@prisma-generated/client.js";

export interface UsersRepository {
  findById(id: string): Promise <User | null >
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}

