const Category = require('../models/categoryModel');

const categoryCtrl = {
    getCategory:async(req,res)=>{
        try{
            const categories = await Category.find();
            res.json(categories)

        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    createCategory:async(req,res)=>{
        try{
            const {name} = req.body;        //find gives an array which is always true so we use findOne
            const category = await Category.findOne({name});
            
            if(category){
                return res.status(400).json({msg:"Category Already Exists"})
            }

            const newCategory = new Category({name});
            await newCategory.save();

            res.json("Category Cteated Succefully")

        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    deleteCategory:async(req,res)=>{
        try{                               //id is recieved in request params
            await Category.findByIdAndDelete({_id:req.params.id})
            res.json("Category Delete Sucess")
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    updateCategory:async(req,res)=>{
        try{
            const {name} = req.body;
            await Category.findByIdAndUpdate({_id:req.params.id},{name});
            return res.json("Categoy updated succesfully")
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    }

}

module.exports = categoryCtrl