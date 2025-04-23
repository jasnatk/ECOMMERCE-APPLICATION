import express from 'express'
import {connectDB} from './config/db.js'
import apiRouter from './routes/index.js'
import cookieParser from 'cookie-parser'
import cors from "cors";
import dotenv from 'dotenv';   
dotenv.config();

const app = express()

const port = process.env.PORT || 3000;

connectDB()

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
      origin: ["http://localhost:5173","https://ecommerce-application-clientview1.vercel.app"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api',apiRouter)




app.all("*",(req,res,next)=>{
  res.status(404).json({message:"end point does not exist"})
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})