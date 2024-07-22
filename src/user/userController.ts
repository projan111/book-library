import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt"

const createUser = async(req: Request, res: Response, next: NextFunction) => {
  const {name, email, password} = req.body;
  // Validation
  if(!name || !email || !password) {
    const error = createHttpError(400, "All fields are required")
    return next(error);
  }
  // Database call
  const user = await userModel.findOne({email})
  // hash password
  const hashPassword = await bcrypt.hash(password,10)
  

  if(user){
    const error = createHttpError(400, "User already exist with this email")
    return next(error)
  }
  
  // Response 

  res.json({message:"User Registered!"});
}

export default createUser;