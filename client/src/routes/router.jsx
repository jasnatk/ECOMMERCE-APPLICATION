import { createBrowserRouter } from "react-router-dom";
import { AboutUs } from "../pages/user/About";
import { ContactUs } from "../pages/user/ContactUs";
import { Home } from "../pages/user/Home";
import { RootLayout } from "../Layout/RootLayout";
import { Profile } from "../pages/user/Profile";
import { ProtectRoutes } from "./ProtectRoutes";
import { ErrorPage } from "../pages/shared/ErrorPage";
import { Product} from "../pages/user/Products";
import { ProductDetails } from "../pages/user/ProductDetails";
import { LoginPage } from "../pages/shared/LoginPage";
import { SellerLayout } from "../Layout/SellerLayout";
import { SignupPage } from "../pages/shared/SignupPage";
import { AdminDashboard } from "../Components/admin/AdminDashboard";
import { AdminLayout } from "../Layout/AdminLayout";
 import { LogoutPage } from "../pages/shared/LogoutPage";
import { CartPage } from "../pages/user/CartPage";
import { ForgotPassword } from "../pages/shared/ForgotPassword";
import { ResetPassword } from "../pages/shared/ResetPassword";
import { WishlistPage } from "../Components/user/wishlist";
import { PaymentStatus } from "../pages/user/Payment";
import { ProtectSellerRoutes } from "./ProtectSellerRoutes";


export const router = createBrowserRouter([
  {
     path: "",
  element: <RootLayout />,
errorElement: <ErrorPage />,
 children: [
       {
        path: "",
        element: <Home />,
       },
       {
        path: "about",
        element: <AboutUs/>,
        },

        {
        path: "contact",
        element: <ContactUs />,
        },
        {
        path: "login",
        element: <LoginPage/>,
        },
        {
        path: "Signup",
        element: <SignupPage/>,
        },
        {
        path: "logout",
        element: <LogoutPage/>,
        },
        {
        path: "forgot-password",
        element: <ForgotPassword/>,
        },
        {
          path: "reset-password",
          element: <ResetPassword/>,
        },
        {
         path: "product",
         element: <Product/>,
        },
        {
        path: "productDetails/:id",
        element: <ProductDetails/>,
        },
        {
        path:"user",
        element: <ProtectRoutes />,
        children: [

          {
            path: "profile",
            element: <Profile/>,
          },
          {
            path: "cart",
            element: <CartPage/>,
          }, 
          {
            path: "wishlist",
            element: <WishlistPage/>,
          },
          {
            path: "review",
            element: <h1>review</h1>,
          },
          {
            path: "/user/payment/success",
            element: <PaymentStatus />,
          },
         
        ],
      },

    ],
  },

           {
            path: "seller",
            element: <SellerLayout/>,
            children:[

              {
                path: "login",
            element:<LoginPage role ="seller"/>,
              },
              {
                path: "signup",
            element: <SignupPage role ="seller"/>,
              },
              { 
                path: "logout",
                element: <LogoutPage role ="seller" />,
              },
                      {
                       element: <ProtectSellerRoutes />,
                       children: [
                          {
                           path: "profile",
                           element: <h1>sellerprofile</h1>,
                          },
                       // {
                      //   path: "dashboard",
                      //   element: <SellerDashboard />,
                       // },
                        ],
                      },
                    ],
                   },
                      
                  {
                  path: "admin",
                  element: <AdminLayout/>,
                  children:[
                    {
                      path: "",
                  element:<AdminDashboard role ="admin"/>,
                    },

                    {
                      path: "login",
                  element:<LoginPage role ="admin"/>,
                    },
                    {
                      path: "admin/logout",
                      element: <LogoutPage role ="admin"/>,
                    },
                    // {
                    //   path: "dashboard",
                    //   element: <SellerDashboard />,
                    // },
                  ],
                },
]);