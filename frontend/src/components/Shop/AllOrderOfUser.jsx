import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import DetailOrder from "../Order/DetailOrder";
import { ENDPOINT, server } from "../../server";
import socketIO from "socket.io-client";

const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const AllOrderOfUser = () => {
  const { id } = useParams();
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const [activeTab, setActiveTab] = useState(0);
  const [dataOrder, setDataOrder] = useState([]);

  const dispatch = useDispatch();
  const tabs = ["Processing", "Shipping", "Recieved", "Canceled"];

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  useEffect(() => {
    socketId.emit("addUser", seller._id);
    socketId.on("getOrder", (data) => {
      dispatch(getAllOrdersOfShop(seller._id));
    });
  }, []);

  useEffect(() => {
    const renderData = () => {
      if (activeTab === 0)
        setDataOrder(
          orders?.filter((i) => i.status === "Processing" && i.user._id == id)
        );
      else if (activeTab === 1)
        setDataOrder(
          orders?.filter((i) => i.status === "Shipping" && i.user._id == id)
        );
      else if (activeTab === 2)
        setDataOrder(
          orders?.filter((i) => i.status === "Delivered" && i.user._id == id)
        );
      else if (activeTab === 3)
        setDataOrder(
          orders?.filter((i) => i.status === "Canceled" && i.user._id == id)
        );
    };
    renderData();
  }, [activeTab, orders]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="m-4 gap-10">
            <p>Name: {orders[0]?.user.name}</p>
            <p>Email: {orders[0]?.user.email}</p>
            <p>Phone: 0{orders[0]?.user.phoneNumber}</p>
          </div>
          <div className="flex gap-2 justify-center">
            {tabs.map((tab, index) => (
              <div
                className={`rounded-tr-[15px] rounded-bl-[15px] cursor-pointer text-white
                        mb-4 px-2 py-2 text-sm
                        ${
                          activeTab === index
                            ? "bg-black"
                            : "bg-gray-600 hover:bg-slate-800"
                        }
                        transition-colors duration-300`}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </div>
            ))}
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Detail</th>
              </tr>
            </thead>
            {dataOrder?.map((i) => (
              <DetailOrder order={i} type={"shop"} />
            ))}
          </table>
        </div>
      )}
    </>
  );
};

export default AllOrderOfUser;
