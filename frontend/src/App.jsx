import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ActivationPage,
  BestSellingPage,
  CheckoutPage,
  EventsPage,
  HomePage,
  LoginPage,
  OrderDetailsPage,
  OrderSuccessPage,
  PaymentPage,
  ProductDetailsPage,
  ProductsPage,
  ProfilePage,
  SellerActivationPage,
  ShopCreatePage,
  ShopHomePage,
  SignupPage,
  TrackOrderPage,
  UserInbox,
} from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store";
import { loadSeller, loadUser } from "./redux/actions/user";
import ProtectedRoute from "./routes/ProtectedRoute";
import SellerProtectedRoute from "./routes/SellerProtectedRoute";
import ShopDashboardPage from "./pages/Shop/ShopDashboardPage";
import {
  ShopAllCoupouns,
  ShopAllEvents,
  ShopAllOrders,
  ShopCreateEvents,
  ShopCreateProduct,
  ShopInboxPage,
  ShopOrderDetails,
  ShopPreviewPage,
} from "./routes/ShopRoutes";
import ShopAllProducts from "./pages/Shop/ShopAllProducts";
import { getAllProducts } from "./redux/actions/product";
import AllOrderOfUser from "./components/Shop/AllOrderOfUser";
import ShopAllOrdersOfUser from "./pages/Shop/ShopAllOrdersOfUser";

const App = () => {
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/sign-up" element={<SignupPage />}></Route>
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        ></Route>
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        ></Route>
        <Route path="/products" element={<ProductsPage />}></Route>
        <Route path="/product/:id" element={<ProductDetailsPage />}></Route>
        <Route path="/best-selling" element={<BestSellingPage />}></Route>
        <Route path="/events" element={<EventsPage />}></Route>
        <Route path="/checkout" element={<CheckoutPage />}></Route>
        <Route path="/orer/success" element={<OrderSuccessPage />}></Route>
        <Route
          path="/profile"
          element={
            // <ProtectedRoute>
            <ProfilePage />
            // </ProtectedRoute>
          }
        ></Route>
        <Route path="/shop-create" element={<ShopCreatePage />}></Route>
        <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
        <Route
          path="/shop/:id"
          element={
            <SellerProtectedRoute>
              <ShopHomePage />
            </SellerProtectedRoute>
          }
        ></Route>
        <Route
          path="/dashboard"
          element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          }
        ></Route>
        <Route
          path="/dashboard-create-product"
          element={
            <SellerProtectedRoute>
              <ShopCreateProduct />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRoute>
              <ShopAllProducts />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-event"
          element={
            <SellerProtectedRoute>
              <ShopCreateEvents />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-events"
          element={
            <SellerProtectedRoute>
              <ShopAllEvents />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-coupouns"
          element={
            <SellerProtectedRoute>
              <ShopAllCoupouns />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-orders"
          element={
            <SellerProtectedRoute>
              <ShopAllOrders />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-messages"
          element={
            <SellerProtectedRoute>
              <ShopInboxPage />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/order/:id"
          element={
            <SellerProtectedRoute>
              <ShopOrderDetails />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/orderUser/:id"
          element={
            <SellerProtectedRoute>
              <ShopAllOrdersOfUser />
            </SellerProtectedRoute>
          }
        />

        <Route path="/user/order/:id" element={<OrderDetailsPage />} />

        <Route path="/user/track/order/:id" element={<TrackOrderPage />} />

        <Route
          path="/inbox"
          element={
            // <ProtectedRoute>
            <UserInbox />
            // </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
