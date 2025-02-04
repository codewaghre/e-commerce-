import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import logo from "../assets/logo/logo.png";
import { auth } from "../firebase";
import { User } from "../types/types";



interface Propstypes {
  user: User | null
}

function Header({ user }: Propstypes) {


  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = async () => {
      try {
        await signOut(auth)
        setIsOpen(false)
        toast.success("Logout Sucessfully")
      } catch (error) {
        toast.error("Signout Failed")
      } 
  }
  


  return (
    <>
      <nav className="head">
        
        {/* logo */}
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>

        {/* Header Handler */}
        <div className="header"> 

          <Link to={"/"}>
            Home
          </Link>

          <Link to={"search"}>
            <FaSearch />
          </Link>

          <Link to={"/cart"}>
            <FaShoppingBag />
          </Link>
          
          
          {user?._id ? (
            <>
              <button onClick={() => setIsOpen((prev) => !prev)}>
                <FaUser />
              </button>
              
              <dialog open={isOpen}>
                
                <div>
                  {user.role === "admin" && (
                    <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                      Admin
                    </Link>
                  )}
                  
                  <Link onClick={() => setIsOpen(false)} to="/orders">
                    Orders
                  </Link>
                  
                  <button onClick={logoutHandler}>
                    <FaSignOutAlt />
                  </button>
                </div>
                
              </dialog>
            </>
          ) : (
              <Link to={"/login"}>
                <FaSignInAlt />
            </Link>
          )}
        </div>
      </nav>
    </>
  )
}

export default Header