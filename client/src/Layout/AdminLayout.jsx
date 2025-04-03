import React from 'react'
import { Outlet } from 'react-router-dom'

export const AdminLayout = () => {
  return (
    <div><h1>Admin Header</h1>
    <Outlet/>
    <h1>Admin footer</h1>
    </div>
  )
}