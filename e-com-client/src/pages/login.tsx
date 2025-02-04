import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useLoginMutation } from "../redux/api/userAPI";

import { MessageResponse } from "../types/api-types";




function Login() {
    
  const navigate = useNavigate()
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const  [login] = useLoginMutation()
  
  const loginHandler = async () => {
      try {
        
        const provider = new GoogleAuthProvider()
        const { user } = await signInWithPopup(auth, provider);
        
        const res = await login({
          name: user.displayName!,
          email: user.email!,
          photo: user.photoURL!,
          gender,
          role: "user",
          dob: date,
          _id: user.uid,
        });
        
        if ("data" in res) {
          const msg = res.data?.message || "Login Sucessfull!" 
          toast.success(msg);

          navigate("/")
          
          // const data = await getUser(user.uid);
          // dispatch(userExist(data?.user!));
        } else {
          const error = res.error as FetchBaseQueryError;
          const message = (error.data as MessageResponse).error || "Please Fill All Fileds" 
          toast.error(message);
          // dispatch(userNotExist());
      }
        
    
        
      } catch (error) {
        toast.error("Sign in Fail")
      }
    }    
    return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label>Date of birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
    )
}

export default Login