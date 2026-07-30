import { env } from '@/env/index.js'
import { app } from "./app.js"

app.listen({ 
    host: '0.0.0.0',
    port: env.PORT,
}).then(() => {
    console.log('🚀 HTTP server running!')
})
