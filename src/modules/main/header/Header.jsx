import React from "react";
import "./header.css";
import { LuLogOut } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../store/reducers/auth";
import { FaBars } from "react-icons/fa";
import MapHeader from "../../../Components/MapHeader/MapHeader";
import { useLocation } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(userLogout());
  };
  const location = useLocation();

  console.log(location);

  return (
    <div className="header">
      <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn d-flex align-items-center"
          onClick={toggleSidebar}
        >
          <FaBars size={20} />
        </button>
      </div>
      {location.pathname == "/" && (
        <div className="flex-grow-1">
          <MapHeader />
        </div>
      )}
      <div className="header__content">
        <button
          className="btn btn-sm btn-danger d-flex align-items-center gap-1"
          onClick={logout}
        >
          <LuLogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
