import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import Input from "../Inputs/Input";
import { uploadFiles } from "../../utils/uploadFile";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);

  const [info, setInfo] = useState({
    name: "",
    description: "",
    category: categoriesData[0].title,
    tags: "",
    originalPrice: null,
    discountPrice: 0,
    stock: null,
    shopId: seller._id,
    images: [],
  });

  const handleOnChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
    // console.log(info.category)
  };

  useEffect(() => {
    if (error) toast.error(error);
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
          info.images.push(file);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (info.images.length > 0) {
      info.images = await uploadFiles(info.images);
      dispatch(createProduct(info));
    } else {
      toast.error("Please choose images");
    }
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      {/* create product form */}
      <form onSubmit={handleSubmit}>
        <br />
        <Input
          label="Name"
          value={info.name}
          name="name"
          type="text"
          placeholder="Enter your product name..."
          onChange={handleOnChange}
          className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          styleLabel="pb-2"
        />
        <br />
        <div>
          <label className="pb-2">Description</label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={info.description}
            onChange={handleOnChange}
            placeholder="Enter your product description..."
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">Category</label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            name="category"
            required
            value={info.category}
            onChange={handleOnChange}
          >
            <option
              value={categoriesData[0].title}
              key={categoriesData[0].title}
            >
              {categoriesData[0].title}
            </option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>
        <br />
        {/* <Input label="Tags" value={info.tags} name="tags" type="text" placeholder="Enter your product tags..." onChange={handleOnChange} 
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                styleLabel="pb-2"
            /> */}
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={info.tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleOnChange}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <Input
          label="Original Price"
          value={info.originalPrice}
          name="originalPrice"
          type="number"
          placeholder="Enter your product price..."
          onChange={handleOnChange}
          className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          styleLabel="pb-2"
          min="1"
        />
        <br />
        <Input
          label="Price (With Discount)"
          value={info.discountPrice}
          name="discountPrice"
          type="number"
          placeholder="Enter your product price with discount..."
          onChange={handleOnChange}
          className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          styleLabel="pb-2"
          min="0"
        />
        <br />
        <Input
          label="Product Stock"
          value={info.stock}
          name="stock"
          type="number"
          placeholder="Enter your product stock..."
          onChange={handleOnChange}
          className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          styleLabel="pb-2"
          min="1"
        />
        <br />

        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i) => (
                <img
                  src={i}
                  key={i}
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
          <br />
          <div>
            <input
              type="submit"
              value="Create"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
