import { createBrowserRouter } from "react-router-dom";
import { About } from "../pages/user/About";
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
import { Men } from "../pages/user/Men";
import { Women } from "../pages/user/Women";
import { Kids } from "../pages/user/Kids";
import { Wishlist } from "../pages/user/Wishlist";
import { AdminDashboard } from "../Components/admin/AdminDashboard";
import { AdminLayout } from "../Layout/AdminLayout";
 import { LogoutPage } from "../pages/shared/LogoutPage";
import { CartPage } from "../pages/user/CartPage";




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
        element: <About />,
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
         path: "product",
         element: <Product/>,
       },
       {
        path: "productDetails/:id",
        element: <ProductDetails/>,
      },
      {
        path: "product/productList?category=Men",
        element: <Product/>,
      },
      {
        path: "women",
        element: <Women/>,
      },
      {
        path: "kids",
        element: <Kids/>,
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
            element: <Wishlist/>,
          },
          {
            path: "review",
            element: <h1>review</h1>,
          },
          {
            path: "payment",
            element: <h1>payment</h1>,
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
            element: <h1>sellersignup</h1>,
              },
              // {
              //   path: "seller/logout",
              //   element: <LogoutPage />,
              // },
              {
                path: "profile",
            element: <h1>sellerprofile</h1>,
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
                    // {
                    //   path: "admin/logout",
                    //   element: <LogoutPage />,
                    // },
                  ],
                },
]);