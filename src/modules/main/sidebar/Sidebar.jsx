import React from "react";
import "./sidebar.css";
import MenuItem from "./MenuItem/MenuItem";
import { demoMenu } from "../../../utils/constants";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { sideNavCollapse } = useSelector((state) => state.ui);
  return (
    <div className={`sidebar ${sideNavCollapse ? "collapsed" : ""}`}>
      <div className='sidebar-head d-flex p-3 text-center'>
        <h5>WBPDCL</h5>
      </div>
      <div className='sidebar-body'>
        <ul className='sidebar-menu'>
          {demoMenu.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </ul>
        <h5>Hello</h5>
      </div>
    </div>
  );
};

export default Sidebar;
