const Products = require('../models/productModel')

class APIfeatures{
    //products?category=electronics, req.query would be { category: 'electronics' }.
    //query is a mongoose query to fetch data from database
    constructor(query, queryString) {
        this.query = query; // Mongoose query object
        this.queryString = queryString; // Request query parameters
    }


    filtering(){
        const queryObj = {...this.queryString};  //queryObj contain req.query
        // console.log(queryObj);

        const excludedfields = ['page','sort','limit'];//This queryStrings will be handled by other functions
        excludedfields.forEach(el=> delete(queryObj[el]))//delete excludedFields element from queryObj

        // console.log(queryObj);

        let queryStr = JSON.stringify(queryObj)  //Converting JSON queries to string
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match);//find match and add $before match
                                          //gt=greatet then
                                          //gte=greatet or equal to
                                          //lt=less than
                                          //lte=less than or equal to
                                          //regex=regular expression(For Matching something)
                                          //queryString = ?product_id[regex]=2(FORMATE)


        this.query.find(JSON.parse(queryStr)) //find values from query that meets query str
        // console.log({queryObj,queryStr});

        return this  //return founded object 

    } 
    //You can perform sorting on a data by just Db.sort('basis')
    sorting(){
        if(this.queryString.sort){  //sortBy is accesing sort property from query string 
             const sortBy = this.queryString.sort.split(',').join('') //spiliting all sort properties(Price,Category)
              console.log(sortBy)           //[ 'price', 'category' ]   //joining them together to perform sorting on Mongoose(PriceCategory)
        //sort all the result from query(Products.find()) on basis of queryString
             this.query = this.query.sort(sortBy)
            //  this.query = this.query.sort(this.queryString.sort) //if there is only one basis sorting
             
         }else{
            this.query = this.query.sort('-createdAt') 
     //sort all the result from query(Products.find()) on basis of createdAt by defualt is no sorting provided
         }

         return this

    }
    pagination(){
         const page = this.queryString.page *1 || 1;
         const limit = this.queryString.limit *1 || 9;

         //no of document to skin in database query
         const skip = (page-1) * limit; //page is 0 nothing to skip start from first doc
         this.query = this.query.skip(skip).limit(limit);
         return this                        //return max limit(9) docs
        //if page is 2 we will skip 9 docs and start with 10th doc
    }
}

const productCtrl = {
    getProducts:async(req,res)=>{
        try{     //For Filtering           //Passing Products.find() as query
            const features = new APIfeatures(Products.find(),req.query).filtering().sorting().pagination()
            const products = await features.query//features.quer= Products.find()
            
            // const products = await Products.find()(Because features.query consist this )
            res.json(products)
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    createProducts:async(req,res)=>{
        try{
            const {product_id,title,price,description,content,images,category}=req.body;

            if(!images) return res.status(400).json({msg:"Image not Uploaded"})

            const product = await Products.findOne({product_id})

            if(product) return res.status(400).json({msg:"Product already exists"})

            const newProduct = new Products({
                product_id,title : title.toLowerCase(),price,description,content,images,category
            })    
            await newProduct.save();

            res.json({msg:"Product Created Successfully"})    

        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    deleteProducts:async(req,res)=>{
        try{
            await Products.findByIdAndDelete({_id:req.params.id})
            res.json({msg:"Product Deleted Successfully"})
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    updateProducts:async(req,res)=>{
        try{

            const {product_id,title,price,description,content,images,category}=req.body;

            if(!images) return res.status(400).json({msg:"Image not Uploaded"})

            await Products.findByIdAndUpdate({_id:req.params.id},{
               product_id, title : title.toLowerCase(),price,description,content,images,category
            })    

            res.json({msg:"Product Updated Successfully"})
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    
    
}

module.exports = productCtrl