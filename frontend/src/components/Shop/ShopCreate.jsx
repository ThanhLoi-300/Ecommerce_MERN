import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import Input from "../../components/Inputs/Input";
import { useSelector } from "react-redux";

const ShopCreate = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const input = {
    email: user.email, nameShop: user.name, phoneNumber: user.phoneNumber,
    address: user.address, idUser: user._id
  }
  console.log(user._id)
  const [info, setInfo] = useState(input);

  const handleOnChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post(`${server}/shop/create-shop`, {...info}).then((res) => {
      toast.success(res.data.message);
      navigate("/dashboard")
      window.location.reload(true); 
      setInfo(input)
    })
    .catch((error) => {
      toast.error(error.response.data.message);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a seller
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Shop Name" value={info.nameShop} name="nameShop" type="text" placeholder="Shop Name" onChange={handleOnChange} 
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              styleLabel="block text-sm font-medium text-gray-700"
            />

            <Input label="Phone Number" value={info.phoneNumber} name="phoneNumber" type="number" placeholder="Phone Number" onChange={handleOnChange} 
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              styleLabel="block text-sm font-medium text-gray-700"
            />

            <Input label="Email address" readOnly value={info.email} name="email" type="email"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              styleLabel="block text-sm font-medium text-gray-700" 
            />

            <Input label="Address" value={info.address} name="address" type="text" placeholder="Address" onChange={handleOnChange} 
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              styleLabel="block text-sm font-medium text-gray-700"
            />

            <div>
              <button type="submit" className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;