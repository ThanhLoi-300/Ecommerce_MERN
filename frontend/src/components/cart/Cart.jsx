import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addToCart,
  changeQuantity,
  removeFromCart,
} from "../../redux/reducers/user";
import { loadUser } from "../../redux/actions/user";
import axios from "axios";
import { server } from "../../server";
import { useNavigate } from "react-router-dom";

const Cart = ({ setOpenCart }) => {
  const { user, cart } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [listSelected, setListSelected] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();

  const removeFromCartHandler = async (data) => {
    dispatch(removeFromCart(data));
    await axios.get(`${server}/user/remove-item-cart/${data}`, {
      withCredentials: true,
    });
    dispatch(loadUser());
    toast.success("Item removed from cart successfully!");
  };

  const quantityChangeHandler = async (id, quantity) => {
    dispatch(changeQuantity({ id, quantity }));
    await axios.get(
      `${server}/user/change-quantity-item-cart/${id}/${quantity}`,
      { withCredentials: true }
    );
    const checkExisted = listSelected.find((item) => item.product._id == id);

    if (checkExisted) {
      const updatedItem = { ...checkExisted, quantity: quantity };
      const updatedList = listSelected.map((item) =>
        item.product._id === updatedItem.product._id ? updatedItem : item
      );
      setListSelected(updatedList);
    }
    // dispatch(loadUser())
  };

  const handleCheckboxChange = (itemCart) => {
    const checkExisted = listSelected.find(
      (item) => item.product._id == itemCart.product._id
    );
    if (checkExisted) {
      const newList = listSelected.filter(
        (i) => i.product._id !== itemCart.product._id
      );
      setListSelected(newList);
    } else {
      setListSelected([...listSelected, itemCart]);
    }
  };

  useEffect(() => {
    const sumSelectedList = () => {
      const total =
        listSelected.length > 0
          ? listSelected.reduce(
            (acc, item) => {
              if (item.product.discount && item.product.discount.status) { 
                return acc + item?.quantity * (item?.product?.originalPrice - item?.product?.originalPrice * item?.product.discount?.percent / 100)
              } else {
                return acc + item?.quantity * item?.product?.originalPrice
              }
            },
              0
            )
          : 0;
      setTotalPrice(total);
    };
    sumSelectedList();
    localStorage.setItem("listSelected", JSON.stringify(listSelected));
  }, [listSelected]);

  const checkItemSelected = (id) => {
    const checkExisted = listSelected.find((item) => item.product._id == id);
    return checkExisted ? true : false;
  };

  const checkOut = () => {
    if (listSelected.length === 0)
      toast.error("Please choose product to payment");
    else {
      localStorage.setItem("listSelected", JSON.stringify(listSelected));
      navigate("/checkout");
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[45%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm custom-dashboard">
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* Item length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart && cart.length} items
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t custom-dashboard">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      quantity={i.quantity}
                      checkItemSelected={checkItemSelected}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                      handleCheckboxChange={handleCheckboxChange}
                    />
                  ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              {/* checkout buttons */}
              <div
                className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}
                onClick={checkOut}
              >
                <h1 className="text-[#fff] text-[18px] font-[600]">
                  Checkout Now ({totalPrice.toLocaleString()} VND)
                </h1>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({
  data,
  quantityChangeHandler,
  removeFromCartHandler,
  quantity,
  handleCheckboxChange,
  checkItemSelected,
}) => {
  const navigate = useNavigate();
  const [value, setValue] = useState(quantity);
  const totalPrice = () => {
    if (data.product.discount && data.product.discount.status) {
      return (
        (data.product.originalPrice -
          (data.product.originalPrice * data.product.discount.percent) / 100) *
        value
      );
    } else {
      return data.product.originalPrice * value;
    }
  };

  const increment = (data) => {
    if (data.stock == value) toast.error("Product stock limited!");
    else {
      setValue(value + 1);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
  };

  useEffect(() => {
    quantityChangeHandler(data.product._id, value);
  }, [value]);

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <input
          type="checkbox"
          className="mr-4"
          onChange={() => handleCheckboxChange(data)}
        />
        <div>
          <div
            className={`bg-[rgb(228,67,67)] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
            onClick={() => increment(data.product)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px]">{value}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decrement(data.product)}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>
        <div>
          {data.product.discount && data.product.discount.status && (
            <div className="flex items-center justify-center absolute w-12 h-12 rounded-full bg-yellow-500 ml-24">
              -{data.product.discount.percent}%
            </div>
          )}
          <img
            src={`${data?.product.images[0]}`}
            onClick={() => navigate(`/product/${data.product._id}`)}
            className="w-[130px] cursor-pointer h-min ml-2 mr-2 rounded-[5px]"
          />
        </div>

        <div className="pl-[5px]">
          <h1>
            {data.product.name.length > 40
              ? data.product.name.slice(0, 40) + "..."
              : data.product.name}
          </h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            {data.product.discount && data.product.discount.status ? (
              <>
                {(
                  data.product.originalPrice -
                  (data.product.originalPrice * data.product.discount.percent) /
                    100
                ).toLocaleString()}
                VND * {value}
                <p className={`${styles.price}`}>
                  {data.product.originalPrice.toLocaleString() + " VND"}
                </p>
              </>
            ) : (
              <>
                {data.product.originalPrice.toLocaleString()}VND * {value}
              </>
            )}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            {totalPrice().toLocaleString()} VND
          </h4>
        </div>
        {checkItemSelected(data.product._id) === false && (
          <RxCross1
            className="ml-4 cursor-pointer"
            onClick={() => removeFromCartHandler(data.product._id)}
          />
        )}
      </div>
    </div>
  );
};

export default Cart;
