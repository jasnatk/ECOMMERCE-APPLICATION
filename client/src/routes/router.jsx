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
import { ProtectSellerRoutes } from "./ProtectSellerRoutes";
import { EditProfile } from "../Components/user/EditProfile";
import ChangePassword from "../pages/shared/ChangePassword";
import PaymentSuccess from "../pages/user/PaymentSuccess";
import PaymentCancel from "../pages/user/PaymentCancel";
import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerProfile from "../pages/seller/SellerProfile";
import NewProduct from "../pages/shared/NewProduct";
import SellerProducts from "../Components/seller/SellerProduct";
import EditProductForm from "../Components/seller/EditProduct";
import { ProtectAdminRoutes } from "./ProtectAdminRoutes";
import AdminProfile from "../pages/admin/AdminProfile";
import ManageSellers from "../pages/seller/ManageSellers";
import SellerOrders from "../pages/seller/SellerOrders";
import OrderDetails from "../Components/user/Order";
import Stock from "../Components/seller/StockManagement";
import EditStock from "../pages/seller/EditStock";
import MyOrders from "../Components/user/MyOrders";
import { AdminOrders } from "../pages/admin/AdminOrders";
import AllProduct from "../Components/admin/AllProduct";
import { ManageCustomers } from "../pages/admin/ManageCustomers";
import PendingVerification from "../pages/seller/PendingVerification";






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
        path: "signup",
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
          path: "change-password",
          element: <ChangePassword/>,
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
            path: "edit-profile",
            element: <EditProfile/>,
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
            path: "payment-success",
            element: <PaymentSuccess/>,
          },
          
          {
            path: "payment-cancel",
            element: <PaymentCancel/>,
          },
          {
            path: "order/:orderId",
            element: <OrderDetails/>,
          },
          {
            path: "order/my-orders",
            element: <MyOrders/>,
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
                           element: <SellerProfile/>
                          },
                           {
                           path: "sellerdashboard",
                           element: <SellerDashboard />,
                           },
                           {
                           path: "/seller/pending",
                           element: <PendingVerification/>,
                           },
                           {
                            path: "products/new",
                            element: <NewProduct/>,
                            },
                            {
                            path: "products",
                            element: <SellerProducts/>,
                             },
                            {
                            path: "products/edit/:id",
                            element: <EditProductForm/>,
                            },
                            {
                              path: "orders",
                              element: <SellerOrders/>,
                               },
                               {
                                path: "products/stock",
                                element: <Stock/>,
                                 },
                                 {
                                  path: "products/edit-stock/:id",
                                  element: <EditStock/>,
                                   },
                              
                        ],
                      },
                    ],
                   },
                      
                  {
                  path: "admin",
                  element: <AdminLayout/>,
                  children:[
                    {
                      path: "admindashboard",
                  element:<AdminDashboard />,
                    },

                    {
                      path: "login",
                  element:<LoginPage role ="admin"/>,
                    },
                    {
                      path: "signup",
                      element: <SignupPage role ="admin"/>,
                    },
                    {
                      path: "logout",
                      element: <LogoutPage role ="admin"/>,
                    },
                    {
                      path: "products",
                      element: <AllProduct/>,
                    },
                    

                          {   
                             element: <ProtectAdminRoutes/>,
                             children: [
                              {
                                path: "profile",
                                element: <AdminProfile/>
                               },
                               {
                                path: "manage-sellers",
                                element: <ManageSellers/>
                               },

                               {
                                path: "orders",
                                element: <AdminOrders/>
                               },
                               {
                                path: "users",
                                element: <ManageCustomers/>
                               },
                             ]}

                  ],
                },
]);