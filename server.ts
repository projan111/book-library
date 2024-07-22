import app from "./src/app"
import { config } from "./src/config/config"

console.log("server is running")

const startServer = () => {
  const port = config.port || 3000

  app.listen(port, () => {
    console.log(  `Listening on port : http://localhost:${port}`)
  })
}

startServer()