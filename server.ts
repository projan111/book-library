import app from "./src/app"
import { config } from "./src/config/config"
import conntectDB from "./src/config/db"

console.log("server is running")

const startServer = async() => {
  //connect database
  await conntectDB()
  const port = config.port || 3000

  app.listen(port, () => {
    console.log(  `Listening on port : http://localhost:${port}`)
  })
}

startServer()