import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema(
    {
        menuItemId:{
            type:mongoose?.Schema.Types.ObjectId, ref: "MenuItem"
        },
        name:{
            type:String,
            required:true
        },
        price:{
            type: Number,
            required:true,
        },
        qty:{
            type:Number,
            required:true,
            min:1,
        },
        taxRate:{
            type:Number,
            default:5
        },  
    },
    {_id:false}
)

const orderSchema = new mongoose.Schema(
    {
        id:{
            type:String,
            required:true,
            unique:true,
        },
        orderType:{
            type:String,
            enum: ["Dine-in", "Takeaway"],
            default:"Dine-in",
        },
        table:{
            type:String,
            default:"Table 01",
        },
        customer:{
            type:String,
            default:"Walk-in customer",
        },
        itemsCount:{
            type:Number,
            required:true,
        },
        lineItems: [lineItemSchema],
        discountAmount:{
            type:Number,
            default:0,
        },
        taxTotal:{
            type:Number,
            default:0,
        },
        amount:{
            type:Number,
            required:true,
        },
        payment:{
            type:String,
            enum:["Cash", "UPI", "Card","Pending"],
            default:"UPI",
        },
        status:{
            type:String,
            enum: ["Pending", "Preparing", "Completed", "Cancelled"],
            default:"Completed",
        },
        time:{
            type:String,
            required:true,
        }
        
    },
    {timestamps:true}
)

export default mongoose.model("Order",orderSchema);