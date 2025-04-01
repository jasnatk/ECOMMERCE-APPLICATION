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
            element: <h1><Profile /></h1>,
          },
          {
            path: "cart",
            element: <h1>Cart</h1>,
          }, {
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
              {
                path: "logout",
            element: <h1>sellerlogout</h1>,
              },
              {
                path: "profile",
            element: <h1>sellerprofile</h1>,
              },
            ],
            },
]);