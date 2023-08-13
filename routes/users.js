import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/User.js';
import dotenv from 'dotenv';

const router = express.Router();

router.post("/register", async (req, res) => {
    const {username , password} = req.body;
    const user = await UserModel.findOne({ username }); 

    if(user) {
        return res.json({Error:"user already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({username, password: hashedPassword});
    await newUser.save();

    res.json({Error:"User Successfully Created"});

});

router.post("/login", async (req,res)=>{
    const {username , password} = req.body;
    const user = await UserModel.findOne({ username }); 

    if(!user) {
        return res.json({message:"User Doesn't exists"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
       return res.json({message:"UserName or Password Doesnt Matchs"});
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
    res.json({token, userID:user._id})
});

export {router as userRouter};

export const verifyToken = (req,res,next) =>{
    const token = req.headers.authorization ;
    console.log(req.headers.authorization);
    if(token){
        jwt.verify(token,process.env.JWT_SECRET, (err)=>{
            if(err) return res.sendStatus(403);
            next();
        })
    }else{
        res.sendStatus(401);
    }
}