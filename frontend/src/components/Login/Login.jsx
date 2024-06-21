import { React, useState } from "react";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Input from "../Inputs/Input";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { loadUser } from "../../redux/actions/user";

const Login = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    email: '', password: ''
  });

  const dispatch = useDispatch()
  
  const handleOnChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(info)
    await axios.post(`${server}/user/login-user`, {...info},{ withCredentials: true })
      .then((res) => {
        toast.success("Login Success!");
        navigate("/");
        window.location.reload(true); 
      })
      .catch((err) => {
        toast.error("Account is wrong");
        console.log(JSON.stringify(err))
      });
  };

  const siginWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        axios.post(`${server}/user/google`, {
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL
        },{ withCredentials: true }).then((res) => {
          toast.success("Login successfully", {
            position: 'top-right',
            autoClose: 3000, // Time in milliseconds for the toast to close automatically
          });
          navigate("/")
          window.location.reload(true); 
        })
      }).catch((error) => {
        console.log(error)
        toast.error("Account is wrong");
        // dispatch(loginFailure())
      })
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Email Address" value={info.email} name="email" type="email" placeholder="Email" onChange={handleOnChange} 
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                styleLabel="block text-sm font-medium text-gray-700"
            />
            <Input label="Password" value={info.password} name="password" type="password" placeholder="Password" onChange={handleOnChange} 
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                styleLabel="block text-sm font-medium text-gray-700"
            />
            <div className={`${styles.noramlFlex} justify-between`}>
              <div className={`${styles.noramlFlex}`}>
                <input type="checkbox" name="remember-me" id="remember-me" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900" >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href=".forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button type="submit" className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Submit
              </button>
            </div>
            
            <div className={`${styles.noramlFlex} w-full`}>
              <h4>Not have any account?</h4>
              <Link to="/sign-up" className="text-blue-600 pl-2">
                Sign Up
              </Link>
            </div>
          </form>
          <div>
            <button onClick={siginWithGoogle} className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-slate-300 hover:bg-slate-500">
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;