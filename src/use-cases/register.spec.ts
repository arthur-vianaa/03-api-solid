import { expect, describe, it, test, beforeEach } from 'vitest'
import { RegisterUseCase } from './register.js'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })


    it('should be able to register', async () => {
        const { user } = await sut.execute({
            name: 'John DOe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        await expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const { user } = await sut.execute({
            name: 'John DOe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const isPasswordCorrectlyHashed = await compare (
            '123456',
            user.password_hash,
        )

        await expect (isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {

        const email = 'johndoe@example.com'
        await sut.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })

        await expect (() => sut.execute({
            name: 'John Doe',
            email,
            password: '123456',
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)

    })
})

/* {
            async findByEmail(email) {
                return null
            },

            async create(data) {
                return {
                id: 'user-1',
                name: data.name,
                email: data.email,
                password_hash: data.password_hash,
                created_at: new Date(),
                }
            },
        })
*/ 