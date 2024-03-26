import axios from "axios";
import { server } from "../../server";
import { deleteProductFailed, deleteProductRequest, deleteProductSuccess, getAllProductsFailed, getAllProductsRequest, getAllProductsShopFailed, getAllProductsShopRequest, getAllProductsShopSuccess, getAllProductsSuccess, productCreateFail, productCreateRequest, productCreateSuccess } from "../reducers/product";

// create product
export const createProduct = ( info ) =>
  async (dispatch) => {
    try {
      dispatch(productCreateRequest());
      const { data } = await axios.post(`${server}/product/create-product`, { ...info }, { withCredentials: true});
      dispatch(productCreateSuccess(data.product));
    } catch (error) {
      console.log("error: "+error)
      dispatch(productCreateFail(error.response?.data.message));
    }
  };

// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch(getAllProductsShopRequest());

    const { data } = await axios.get(`${server}/product/get-all-products-shop/${id}`);
    dispatch(getAllProductsShopSuccess(data.products));
  } catch (error) {
    // console.log(error)
    // dispatch(getAllProductsShopFailed(error));
  }
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());

    const { data } = await axios.delete(`${server}/product/delete-shop-product/${id}`,
      { withCredentials: true, }
    );

    dispatch(deleteProductSuccess(data.message));
  } catch (error) {
    dispatch(deleteProductFailed(error.response.data.message));
  }
};

// get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch(getAllProductsRequest());

    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch(getAllProductsSuccess(data.products));
  } catch (error) {
    dispatch(getAllProductsFailed(error.response.data.message));
  }
};
