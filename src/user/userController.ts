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
  const user = await userModel.findOne({email})
  
    if(user){
      const error = createHttpError(400, "User already exist with this email")
      return next(error)
    }
  // hash password
  const hashPassword = await bcrypt.hash(password,10)
  const newUser = await userModel.create({
    name,
    email,
    password:hashPassword
  })
  // Generate JWT Token
  const token = sign({sub: newUser._id}, config.jwtSecret as string, {expiresIn: "7d"})
  
  // Response 
  res.json({accessToken: token});
}

export default createUser;