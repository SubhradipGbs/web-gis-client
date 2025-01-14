import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import "./main.css";

const Main = () => {
  return (
    <div className="d-flex vh-100 vw-100">
      <div className="main d-flex flex-row w-100 h-100">
        <Sidebar />
        <div className="main-container">
          <Header />
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
