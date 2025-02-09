import React from "react";
import "./sidebar.css";
import MenuItem from "./MenuItem/MenuItem";
import { demoMenu } from "../../../utils/constants";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { FaGear, FaPowerOff } from "react-icons/fa6";

const Sidebar = () => {
  const { sideNavCollapse } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

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
        <div className='my-2'>
          <ul className='settings-menu'>
            <li className='settings-menu-item active'>
              <span className='nav-icons'>
                <FaUserCircle size={35} />
              </span>
              <span className='nav-title'>{user?.name}</span>
            </li>
            <li className='settings-menu-item'>
              <span className='nav-icons'>
                <FaGear />
              </span>
              <span className='nav-title'>Settings</span>
            </li>
            <li className='settings-menu-item logout text-danger'>
              <span className='nav-icons'>
                <FaPowerOff />
              </span>
              <span className='nav-title'>Logout</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
