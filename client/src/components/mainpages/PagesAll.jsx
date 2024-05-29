import React from 'react'
import Product from './products/Product'
import Login from './login/Login'
import Register from './login/Register'
import Cart from './cart/Cart'
import {Routes,Route} from 'react-router-dom'

const PagesAll = () => {
  return (
    <Routes>
      <Route path="/" element={<Product/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/cart" element={<Cart/>} />
    </Routes>
  )
}

export default PagesAll
