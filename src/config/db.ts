import mongoose from "mongoose"

const conntectDB = async () => {

  try {

    mongoose.connection.on("connected", () =>{
      console.log("Mongodb Connected!")
    } )
    
    mongoose.connection.on("error", (error)=> {
      console.log("DB Connection failed!!!", error)
    })

    await mongoose.connect(process.env.MONGODB_URI as string)
  
    
  } catch (error) {
    console.log("Connection Failed to DB", error)
    process.exit(1)
  }

}

export default conntectDB;