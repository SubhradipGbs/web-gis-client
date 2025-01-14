import React, { useEffect } from "react";
import "./sidebar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaClipboardList, FaMapMarkedAlt } from "react-icons/fa";
import MenuItem from "./MenuItem/MenuItem";
import { demoMenu } from "../../../utils/constants";

const menuItems = [
  { id: 1, name: "View Map", path: "/", icon: <FaMapMarkedAlt /> },
  { id: 2, name: "Reports", path: "/reports", icon: <FaClipboardList /> },
];

const Sidebar = () => {
  const [isActive, setIsActive] = React.useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const menuClicked = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const path = location.pathname;
    const menuItem = menuItems.find((item) => item.path === path);
    if (menuItem) {
      setIsActive(menuItem.id);
    }
    console.log("location", location.pathname);
  }, [location]);
  return (
    <div className="sidebar">
      <div className="sidebar-head d-flex p-3">
        <h5>WBPDCL</h5>
      </div>
      <div className="sidebar-body">
        <ul className="sidebar-menu">
          {demoMenu.map((item) => (
            // <li
            //   onClick={() => menuClicked(item.path)}
            //   className={`menu-item ${
            //     isActive == item.id ? "bg-primary text-light" : ""
            //   }`}
            //   key={item.id}
            // >
            //   <span className="menu-icon">{item.icon}</span>
            //   {item.name}
            // </li>
            <MenuItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
