import express from "express"
import globleErrorHandler from "./middlewares/globleErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express()

app.use(express.json())

app.use('/home', (req, res, next) => {
  res.json({message:"Hello world!"})
  // const error = createHttpError(400, "Something went wrong!")
  // throw error; 
})
// From user Router (Express)
app.use("/api/user", userRouter);
app.use("/api/books", bookRouter);
// From middlewares Htttp Error handler
app.use(globleErrorHandler)


export default app