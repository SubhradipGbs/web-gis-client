import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import "./main.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideNav } from "../../store/reducers/ui";

const Main = () => {
  const { sideNavCollapse } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    dispatch(toggleSideNav());
  };

  return (
    <div className='d-flex vh-100 vw-100'>
      <div
        className={`main d-flex flex-row w-100 h-100 ${
          sideNavCollapse ? "collapsed" : ""
        }`}>
        <Sidebar />
        <div className='main-container flex-grow-1'>
          <Header toggleSidebar={toggleSidebar} />
          <div className='content px-2 py-2'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
