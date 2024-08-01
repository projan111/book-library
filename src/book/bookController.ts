import {Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinery";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {

  const {title, genre, description} = req.body;

  const files = req.files as {[fieldname: string]: Express.Multer.File[]};

  const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(__dirname, '../../public/data/uploads' , fileName);

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
      description,
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
    return next(createHttpError(500, "Failed to create files"))
  }
}

const updateBook = async (req: Request, res: Response, next: NextFunction) => {

  const {title, genre, description} = req.body

  const bookId = req.params.bookId;

  const book = await bookModel.findOne({_id: bookId});

  if(!book){
    return next(createHttpError(404, "Book not found!!!"))
  }

  // Check access book Author
  const _req = req as AuthRequest
  if (book.author.toString() !== _req.userId ){
    return next(createHttpError(403, "You can not access others' book"))
  }

  // Check if file field exists
  const files = req.files as {[fieldname: string]: Express.Multer.File[]};

  let completeCoverImage = "";
  if (files.coverImage){
    const filename = files.coverImage[0].filename;
    const coverMimeType = files.coverImage[0].mimetype.split('/').at(-1);
    
    // Send file to cloudinary
    const filePath = path.resolve(__dirname, '../../public/data/uploads', filename);
    
    const uploadResult = await cloudinary.uploader.upload(filePath,{
      filename_override: filename,
      folder: "book-cover",
      format: coverMimeType
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  let completeFileName = '';
  if(files.file){
    const bookFilePath = path.resolve(__dirname, "../../public/data/uploads", files.file[0].filename
    );

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: 'raw',
      filename_override: files.file[0].filename,
      folder: 'book-pdfs',
      format: "pdf"
    });
    
    completeFileName = uploadResultPdf.secure_url;    
    await fs.promises.unlink(bookFilePath)
    
  }

  // Update book
  const updateBook = await bookModel.findByIdAndUpdate(
    {_id: bookId},
    {
      title:title,
      genre: genre,
      description: description,
      coverImage: completeCoverImage 
        ? completeCoverImage 
        : book.coverImage,
      file: completeFileName 
        ? completeFileName 
        : book.file
    }, 
    {new: true}
  )
  res.json(updateBook)

}

const listBook = async (req: Request, res: Response, next: NextFunction) => {
  try{
    // todo: add pagination
    const book = await bookModel.find().populate("author", "name")
    res.json(book)

  }catch(err){
    return next(createHttpError(500, "Error while getting a book"))
  }
}

const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  
  try{
    // todo: add pagination
    const book = await bookModel.findOne({_id:bookId})

    if(!book){
      return next(createHttpError(404, "Book not found!!!"))
    }
    res.json(book)

  }catch(err){
    return next(createHttpError(500, "Error while getting a book"))
  }
}

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  
  try{
    // todo: add pagination
    const book = await bookModel.findOne({_id:bookId})

    if(!book){
      return next(createHttpError(404, "Book not found!!!"))
    }

    // Check access 
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId){
      return next(createHttpError(403, "You can not delete others' book"))
    }

    const splitFileUrl = book.coverImage.split('/');
    const coverImagePublicId = splitFileUrl.at(-2) + "/" + splitFileUrl.at(-1)?.split(".").at(-2);

    const splitBookFile = book.coverImage.split('/');
    const bookFilePublicId = splitBookFile.at(-2) + "/" + splitBookFile.at(-1);
    
    // Todo: try-block
    await cloudinary.uploader.destroy(coverImagePublicId)
    await cloudinary.uploader.destroy(bookFilePublicId, {resource_type: 'raw'})

    await bookModel.deleteOne({_id: bookId})
    
    return res.status(204);

  }catch(err){
    return next(createHttpError(500, "Error while getting a book"))
  }
}

export {createBook, updateBook, listBook, getSingleBook, deleteBook}