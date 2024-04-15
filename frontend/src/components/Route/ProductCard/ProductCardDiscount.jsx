import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import styles from "../../../styles/styles";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import Ratings from "../../Products/Ratings";

const ProductCardDiscount = ({
  data,
  discount,
  setListOfSelectedProducts,
  listOfSelectedProducts,
  checked,
}) => {
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState(checked);

  const handleOnChangeCheckbox = (event) => {
    setCheck(event.target.checked)
  };

  useEffect(() => {
    if (check) {
      // Nếu checkbox được chọn, thêm giá trị vào mảng checkedValues
      setListOfSelectedProducts([...listOfSelectedProducts, data._id]);
    } else {
      // Nếu checkbox được bỏ chọn, loại bỏ giá trị khỏi mảng checkedValues
      setListOfSelectedProducts(listOfSelectedProducts.filter((item) => item !== data._id));
    }
  }, [check]);

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer border border-black">
        <div className="w-full flex justify-center">
          <input
            type="checkbox"
            name="checkbox"
            onChange={handleOnChangeCheckbox}
            value={data._id}
            checked={check}
          />
        </div>

        {check && (
          <div className="flex items-center justify-center absolute w-12 h-12 rounded-full bg-yellow-500 right-4">
            - {discount.percent}%
          </div>
        )}

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
            <h6 className={`${styles.productDiscountPrice}`}>
              {data.originalPrice.toLocaleString()} VND
            </h6>
            {check && (
              <h4 className={`${styles.price}`}>
                {(data.originalPrice - data.originalPrice * (discount.percent / 100)).toLocaleString() + " VND"}
              </h4>
            )}
            
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
