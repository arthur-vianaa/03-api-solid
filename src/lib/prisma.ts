import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma-generated/client.js'

const url = process.env.DATABASE_URL!
export const schema = new URL(url).searchParams.get('schema') || 'public'

const adapter = new PrismaPg({ connectionString: url }, { schema })

export const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'dev' ? ['query'] : [],
})