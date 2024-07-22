import express from "express"

const app = express()
app.use('/', (req, res, next) => {
  res.json({message:"Hello world!"})
})

export default app