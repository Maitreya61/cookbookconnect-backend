import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {config} from 'dotenv';
import {userRouter} from './routes/users.js'
import { recipesRouter } from './routes/recipes.js';
import fileUpload from 'express-fileupload';

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}));


app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.connect(process.env.DB_URI,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.listen(3001, ()=> console.log("Server Started"));