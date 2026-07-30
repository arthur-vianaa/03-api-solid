import { prisma } from '@/lib/prisma.js'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'

function generateDtabaseUrl(schema: string) {

    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined. Please provide')
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schema)

    return url.toString()
}

export default <Environment>{
    name: 'prisma',
    transformMode: 'ssr',
    async setup() {
        const schema = randomUUID()
        const databaseUrl = generateDtabaseUrl(schema)

        process.env.DATABASE_URL = databaseUrl
        
        await prisma.$disconnect()
        await prisma.$connect()

        execSync('npx prisma db push', {
    env: {
        ...process.env,
        DATABASE_URL: databaseUrl, 
    },
})

        return {
            async teardown() {
                await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
                await prisma.$disconnect()
            },
        }
    },
}