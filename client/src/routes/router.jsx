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
        path: "SignUp",
        element: <h1>signup</h1>,
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
        element: <ProtectRoutes />,
        children: [

          {
            path: "profile",
            element: <h1><Profile /></h1>,
          },
          {
            path: "cart",
            element: <h1>cart</h1>,
          }, {
            path: "wishlist",
            element: <h1>wishlist</h1>,
          },
          {
            path: "review",
            element: <h1>review</h1>,
          },
          {
            path: "payment",
            element: <h1>payment</h1>,
          },

        ]
      }

    ]
  }
]);