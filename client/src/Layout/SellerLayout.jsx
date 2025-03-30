import React from 'react'
import { Outlet } from 'react-router-dom'

export const SellerLayout = () => {
  return (
    <div><h1>Seller Header</h1>
    <Outlet/>
    <h1>Seller footer</h1>
    </div>
  )
}
