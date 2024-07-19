import express from 'express';
import dbConnect from './dbConnect.js';
import cors from 'cors'
import { config } from "dotenv";
import notificationRouter from './routes/notification.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';


const app = express()
config();


app.use(express.json());
app.use(cors());
dbConnect();

app.use("/api/notification", notificationRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter)

app.get('/', async (req, res) => {
    res.send("Hello world.")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))