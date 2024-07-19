import { Router } from "express";
import { signUpBodyValidation, logInBodyValidation } from "../utils/authValidator.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import generateTokens from "../utils/generateTokens.js";


const authRouter = Router()

authRouter.post('/register', async (req, res) => {
    try {
        const { error } = signUpBodyValidation(req.body)
        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message })
        }
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).json({ error: true, message: "User with given username already exists" })
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        await new User({ ...req.body, password: hashPassword }).save();
        return res.status(201).json({ error: false, message: "Account Created" });
    } catch (err) {
        console.log(err)

        return res.status(500).json({ error: true, message: "Internal Server error" });
    }
})


authRouter.post("/login", async (req, res) => {
    try {
        console.log(req.body)
        const { error } = logInBodyValidation(req.body)
        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message })
        }


        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json({ error: true, message: "Invalid Username or Password" })
        }


        const verifiedPassword = await bcrypt.compare(req.body.password, user.password);

        if (!verifiedPassword) {
            return res
                .status(401)
                .json({ error: true, message: "Invalid email or password" });

        }
        if (user.fcmToken.length >= 2) {
            user.fcmToken.shift()
            user.fcmToken.push(req.body.fcmToken)
        } else {
            user.fcmToken.push(req.body.fcmToken)
        }
        await user.save()
        const { accessToken, refreshToken } = await generateTokens(user);
        return res.status(200).json({
            error: false,
            username: req.body.username,
            accessToken,
            refreshToken,
            message: "Logged in sucessfully",
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }

})

export default authRouter