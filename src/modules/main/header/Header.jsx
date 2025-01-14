import React from "react";
import "./header.css";
import { LuLogOut } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../store/reducers/auth";

const Header = () => {
  const dispatch = useDispatch();
  const logout=()=>{
    dispatch(userLogout());
  }
  return (
    <div className="header">
      <h5>Header</h5>
      <div className="header__content">
        <button className="btn btn-danger d-flex align-items-center gap-1" onClick={logout}>
          <LuLogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
