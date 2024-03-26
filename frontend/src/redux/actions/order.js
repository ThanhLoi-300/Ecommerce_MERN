import axios from "axios";
import { server } from "../../server";
import { adminAllOrdersRequest, adminAllOrdersSuccess, getAllOrdersShopRequest, getAllOrdersShopSuccess, getAllOrdersUserRequest, getAllOrdersUserSuccess } from "../reducers/order";

// get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch(getAllOrdersUserRequest());

    const { data } = await axios.get(`${server}/order/get-all-orders/${userId}`);

    dispatch(getAllOrdersUserSuccess(data.orders));
  } catch (error) {
    console.log(error)
  }
};

// get all orders of seller
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch(getAllOrdersShopRequest());

    const { data } = await axios.get(`${server}/order/get-seller-all-orders/${shopId}`);

    dispatch(getAllOrdersShopSuccess(data.orders));
  } catch (error) {
    console.log(error)
  }
};

// get all orders of Admin
export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch(adminAllOrdersRequest());

    const { data } = await axios.get(`${server}/order/admin-all-orders`, {
      withCredentials: true,
    });

    dispatch(adminAllOrdersSuccess(data.orders));
  } catch (error) {
    console.log(error)
  }
};