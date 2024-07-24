import {Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinery";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {

  const {title, genre} = req.body;

  const files = req.files as {[fieldname: string]: Express.Multer.File[]};

  const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);

  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName) // for pdf

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath,{
      filename_override: fileName,
      folder: "book-cover",
      format: coverImageMimeType,
  })

    const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: 'raw',
      filename_override: bookFileName,
      folder: 'book-pdfs',
      format: "pdf"  
    })

    const _req = req as AuthRequest;

    // Create new book
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    })

    // Delete temp file
    try {
      await fs.promises.unlink(filePath)
      await fs.promises.unlink(bookFilePath)
      
    } catch (error) {
      console.log(error)
      return next(createHttpError(500, "Failed to delete files!!!"))
    }
  
    res.status(201).json({id: newBook._id});
    
  } catch (error) {
    console.log(error)
    return next(createHttpError(500, "Failed to upload files"))
  }
}

export {createBook}