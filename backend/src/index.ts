import express from 'express'
import cors from 'cors'
import router from './routers.js'
import { errorHandler } from './middlewares/error_handler.js'

const app = express()
const PORT = process.env['PORT'] ?? 3000

app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

app.use('/api', router)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
