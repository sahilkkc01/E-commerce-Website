//getting access to Users Database
const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//userCtrl is object with key = function name and value function code execution
const userCtrl = {
    register : async(req,res)=>{
       try{
        const {name,email,password} = req.body;
                                    //if email is already in Database
        const user = await Users.findOne({email});
        if(user){
            return res.status(400).json({msg:"Email Already Registerd"});
        }

        if(password.length<6) {
           return res.status(400).json("Password Must be atleast 6 charecter");
        }


        //encryption of password to hashcode 
        const passwordHash = await bcrypt.hash(password,10);
             
               //newUser is object of type Users
        const newUser = new Users({
            name,email,password:passwordHash
        })
           //save newUser data to mongoDb
        await newUser.save();

        //Creating JWT for authenctication
        const accestoken = createAccesToken({id:newUser._id});
        const refreshtoken = createRefreshToken({id:newUser._id});


        res.cookie('refreshtoken',refreshtoken,{
            httpOnly:true,
            path:'user/refresh_token',
        })

        res.json({"Register Success":accestoken});

       }catch(err){
        console.log(err.message);
       }
    },
    refreshtoken: async(req,res)=>{
        try{
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.json({msg:"Please login or register"});
               //varifing token 
            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
                const accestoken = createAccesToken({id:user.id});
                res.json({user,accestoken});
            });
        }catch(err){
            return res.status(500).json({msg:err.message});
        }
        

    },
    login:async(req,res)=>{
        try{
              const {email,password}=req.body;

              const user = await Users.findOne({email});
              if(!user) return res.status(400).json({msg:"User does not exist"})

              const isMatch = await bcrypt.compare(password,user.password)
              if(!isMatch) return res.status(400).json("Incorrect password")  
              const accestoken = createAccesToken({id:user._id});
              const refreshtoken = createRefreshToken({id:user._id});

              res.cookie('refreshtoken',refreshtoken,{
                httpOnly:true,
                path:'/user/refresh_token',
              })

              res.status(500).json({"Login Success":accestoken});

        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    logout:async(req,res)=>{
        try{
             res.clearCookie('refreshtoken',{path:'/user/refresh_token'});
             return res.json({msg:"Log Out"})
        }catch(err){
            res.status(400).json({msg:err.message});
        }
    },
    getUser:async(req,res)=>{
        try{                                       //remove password in user deatils
            const user = await Users.findById(req.user.id).select('-password');
            
            if(!user) return res.status(400).json({msg:"User not found"})
            res.json(user)
        }catch(err){

        }
    }

}
                        //payload has user id
const createAccesToken = (payload)=>{
      return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
}
const createRefreshToken = (payload)=>{
      return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'})
}

module.exports = userCtrl;