import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller?._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  const orderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Order updated!");
        navigate("/dashboard-orders");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const refundOrderUpdateHandler = async (e) => {
    // await axios
    // .put(
    //   `${server}/order/order-refund-success/${id}`,
    //   {
    //     status,
    //   },
    //   { withCredentials: true }
    // )
    // .then((res) => {
    //   toast.success("Order updated!");
    //   dispatch(getAllOrdersOfShop(seller._id));
    // })
    // .catch((error) => {
    //   toast.error(error.response.data.message);
    // });
  };

  console.log(data?.status);

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        <Link to="/dashboard-orders">
          <div
            className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
          >
            Order List
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex items-start mb-5">
            <div>
              {item.discount ? (
                <div className="flex items-center justify-center absolute w-12 h-12 rounded-full bg-yellow-500 ml-16">
                  -{item.discount}%
                </div>
              ): null}
              <img
                src={`${item.product.images[0]}`}
                alt=""
                className="w-[80x] h-[80px]"
              />
            </div>
            <div className="w-full">
              <h5 className="pl-3 text-[20px]">{item.product.name}</h5>
              <h5 className="pl-3 text-[20px] text-[#00000091]">
                {item.discount ? (
                  <>
                    {(
                      item.product.originalPrice -
                      (item.product.originalPrice * item.discount) / 100
                    ).toLocaleString()}
                    VND * {item.quantity}
                    <p className={`${styles.price}`}>
                      {item.product.originalPrice.toLocaleString() + " VND"}
                    </p>
                  </>
                ) : (
                  <>
                    {item.product.originalPrice.toLocaleString()}VND x{" "}
                    {item.quantity}
                  </>
                )}
              </h5>
            </div>
          </div>
        ))}

      <div className="border-t w-full text-right">
        {data.discountPrice != 0 && (
          <>Discount Price: -{data.discountPrice.toLocaleString()} VND</>
        )}
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>{data?.totalPrice.toLocaleString()} VND</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            Address:{" "}
            {data?.shippingAddress.address}
          </h4>
          <h4 className=" text-[20px]">
            Area: {data?.shippingAddress.ward}, {data?.shippingAddress.district}, {data?.shippingAddress.city}
          </h4>
          <h4 className=" text-[20px]">Phone: 0{data?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
          <h4>
            Type: {" "}
            {data?.paymentInfo?.type }
          </h4>
        </div>
      </div>
      <br />
      <br />
      <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
      {data?.status !== "Processing refund" &&
      data?.status !== "Delivered" &&
      data?.status !== "Shipping" &&
      data?.status !== "Refund Success" ? (
        <>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
          >
            {["Processing", "Shipping", "Received"]
              .slice(
                ["Processing", "Shipping", "Received"].indexOf(data?.status)
              )
              .map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
          </select>
          <div
            className={`${styles.button} mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px]`}
            onClick={
              data?.status !== "Processing refund"
                ? orderUpdateHandler
                : refundOrderUpdateHandler
            }
          >
            Update Status
          </div>
        </>
      ) : (
        data?.status
      )}
      {data?.status === "Processing refund" ||
      data?.status === "Refund Success" ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {["Processing refund", "Refund Success"]
            .slice(
              ["Processing refund", "Refund Success"].indexOf(data?.status)
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      ) : null}
    </div>
  );
};

export default OrderDetails;
