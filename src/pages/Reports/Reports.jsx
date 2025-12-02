import React from "react";
import "./reports.css";

import { Outlet } from "react-router-dom";

const Reports = () => {
  return (
    <div>
      <Outlet/>
    </div>
  );
};

export default Reports;
