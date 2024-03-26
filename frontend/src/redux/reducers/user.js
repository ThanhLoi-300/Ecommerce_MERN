import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  cart: [],
  error: null,
  addressLoading: false,
  successMessage: null,
  usersLoading: false,
  listSelected: [],
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    loadUserRequest: (state) => {
      state.loading = true;
    },
    loadUserSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
      state.cart = action.payload.cart;
    },
    loadUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    updateUserInfoRequest: (state) => {
      state.loading = true;
    },
    updateUserInfoSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    updateUserInfoFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserAddressRequest: (state) => {
      state.addressLoading = true;
    },
    updateUserAddressSuccess: (state, action) => {
      state.addressLoading = false;
      state.user = action.payload.user;
    },
    updateUserAddressFailed: (state, action) => {
      state.addressLoading = false;
      state.error = action.payload;
    },
    deleteUserAddressRequest: (state) => {
      state.addressLoading = true;
    },
    deleteUserAddressSuccess: (state, action) => {
      state.addressLoading = false;
      state.user = action.payload.user;
    },
    deleteUserAddressFailed: (state, action) => {
      state.addressLoading = false;
      state.error = action.payload;
    },
    getAllUsersRequest: (state) => {
      state.usersLoading = true;
    },
    getAllUsersSuccess: (state, action) => {
      state.usersLoading = false;
      state.users = action.payload;
    },
    getAllUsersFailed: (state, action) => {
      state.usersLoading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.successMessage = null;
    },
    addToCart: (state, action) => {
      state.cart = [...state.cart, action.payload];
    },
    removeFromCart: (state, action) => {
      return {
        ...state,
        cart: state.cart.filter((i) => i.product._id !== action.payload),
      };
    },
    changeQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      return {
        ...state,
        cart: state.cart.map((item) => {
          if (item.product._id === id) {
            return {
              ...item,
              quantity: quantity,
            };
          }
          return item;
        }),
      };
    },
    
  },
});

export const {
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  updateUserInfoRequest,
  updateUserInfoSuccess,
  updateUserInfoFailed,
  updateUserAddressFailed,
  updateUserAddressRequest,
  updateUserAddressSuccess,
  getAllUsersSuccess,
  getAllUsersFailed,
  getAllUsersRequest,
  deleteUserAddressSuccess,
  deleteUserAddressRequest,
  deleteUserAddressFailed,
  clearMessages,
  clearErrors,
  addToCart,
  removeFromCart,
  changeQuantity,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
