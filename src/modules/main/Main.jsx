import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import "./main.css";

const Main = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="d-flex vh-100 vw-100">
      <div
        className={`main d-flex flex-row w-100 h-100 ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        <Sidebar isCollapsed={isCollapsed} />
        <div className="main-container flex-grow-1">
          <Header toggleSidebar={toggleSidebar} />
          <div className="container-fluid content px-4 py-2">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
