import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

const eventSlice = createSlice({
  name: "event",
  initialState: initialState,
  reducers: {
    eventCreateRequest: (state) => {
      state.isLoading = true;
    },
    eventCreateSuccess: (state, action) => {
      state.isLoading = false;
      state.event = action.payload;
      state.success = true;
    },
    eventCreateFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    },

    // get all events of shop
    getAlleventsShopRequest: (state) => {
      state.isLoading = true;
    },
    getAlleventsShopSuccess: (state, action) => {
      state.isLoading = false;
      state.events = action.payload;
      console.log("action.payload"+ JSON.stringify(state.events));
    },
    getAlleventsShopFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // delete event of a shop
    deleteeventRequest: (state) => {
      state.isLoading = true;
    },
    deleteeventSuccess: (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
    },
    deleteeventFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // get all events
    getAlleventsRequest: (state) => {
      state.isLoading = true;
    },
    getAlleventsSuccess: (state, action) => {
      state.isLoading = false;
      state.allEvents = action.payload;
    },
    getAlleventsFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const { getAlleventsShopRequest, deleteeventRequest, getAlleventsShopSuccess  } = eventSlice;

export const eventReducer = eventSlice.reducer;