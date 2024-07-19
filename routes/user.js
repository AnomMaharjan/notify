import { Router } from "express";
import User from "../models/User.js";

const userRouter = Router();




userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find().select(['-notifications', '-password', '-_id', '-__v'])

        res.status(200).send({ success: true, users })
    } catch (err) {
        return res
            .status(500)
            .send({ error: true, message: "Internal Server Error." });
    }

})

export default userRouter;