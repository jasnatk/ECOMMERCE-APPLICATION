import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { UserHeader } from "../Components/user/UserHeader";
import { Header } from "../Components/user/Header";
import { Footer } from "../Components/user/Footer";

export const RootLayout = () => {
    const [isUserAuth, setIsUserAuth] = useState(false);

    return (
        <div>
            {isUserAuth ? <UserHeader /> : <Header />}
            <div className="min-h-100">
                <Outlet />
            </div>
               <Footer />
        </div>
    );
};
