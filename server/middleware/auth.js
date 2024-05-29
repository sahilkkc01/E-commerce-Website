const jwt = require("jsonwebtoken");


const auth = (req,res,next)=>{
    try{              //this token is sent by client im request header(TOKEN KEY)
                     //every user has unique token by which they are autherised
        const token = req.header("Authorization");
        if(!token) res.status(400).json({msg:"Invail Autherization"});
                      //varifing token send by client is same as our token
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err) return res.status(400).json({msg:"Invalid Authersization"});

            req.user= user;
            //calling next middleware
            next();
        })

    }catch(err){
        return res.status(400).json({msg:err.message})
    }
}

module.exports = auth