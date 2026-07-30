import type { UsersRepository } from "@/repositories/users-repository.js";
import type { User } from "@prisma-generated/client.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

interface GetUserProfileCaseRequest {
    userId: string
}

interface GetUserProfileCaseResponse {
    user: User
}

export class GetUserProfileUseCase {
    constructor (private usersRepository: UsersRepository, ) {

    }

    async execute({ userId }: GetUserProfileCaseRequest): Promise <GetUserProfileCaseResponse> {
        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new ResourceNotFoundError()
        }

        return {user,}
    }
}