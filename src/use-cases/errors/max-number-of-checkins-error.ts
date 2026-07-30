export class MaxNumberOfCheckInsError extends Error {
    constructor() {
        super('Max Number of Check-ins Reached.')
    }
}