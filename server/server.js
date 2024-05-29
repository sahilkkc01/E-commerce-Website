const express = require("express");
const mongoose = require("mongoose");
const userRouter = require('./routes/userRouter');
const categoryRouter = require('./routes/categoryRouter')
const productRouter = require('./routes/productRouter')
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
//middleware for JSON type data reciece from req.body
app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log("srver is Running  on port 5000")
})

app.get('/',(req,res)=>{
    res.json({msg:"Server Started"})
})

//Routes
//any requies that start with /user will be handled by useRouter
app.use('/user',userRouter);
app.use('/api',categoryRouter);
app.use('/api',productRouter);


//Connection With MongoDB
const URI = process.env.MONGODB_URL;

mongoose.connect(URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("MongoDB Connected");
}).catch(err=>{
    console.log(err);
})