import axios from "axios";
import { server } from "../../server";
import { updateUserAddressRequest, updateUserAddressSuccess, loadUserFail, loadUserRequest, loadUserSuccess, updateUserInfoFailed, updateUserInfoRequest, updateUserInfoSuccess, deleteUserAddressRequest, deleteUserAddressSuccess } from "../reducers/user";
import { LoadSellerFail, LoadSellerRequest, LoadSellerSuccess } from "../reducers/seller";

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loadUserRequest());
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    console.log(JSON.stringify(data.user))
    dispatch(loadUserSuccess(data.user));
  } catch (error) {
    dispatch(loadUserFail(error.response?.data.message));
  }
};

// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch(LoadSellerRequest());
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch(LoadSellerSuccess(data.seller));
  } catch (error) {
    dispatch(LoadSellerFail(error.response.data.message));
  }
};

// user update information
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch(updateUserInfoRequest());

      const { data } = await axios.put(`${server}/user/update-user-info`,
        {
          email,
          phoneNumber,
          name,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      dispatch(updateUserInfoSuccess(data.user));
    } catch (error) {
      dispatch(updateUserInfoFailed(error.response.data.message));
    }
  };

// update user address
export const updatUserAddress = (info) => async (dispatch) => {
    try {
      dispatch(updateUserAddressRequest());
      
      const { data } = await axios.put(`${server}/user/update-user-addresses`,
        { ...info }, { withCredentials: true }
      );

      dispatch(updateUserAddressSuccess(data.user));
    } catch (error) {
      console.log(error);
    }
  };

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserAddressRequest());

    const { data } = await axios.delete(`${server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );

    dispatch(deleteUserAddressSuccess(data.user));
  } catch (error) {
    console.log(error)
  }
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response.data.message,
    });
  }
};