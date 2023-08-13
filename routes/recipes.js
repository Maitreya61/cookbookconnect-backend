import express, { response } from 'express';
import { RecipeModel } from '../models/Recipes.js';
import mongoose from 'mongoose';
import { UserModel } from '../models/User.js';
import { verifyToken } from './users.js';


const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const response = await RecipeModel.find({});
        res.json(response);
    } catch (error) {
        res.json(error);
    }
});


router.post("/",async(req,res)=>{
    const recipe = new RecipeModel(req.body);
    try {
        await recipe.save();
        res.json({message:"Response Posted"}); 
    } catch (error) {
        res.json(error);
    }
})



router.put("/", async (req, res) => {
    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe);
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (error) {
        res.json(error);
    }
});

router.get("/saved/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedRecipes: user?.savedRecipes });
    } catch (error) {
        res.json(error);
    }
});

router.get("/saved/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({
            _id: { $in: user.savedRecipes },
        })
        res.json({ savedRecipes });
    } catch (error) {
        res.json(error);
    }
});

router.delete("/:id",async(req,res)=>{
    const recipe = await RecipeModel.findById(req.params.id)
    try {
        await recipe.deleteOne();
    } catch (error) {
        
    }
})

router.patch("/saved", async (req, res) => {
    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.pop(recipe);
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (error) {
        res.json(error);
    }
});

export { router as recipesRouter };