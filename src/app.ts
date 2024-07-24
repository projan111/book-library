import express from "express"
import globleErrorHandler from "./middlewares/globleErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import cors from "cors";
import { config } from "./config/config";

const app = express();

app.use(express.json());

app.use(cors({
  origin: config.frontend_domain,
}));

app.use('/home', (req, res, next) => {
  res.json({message:"Hello world!"})
  // const error = createHttpError(400, "Something went wrong!")
  // throw error; 
});
// From user Router (Express)
app.use("/api/user", userRouter);
app.use("/api/books", bookRouter);
// From middlewares Htttp Error handler
app.use(globleErrorHandler);


export default app;