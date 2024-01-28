import mongoose, { Connection } from "mongoose"


let cachedConnection: Connection | null  = null;
export async function connectToMongodb(){
    if(cachedConnection){
        console.log("Using cached MONGODB connection")
        return cachedConnection;
    }
    try{
      const conn =  await mongoose.connect(process.env.CONNECTION_URL as string  )
        cachedConnection = conn.connection;
        console.log("Connected to MongoDB")
        return cachedConnection
    }catch(error){
        console.log(error)
    }
}