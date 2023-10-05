import { Router } from "express";
import authRoutes from "./auth";

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)

export default rootRouter;