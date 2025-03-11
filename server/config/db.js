import { connect } from 'mongoose';
import dotenv from 'dotenv'; 

dotenv.config();

export const connectDB=async()=>{

    try{
    
        const response= await connect(process.env.DB_CONNECTION_LINK);
        console.log("db connected succesfully")

    }catch(error){
    console.log(error)
}
}