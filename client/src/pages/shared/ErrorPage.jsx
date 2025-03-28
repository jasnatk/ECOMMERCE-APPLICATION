 import React from "react";
 import { useNavigate } from "react-router-dom";

 export const ErrorPage = ({ role }) => {
     const navigate = useNavigate();
 
     ;
     return (
         <div>
             <h1>404 - Page Not Found !</h1>
             <button className="btn btn-accent" onClick={() => navigate('/')}>
                 Navigate to Home
             </button>
         </div>
     );
 };