import { Button, Input } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import ProductCardDiscount from "../Route/ProductCard/ProductCardDiscount";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllEvents = () => {
  const [open, setOpen] = useState(false);
  const [events, setEvents]= useState([]);
  const { products } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const [discount, setDiscount] = useState(null);

  const row = [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
    const fetchData = async () => {
      const { data } = await axios.get(`${server}/discount/get-all-discount-seller`, { withCredentials: true });
      setEvents(data.data);
    }
    fetchData()
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    window.location.reload();
  };

  const handleOpenInfoDiscount = (id) => {
    const discount = events.find((event) => event._id === id);
    setDiscount(discount);
    setOpen(true);
  };

  const columns = [
    {
      field: "percent",
      headerName: "Percent",
      minWidth: 120,
      flex: 0.5,
    },
    {
      field: "startDay",
      headerName: "Start Day",
      minWidth: 100,
      valueFormatter: ({ value }) => handleDate(value),
      flex: 0.8,
    },
    {
      field: "endDay",
      headerName: "End Day",
      minWidth: 80,
      valueFormatter: ({ value }) => handleDate(value),
      flex: 0.8,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "Detail",
      flex: 0.5,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleOpenInfoDiscount(params.id)}>
              <AiOutlineArrowRight size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.5,
      minWidth: 100,
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

  const handleDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        percent: item.percent,
        startDay: item.startDay,
        endDay: item.endDay,
        status: item.status ? "On" : "Off",
      });
    });

  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
        <div className="w-full flex justify-end">
          <div
            className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
            onClick={() => {
              setOpen(true)
              setDiscount(null)
            }}
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
            discount={discount}
            products={products}
            seller={seller}
          />
        )}
      </div>
    </>
  );
};

export default AllEvents;

const CreateOrUpdateDiscount = ({ discount, setOpen, products, seller }) => {
  const init = {
    percent: 0,
    startDay: "",
    endDay: "",
    productList: [],
    shop: seller._id,
  };
  const [info, setInfo] = useState(discount || init);

  //this list contains products that haven't yet been discounted or have been discounted by this
  const [listProduct, setListProduct] = useState([]);

  const setListOfSelectedProducts = (list) => {
    setInfo({ ...info, productList: list });

  }
  const handleOnChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (discount) {
      const list = products.filter((item) => discount.productList.includes(item._id) || !item.discount);
      setListProduct(list);
    }
  }, [info]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!discount) {
      await axios
        .post(
          `${server}/discount/create-new-discount`, { ...info },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success(res.data.message);
          setOpen(false);
          window.location.reload();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      await axios
        .post(
          `${server}/discount/update-discount`, { ...info },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success(res.data.message);
          setOpen(false);
          window.location.reload();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
      <div className="w-[90%] 800px:w-[80%] h-[70vh] bg-white rounded-md shadow p-4 overflow-y-scroll custom-dashboard">
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
            <input
              type="number"
              name="percent"
              min="1"
              max="99"
              value={info?.percent}
              required
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
                required
                value={info?.startDay.toString().slice(0, 10)}
                onChange={handleOnChange}
              />
            </div>
            <div>
              <p>End Day: </p>
              <input
                type="date"
                name="endDay"
                required
                value={info?.endDay.toString().slice(0, 10)}
                onChange={handleOnChange}
              />
            </div>
          </div>
          <br />
          {discount && (
            <div>
              <label className="pb-2">Status: {info?.status ? "On" : "Off"}</label>
            </div>
          )}
          <br />
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] ml-4 mb-12">
            {listProduct &&
              discount &&
              listProduct?.map((item) => {
                const checked = item.discount;
                return <ProductCardDiscount data={item} discount={info} setListOfSelectedProducts={setListOfSelectedProducts} listOfSelectedProducts={info.productList} checked={checked} />
              })}
          </div>
          <div>
            <input
              type="submit"
              value={discount ? "Update" : "Create"}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
