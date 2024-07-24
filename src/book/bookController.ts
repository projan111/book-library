import {Request, Response, NextFunction } from "express";

const createBook = (req: Request, res: Response, next: NextFunction) => {
  res.status(201).json({message: "Book router is working fine"});
}

export {createBook}