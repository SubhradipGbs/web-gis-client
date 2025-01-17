import React from "react";
import "./sidebar.css";
import MenuItem from "./MenuItem/MenuItem";
import { demoMenu } from "../../../utils/constants";

const Sidebar = ({ isCollapsed }) => {
  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-head d-flex p-3 text-center">
        <h5>WBPDCL</h5>
      </div>
      <div className="sidebar-body">
        <ul className="sidebar-menu">
          {demoMenu.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
