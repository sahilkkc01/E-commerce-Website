import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ProductApi = () => {

        const[products,setProducts] =useState([])

        const getProducts = async()=>{
            const res = await axios.get('/api/porducts')
        }

     useEffect(()=>{
        getProducts()
     },[])   

  return (
    <div>
        products:[products,setProducts]
    </div>
  )
}

export default ProductApi
