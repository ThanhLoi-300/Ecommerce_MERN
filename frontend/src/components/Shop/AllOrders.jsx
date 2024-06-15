import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const [dataOrder, setDataOrder] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  useEffect(() => {
    const renderData = () => {
      const uniqueUsers = new Map();

      orders.forEach((order) => {
        if (!uniqueUsers.has(order.user._id)) {
          uniqueUsers.set(order.user._id, order.user);
        }
      });
      setDataOrder(Array.from(uniqueUsers.values()));
    };
    renderData();
  }, [orders]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="flex justify-center text-4xl mb-5">Orders</div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {dataOrder?.map((i) => (
                <tr className="border-b">
                  <td className="px-4 py-2">
                    {i._id} : {i.name}
                  </td>
                  <td className="px-4 py-2">
                    <Link to={`/orderUser/${i._id}`}>
                      <AiOutlineArrowRight size={20} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AllOrders;
