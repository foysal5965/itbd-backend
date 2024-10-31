import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHendler';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser'
const app: Application = express()
const corsOptions = {
    origin: 'http://localhost:8000', // Or your actual frontend URL
    credentials: true, // Allows sending cookies (refresh token) and credentials
};

app.use(cors(corsOptions));
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.setTimeout(600000); // 10 minutes
    next();
});
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
