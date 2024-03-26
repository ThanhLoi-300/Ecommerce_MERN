import React, { useState } from "react";
import { AiFillHeart, AiFillStar, AiOutlineEye, AiOutlineHeart, AiOutlineShoppingCart, AiOutlineStar,} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";
import axios from "axios";
import { addToCart } from "../../../redux/reducers/user";
import { loadUser } from "../../../redux/actions/user";
import { server } from "../../../server";

const ProductCard = ({ data,isEvent }) => {
  const wishlist = null
  const { cart } = useSelector((state) => state.user);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) setClick(true);
    else setClick(false);
  }, [wishlist]);

  const addToCartHandler = async (id) => {
    const isItemExists = cart && cart.find((i) => i.product._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      const cartData = { ...data, quantity: 1 };
      dispatch(addToCart(cartData));
      await axios.post(`${server}/user/add-cart`, { product: data._id, quantity: 1 }, { withCredentials: true });
      dispatch(loadUser());
      toast.success("Item added to cart successfully!");
    }
  };

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>
        <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
          <img src={`${data.images && data.images[0]}`} className="w-full h-[170px] object-contain"/>
        </Link>
        <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
        </Link>
        <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
          <h4 className="pb-3 font-[500]">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="flex">
            <Ratings rating={data?.ratings} />
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex flex-col">
              <h5 className={`${styles.productDiscountPrice}`}>
                {data.discount === 0 ? data.originalPrice.toLocaleString() : data.discountPrice.toLocaleString()} VND
              </h5>
              <h4 className={`${styles.price}`}>
                {data.originalPrice ? data.originalPrice.toLocaleString() + " VND" : null}
              </h4>
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">
              {data?.sold_out} sold
            </span>
          </div>
        </Link>

        {/* side options */}
        <div>
          <AiOutlineEye size={22} className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)} color="#333" title="Quick view"
          />
          <AiOutlineShoppingCart size={25} className="cursor-pointer absolute right-2 top-24"
            onClick={() => addToCartHandler(data._id)} color="#444" title="Add to cart"
          />
          {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
        </div>
      </div>
    </>
  );
};

export default ProductCard;