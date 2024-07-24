import {Request, Response, NextFunction } from "express";

const createBook = (req: Request, res: Response, next: NextFunction) => {

  console.log('files:', req.files)
  
  res.status(201).json({message: "Book router is working fine"});
}

export {createBook}