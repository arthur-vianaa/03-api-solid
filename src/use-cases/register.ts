import type { UsersRepository } from "@/repositories/users-repository.js"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js"
import type { User } from "@prisma-generated/client.js"

interface registerUseCaseRequest {
    name: string
    email: string
    password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {

    constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
}: registerUseCaseRequest): Promise<RegisterUseCaseResponse> {

     const password_hash = await hash(password, 6)

  // $2b$06$IIXWde1J04ArScb0mfn4w.2e9VlEvxmrgp5DYE2Xp56VHIGeS7ne2

  const userWithSameEmail = await this.usersRepository.findByEmail(email)

  if (userWithSameEmail) {
    throw new UserAlreadyExistsError
  }


  const user = await this.usersRepository.create({
    name,
    email,
    password_hash,
  })

  return {user,} 

}
}


