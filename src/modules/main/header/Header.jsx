import React from "react";
import "./header.css";
import { LuLogOut } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../../store/reducers/auth";
import { FaBars } from "react-icons/fa";
import MapHeader from "../../../Components/MapHeader/MapHeader";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toggleSideNav } from "../../../store/reducers/ui";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const logout = async () => {
    // await axios.post("http://localhost:3000/auth/logout", {
    //   userId: user.email,
    // });
    dispatch(userLogout());
  };
  const toggleSidebar = () => {
    dispatch(toggleSideNav());
  };
  const location = useLocation();

  return (
    <div className='header'>
      <div className='d-flex justify-content-center align-items-center'>
        <button
          className='btn d-flex align-items-center text-light'
          onClick={toggleSidebar}>
          <FaBars size={20} />
        </button>
      </div>
      {location.pathname == "/" && (
        <div className='flex-grow-1'>
          <MapHeader />
        </div>
      )}
      <div className='header__content'>
        <button
          className='btn btn-sm btn-danger d-flex align-items-center gap-1'
          onClick={logout}>
          <LuLogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
