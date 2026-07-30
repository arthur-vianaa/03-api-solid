import type { CheckIn } from "@prisma-generated/client.js";
import type { CheckInsRepository } from "@/repositories/check-ins-repository.js";
import type { GymsRepository } from "@/repositories/gyms-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates.js";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-checkins-error.js";
import { MaxDistanceError } from "./errors/max-distance-error.js";

interface CheckInUseCaseRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor (private checkInsRepository: CheckInsRepository, private gymsRepository: GymsRepository, ) {}

    async execute({ userId, gymId, userLatitude, userLongitude }: CheckInUseCaseRequest): Promise <CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()} )

        const max_distance_in_km = 10

        if (distance > max_distance_in_km) {
            throw new MaxDistanceError()
        }

        const CheckInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date(),)
        if (CheckInOnSameDay) {
            throw new MaxNumberOfCheckInsError()
        }
       const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId,
       })

       return {checkIn,}
    }
}