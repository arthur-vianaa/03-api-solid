import { expect, describe, it, test, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { SearchGymsUseCase } from './search-gyms.js'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms history Use Case', () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'Javascript Gym',
            description: null,
            phone: null,
            latitude: 0,
            longitude: 0,
        })

        await gymsRepository.create({
            title: 'Typescript Gym',
            description: null,
            phone: null,
            latitude: 0,
            longitude: 0,
        })

        const { gyms } = await sut.execute({
            query: 'Javascript',
            page: 1,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Gym' }),
        ])
    })

    it('should be able to fetch paginated gym search results', async () => {
        
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
            title: `Javascript Gym ${i}`,
            description: null,
            phone: null,
            latitude: 0,
            longitude: 0,
        })
        }

        const { gyms } = await sut.execute({
            query: 'Javascript',
            page: 2,
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Gym 21' }),
            expect.objectContaining({ title: 'Javascript Gym 22' }),
        ])
    })


})