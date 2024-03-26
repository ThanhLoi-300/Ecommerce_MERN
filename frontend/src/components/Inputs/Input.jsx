import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Input = ({ label, name, type, styleLabel, ...rests }) => {
    const [visible, setVisible] = useState(false);

    const checkType = () => {
        if (name === "password") return visible ? "text" : "password"
        else return type
    }

    const showPassword = () => {
        if (name === "password") {
            return visible ? ( <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )
        }else return null;
    }
  return (
    <div>
      <label htmlFor={name} className={styleLabel} >
        {label}
      </label>
      <div className={`mt-1 relative`}>
        <input
          type={checkType()}
          name={name}
          autoComplete={type === "email" ? "email" : undefined}
          required
          {...rests}
        />
        {showPassword()}
      </div>
    </div>
  );
};

export default Input;
