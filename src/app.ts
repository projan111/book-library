import express from "express"
import globleErrorHandler from "./middlewares/globleErrorHandler";

const app = express()
app.use('/', (req, res, next) => {
  res.json({message:"Hello world!"})
  // const error = createHttpError(400, "Something went wrong!")
  // throw error;

  
})
app.use(globleErrorHandler)


export default app