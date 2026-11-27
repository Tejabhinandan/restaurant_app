import express from "express";
import Order from "../models/Order.js";

const router = express.Router();
const formatLineItems = (items = []) =>
  items.map((item) => ({
    menuItemId: item._id?.length === 24 ? item._id : item.menuItemId || undefined,
    name: item.name,
    price: item.price,
    qty: item.qty,
    taxRate: item.taxRate || 5,
  }));

router.get("/",async (req,res) => {
    try{
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

router.post("/", async (req, res) => {
    try{
       const orderPayload = {
      ...req.body,
      lineItems: formatLineItems(req.body.lineItems),
    };

        const created = await Order.create(orderPayload)
        res.status(201).json(created)
    }catch(err){
        res.status(400).json({message: err.message})
    }
});

router.patch("/:id/status", async (req, res) => {
    try{
        const updated = await Order.findOneAndUpdate(
            {id: req.params.id},
            {status: req.body.status},
            {new: true}
        )
        if(!updated) return res.status(404).json({message: "Order not found"})
            res.json(updated)
    }catch(err){
        res.status(400).json({message: err.message})
    }
});

export default router;