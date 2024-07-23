import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async(req: Request, res: Response, next: NextFunction) => {
  const {name, email, password} = req.body;

  // Validation
  if(!name || !email || !password) {
    const error = createHttpError(400, "All fields are required")
    return next(error);
  }

  // Database call
  try {
    const user = await userModel.findOne({email})
    
      if(user){
        const error = createHttpError(400, "User already exist with this email")
        return next(error)
      }
  } catch (error) {
    return next(createHttpError(500, "Error while finding email from database."))
  }

  // hash password
  const hashPassword = await bcrypt.hash(password,10)
  let newUser = new userModel;
  try {
     newUser = await userModel.create({
      name,
      email,
      password:hashPassword
    })
    
  } catch (error) {
    return next(createHttpError(500, "Error while creating user and hashing password."))
  }
  // Generate JWT Token
  try{
    const token = sign({sub: newUser._id}, config.jwtSecret as string, {expiresIn: "7d"})
    res.json({accessToken: token});
  }catch(err){
    return next(createHttpError(500, "Error while generating jwt token."))
  }
  
  // Response 
}

export default createUser;