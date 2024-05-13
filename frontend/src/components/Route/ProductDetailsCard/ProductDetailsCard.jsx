import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart,} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/reducers/user";
import axios from "axios";
import { loadUser } from "../../../redux/actions/user";
import { server } from "../../../server";
import CountdownTimer from "../../timer/CountdownTimer";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.user);
  const wishlist = null
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(false);
  const { products } = useSelector((state) => state.products);

  const handleMessageSubmit = () => { };
  console.log(data)

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const incrementCount = () => {
    if (count == data.stock) toast.error("Quantity is limited")
    else setCount(count + 1);
  };

  const addToCartHandler = async (id) => {
    const isItemExists = cart && cart.find((i) => i.product._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      const cartData = { ...data, quantity: count };
      dispatch(addToCart(cartData));
      await axios.post(`${server}/user/add-cart`, { product: data._id, quantity: count }, { withCredentials: true });
      dispatch(loadUser());
      toast.success("Item added to cart successfully!");
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews?.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews?.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);

  return (
    <div className="bg-[#fff]">
      {data && (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4 custom-dashboard">
            <RxCross1 size={30} className="absolute right-3 top-3 z-50" onClick={() => setOpen(false)}/>

            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img src={`${data.images && data.images[0]}`} />
                <div className="flex">
                  <Link to={`/shop/preview/${data.shop._id}`} className="flex">
                    <img src={`${data.shop.user.avatar}`} className="w-[50px] h-[50px] rounded-full mr-2"/>
                    <div>
                      <h3 className={`${styles.shop_name}`}>
                        {data.shop.nameShop}
                      </h3>
                      <h5 className="pb-3 text-[15px]">({averageRating}/5) Ratings</h5>
                    </div>
                  </Link>
                </div>
                <div className={`${styles.button} bg-[#000] mt-4 rounded-[4px] h-11`} onClick={handleMessageSubmit}>
                  <span className="text-[#fff] flex items-center">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>
                <h5 className="text-[16px] text-[red] mt-5">({data?.sold_out}) Sold out</h5>
              </div>

              <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data.name}
                </h1>
                <p>{data.description}</p>

                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    Số lượng: {data.stock}
                  </h4>
                </div>

                <div className="flex pt-3">
                  {data.discount && data.discount.status ? (
                    <>
                      <h4 className={`${styles.productDiscountPrice}`}>
                        {(
                          data.originalPrice -
                          (data.originalPrice * data.discount.percent) / 100
                        ).toLocaleString()}{" "}
                        VND
                      </h4>
                      <h3 className={`${styles.price}`}>
                        {data.originalPrice &&
                          data.originalPrice.toLocaleString() + " VND"}
                      </h3>
                    </>
                  ) : (
                    <h4 className={`${styles.productDiscountPrice}`}>
                      {data.originalPrice.toLocaleString() + " VND"}
                    </h4>
                  )}
                </div>
                {
                  data.discount && (
                    <CountdownTimer startDay={data.discount.startDay} endDay={data.discount.endDay}/>
                  )
                }
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button onClick={decrementCount}
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button onClick={incrementCount}
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"                      
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`} onClick={() => addToCartHandler(data._id)}>
                  <span className="text-[#fff] flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsCard;