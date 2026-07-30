import { prisma, schema } from "@/lib/prisma.js"
import type { FindManyNearbyParams, GymsRepository } from "../gyms-repository.js"
import { Prisma, type Gym } from "@prisma-generated/client.js"


export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }


async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * FROM ${Prisma.raw(`"${schema}".gyms`)}
        WHERE ( 6371 * acos(
            LEAST(1.0,
                cos( radians(${latitude}) ) * cos( radians( latitude ) )
                * cos( radians( longitude ) - radians(${longitude}) )
                + sin( radians(${latitude}) ) * sin( radians( latitude ) )
            )
        )) <= 10
    `
    return gyms
}


  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}