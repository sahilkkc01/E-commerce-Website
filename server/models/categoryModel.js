const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    }
},{
    //we use timestamps to track when(time) the thing was created
    timestamps:true
}) 
         
                            //Category is model of mongoose
module.exports = mongoose.model('Category',categorySchema)