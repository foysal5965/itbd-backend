import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHendler';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser'
const app: Application = express()
app.use(cors())
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'health  care runnig' })
})
app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
})
export default app
