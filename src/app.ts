import express from "express"
import globleErrorHandler from "./middlewares/globleErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import cors from "cors";
import { config } from "./config/config";

const app = express();
// To return json format
app.use(express.json());
// TO handle cross origin domain:port
app.use(cors({
  origin: config.frontend_domain,
}));

//Test
app.get("/health-check", (req, res, next) => {
  res.status(200).json({
    message: "APIs are working fine",
    meta: true,
    data: ""
  })
})

app.get('/', (req, res, next) => {
  res.json({message:"Hello world!"})
  // const error = createHttpError(400, "Something went wrong!")
  // throw error; 
});
// From user Router (Express)
app.use("/api/user", userRouter);
//Book Router
app.use("/api/books", bookRouter);
// From middlewares Htttp Global Error handler
app.use(globleErrorHandler);


export default app;