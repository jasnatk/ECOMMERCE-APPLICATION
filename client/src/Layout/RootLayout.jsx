import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {  UserHeader } from "../Components/user/UserHeader";
import { Header } from "../Components/user/Header";
import {Footer} from "../Components/user/Footer";
import { useSelector } from "react-redux";


export const RootLayout = () => {
   
    const user = useSelector((state) => state.user)
    console.log("user===",user)
  
    return (
        <div>
            {user.isUserAuth ? <UserHeader /> : <Header />}
            <div className="min-h-100">
                <Outlet />
            </div>
               <Footer/>
        </div>
    );
};
