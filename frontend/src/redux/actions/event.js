import axios from "axios";
import { server } from "../../server";
import { deleteeventRequest, getAlleventsShopSuccess } from "../reducers/event";

// get all events of a shop
export const getAllEventsShop = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${server}/discount/get-all-discount-seller`, { withCredentials: true });
    dispatch(getAlleventsShopSuccess(data.data));
  } catch (error) {
  }
};

// delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch(deleteeventRequest());

    const { data } = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteeventSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteeventFailed",
      payload: error.response.data.message,
    });
  }
};