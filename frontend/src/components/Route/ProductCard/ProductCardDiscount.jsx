import React, { useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import styles from "../../../styles/styles";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import Ratings from "../../Products/Ratings";

const ProductCardDiscount = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer border border-black">
        <div className="w-full flex justify-center">
            <input type="checkbox"/>
        </div>
        
        <div className="flex items-center justify-center absolute w-12 h-12 rounded-full bg-yellow-500 right-4">
          -30%
        </div>
        <img
          src={`${data.images && data.images[0]}`}
          className="w-full h-[170px] object-contain"
        />
        <h4 className="pb-3 font-[500]">
          {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
        </h4>

        <div className="flex">
          <Ratings rating={data?.ratings} />
        </div>

        <div className="py-2 flex items-center justify-between">
          <div className="flex flex-col">
            <h5 className={`${styles.productDiscountPrice}`}>
              {data.discount === undefined
                ? data.originalPrice.toLocaleString()
                : data.discountPrice.toLocaleString()}{" "}
              VND
            </h5>
            {/* <h4 className={`${styles.price}`}>
                {data.originalPrice ? data.originalPrice.toLocaleString() + " VND" : null}
              </h4> */}
          </div>
          <span className="font-[400] text-[14px] text-[#68d284]">
            {data?.sold_out} sold
          </span>
        </div>

        {/* side options */}
        <div>
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />
          {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
        </div>
      </div>
    </>
  );
};

export default ProductCardDiscount;
