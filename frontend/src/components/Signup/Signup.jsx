import { React, useState } from "react";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Input from "../Inputs/Input";
import ConfirmOTP from "./ConfirmOTP";

const Singup = () => {
  const input = {
    email: '', password: '', name: ''
  }

  const [otp, setOTP] = useState("")

  const [info, setInfo] = useState(input);
  const [modalOTP, setModalOTP] = useState(false);
  
  const handleOnChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios.post(`${server}/user/create-user`, { ...info })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          setOTP(res.data.data)
          setModalOTP(true)
        } else {
          toast.error(res.data.message)
        }
      })
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a new user
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Full Name" value={info.name} name="name" type="text" placeholder="Full name" onChange={handleOnChange} 
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                styleLabel="block text-sm font-medium text-gray-700"
            />
            <Input label="Email Address" value={info.email} name="email" type="email" placeholder="Email" onChange={handleOnChange} 
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                styleLabel="block text-sm font-medium text-gray-700"
            />
            <Input label="Password" value={info.password} name="password" type="password" placeholder="Password" onChange={handleOnChange} 
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                styleLabel="block text-sm font-medium text-gray-700"
            />
            
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700"
              ></label>
            </div>

            <div>
              <button type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
            <div className={`${styles.noramlFlex} w-full`}>
              <h4>Already have an account?</h4>
              <Link to="/login" className="text-blue-600 pl-2">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
      {modalOTP && <ConfirmOTP otp={otp} setModalOTP={setModalOTP} info={ info} />}
    </div>
  );
};

export default Singup;