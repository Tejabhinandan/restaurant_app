import express from "express";
import MenuItems from "../models/MenuItems.js";

const router=express.Router()

router.get("/",async(req,res)=>{
    try{
        const items = await MenuItems.find().sort({ createdAt: -1 });
        res.json(items)
    }catch(err){
        res.status(500).json({message: err?.message})
    }
});

router.post("/",async (req,res) => {
    try{
        const created = await MenuItems.create(req.body);
        res.status(201).json(created)
    }catch(err){
        res.status(400).json({message: err.message})
    }
});

router.put("/:id",async (req,res) => {
    try{
        const updated= await MenuItems.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true,
        });
        if(!updated){
            return res.status(404).json({message:"Item not found"});
        }

        res.json(updated)
    }catch(err){
        res.status(400).json({message: err.message})
    }
});

router.patch("/:id/availability", async (req,res) => {
    try{
        const item = await MenuItems.findById(req.params.id);
        if(!item){
            return res.status(404).json({message: "Item not found"});
        }
        item.isAvailable = !item.isAvailable;
        await item.save();
        res.json(item);
    }catch(err){
        res.status(400).json({message:err.message})
    }
});

router.delete("/:id", async (req, res) => {
    try{
        const deleted = await MenuItems.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.status(404).json({message: "Item not found"});
        }

        res.json({message: "Item deleted", id:req.params.id})
    }catch(err){
        res.status(500).json({message:err.message})
    }
});

router.post("/seed", async (req, res) => {
  try {
    const count = await MenuItems.countDocuments();
    if (count > 0) {
      return res.json({ message: "Menu already seeded", count });
    }

    const starterMenu = [
      { name: "Paneer Tikka Masala", category: "Mains", price: 280, taxRate: 5, isVeg: true, isAvailable: true },
      { name: "Hyderabadi Chicken Biryani", category: "Mains", price: 320, taxRate: 5, isVeg: false, isAvailable: true },
      { name: "Crispy Chicken Strips", category: "Starters", price: 220, taxRate: 5, isVeg: false, isAvailable: true },
      { name: "Paneer Kathi Roll", category: "Rolls", price: 150, taxRate: 5, isVeg: true, isAvailable: true },
      { name: "Double Chicken Egg Roll", category: "Rolls", price: 180, taxRate: 5, isVeg: false, isAvailable: true },
      { name: "Butter Naan", category: "Breads", price: 55, taxRate: 5, isVeg: true, isAvailable: true },
      { name: "Mango Lassi", category: "Beverages", price: 120, taxRate: 5, isVeg: true, isAvailable: true },
      { name: "Gulab Jamun (2 Pcs)", category: "Desserts", price: 90, taxRate: 5, isVeg: true, isAvailable: false },
    ];

    const inserted = await MenuItems.insertMany(starterMenu);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

