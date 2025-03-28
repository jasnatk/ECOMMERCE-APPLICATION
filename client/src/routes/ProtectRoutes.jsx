import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

export const ProtectRoutes = () => {
    const [ isUserAuth,setIsUserAuth ] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isUserAuth) { 
            navigate("/login");
        }
    }, []);

    return <Outlet />;
};
