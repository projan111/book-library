import {Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinery";
import path from "node:path";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {

  console.log('files:', req.files)

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
  
    console.log("upload pdf result:", bookFileUploadResult)
    
    console.log("upload result:", uploadResult)
  
    res.status(201).json({message: "Book router is working fine"});
    
  } catch (error) {
    console.log(error)
    return next(createHttpError(500, "Failed to upload files"))
  }
}

export {createBook}