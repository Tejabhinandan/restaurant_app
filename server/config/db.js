import mongoose from "mongoose";
import process from "node:process";

export async function connectDB() {
    try{
        const conn = await mongoose?.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn?.connection.host}`)
    }catch(err){
        console.log(`MongoDB connection err: ${err.message}`);
        process?.exit(1);
    }
}