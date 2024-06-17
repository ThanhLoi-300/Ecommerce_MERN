import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { format } from 'date-fns';

const DetailOrder = ({ order, type }) => {
    const url = type == "user" ? `/user/order/${order._id}` : `/order/${order._id}`
  return (
    <tbody>
      <tr key={order._id} className="border-b">
        <td className="px-4 py-2">{format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
        <td className="px-4 py-2">{order.totalPrice.toLocaleString()} VND</td>
        <td className="px-4 py-2">
          <span
            className={`px-2 py-1 rounded-full ${
              order.status === "Processing" || order.status === "Shipping"
                ? "bg-yellow-400 text-yellow-800"
                : order.status === "Delivered"
                ? "bg-green-400 text-green-800"
                : "bg-red-400 text-red-800"
            }`}
          >
            {order.status}
          </span>
        </td>
        <td>{order.paymentInfo.type}</td>
        <td className="px-4 py-2 cursor-pointer">
          <Link to={url}>
            <AiOutlineArrowRight size={20} />
          </Link>
        </td>
      </tr>
    </tbody>
  );
};

export default DetailOrder;
