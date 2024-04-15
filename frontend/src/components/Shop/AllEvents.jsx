import { Button, Input } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import ProductCard from "../Route/ProductCard/ProductCard";
import ProductCardDiscount from "../Route/ProductCard/ProductCardDiscount";

const AllEvents = () => {
  const { events } = useSelector((state) => state.events);
  const [open, setOpen] = useState(false);

  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
    dispatch(getAllEventsShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    window.location.reload();
  };

  const columns = [
    {
      field: "value",
      headerName: "Value",
      minWidth: 120,
      flex: 0.7,
    },
    {
      field: "startDay",
      headerName: "Start Day",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "endDay",
      headerName: "End Day",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name;
        const product_name = d.replace(/\s+/g, "-");
        return (
          <>
            <Link to={`/product/${product_name}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  // events &&
  // events.forEach((item) => {
  //     row.push({
  //       id: item._id,
  //       name: item.name,
  //       price: "US$ " + item.discountPrice,
  //       Stock: item.stock,
  //       sold: item.sold_out,
  //     });
  //   });

  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
        <div className="w-full flex justify-end">
          <div
            className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
            onClick={() => setOpen(true)}
          >
            <span className="text-white">Create Discount</span>
          </div>
        </div>
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
        {open && (
          <CreateOrUpdateDiscount
            setOpen={setOpen}
            discount={null}
            products={products}
          />
        )}
      </div>
    </>
  );
};

export default AllEvents;

const CreateOrUpdateDiscount = ({ discount, setOpen, products }) => {
  const init = {
    percent: 0,
    startDay: "",
    endDay: "",
    productList: [],
    shop: "",
    status: "",
  };
  const [info, setInfo] = useState(discount || init);

  const handleOnChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // await axios
    //   .post(
    //     `${server}/coupon/create-coupon-code`,
    //     {
    //       name,
    //       minAmount,
    //       maxAmount,
    //       selectedProducts,
    //       percent,
    //       shopId: seller._id,
    //     },
    //     { withCredentials: true }
    //   )
    //   .then((res) => {
    //     toast.success("Coupon code created successfully!");
    //     setOpen(false);
    //     window.location.reload();
    //   })
    //   .catch((error) => {
    //     toast.error(error.response.data.message);
    //   });
  };
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
      <div className="w-[90%] 800px:w-[80%] h-[80vh] bg-white rounded-md shadow p-4 overflow-y-scroll custom-dashboard">
        <div className="w-full flex justify-end">
          <RxCross1
            size={30}
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>
        <h5 className="text-[30px] font-Poppins text-center">
          {discount ? "Update Discount" : "Create Discount"}
        </h5>
        {/* create coupoun code */}
        <form onSubmit={handleSubmit} aria-required={true}>
          <br />
          <div>
            <label className="pb-2">
              Percent (%) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              name="percent"
              required
              percent={info?.percent}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={handleOnChange}
              placeholder="Enter value..."
            />
          </div>
          <br />
          <div className="flex row justify-between">
            <div>
              <p>Start Day: </p>
              <input
                type="date"
                name="startDay"
                value={info?.startDay}
                onChange={handleOnChange}
              />
            </div>
            <div>
              <p>End Day: </p>
              <input
                type="date"
                name="endDay"
                value={info?.endDay}
                onChange={handleOnChange}
              />
            </div>
          </div>
          <br />
          {discount && (
            <div>
              <label className="pb-2">Status: {info?.status}</label>
            </div>
          )}
          <br />
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] ml-4 mb-12">
            {products && products.map((item) => <ProductCardDiscount data={item} />)}
          </div>
          <div>
            <input
              type="submit"
              value="Create"
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
