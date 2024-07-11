import axios from "axios";
import React, { useState } from "react";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../server";

const ConfirmOTP = ({ otp, setModalOTP, info }) => {
  const [inputOTP, setInputOTP] = useState("");
  const navigate = useNavigate();

  const confirmOTP = () => {
    if (!inputOTP || otp != inputOTP) toast.error("OTP is invalid");
    if (otp == inputOTP) {
      axios
        .post(`${server}/user/activation`, { ...info })
        .then((res) => {
          toast.success(res.data.message);
          setModalOTP(false);
          navigate("/login");
          setInfo(input);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  };
  return (
    <div className="w-full bg-slate-100 fixed">
      <div className="w-1/2 mx-auto">
        <h1
          className={`text-[25px] font-[500] font-Poppins text-center py-2 text-black`}
        >
          Input OTP
        </h1>
        <br />
        <div className="w-full flex items-center justify-center mt-2">
          <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
            <VscWorkspaceTrusted size={40} />
          </div>
        </div>
        <br />
        <br />
        <div className="m-auto flex items-center justify-around">
          <input
            type="number"
            className={`w-[350px] h-[65px] border-[3px] rounded-[10px] flex items-center text-black justify-center text-[18px] font-Poppins outline-none text-center`}
            placeholder="OTP"
            value={inputOTP}
            onChange={(e) => setInputOTP(e.target.value)}
          />
        </div>
        <br />
        <br />
        <div className="w-full flex justify-center">
          <button
            className={
              "flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer bg-[#2190ff] min-h-[45px] w-full text-[16px] font-Poppins font-semibold"
            }
            onClick={confirmOTP}
          >
            Verify OTP
          </button>
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black">
          Go back to sign up?
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setModalOTP(false)}
          >
            Close
          </span>
        </h5>
      </div>
    </div>
  );
};

export default ConfirmOTP;
