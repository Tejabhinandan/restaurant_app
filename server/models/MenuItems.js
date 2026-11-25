import mongoose from "mongoose";

const menuItemSchema =new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        category: {
            type:String,
            required:true,
            enum:["Starters", "Rolls", "Mains", "Breads", "Beverages", "Desserts"]
        },
        price:{
            type: Number,
            required:true,
            min:0
        },
        taxRate:{
            type:Number,
            default:5
        },
        isVeg:{
            type:Boolean,
            default:true
        }
    },
    {timestamps:true}
)

export default mongoose.model("MenuItems",menuItemSchema)