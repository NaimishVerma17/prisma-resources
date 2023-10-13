import express, {Express, Request, Response} from 'express'
import { PORT } from './secrets'
import rootRouter from './routes'
import { PrismaClient } from '@prisma/client'
import { errorMiddleware } from './middlewares/errors'
import { SignUpSchema } from './schema/users'

const app:Express  = express()

app.use(express.json())

app.use('/api', rootRouter);

export const prismaCilent = new PrismaClient({
    log:['query']
}).$extends({
    result:{
        address:{
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: (addr) => {
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
                }
            }
        }
    }
})

app.use(errorMiddleware)

app.listen(PORT, () => {console.log('App working!')})