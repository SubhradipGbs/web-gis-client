import React, { useState } from "react";
import "./sidebar.css";
import MenuItem from "./MenuItem/MenuItem";
import { demoMenu } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { FaGear, FaPowerOff } from "react-icons/fa6";
import { userLogout } from "../../../store/reducers/auth";
import { Modal } from "react-bootstrap";

const Sidebar = () => {
  const { sideNavCollapse } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  console.log("User in Sidebar:", user);
  const handleOkClick = () => {
    dispatch(userLogout());
    setShow(false);
  };

  const logout = () => {
    setShow(true);
  };

  return (
    <div className={`sidebar ${sideNavCollapse ? "collapsed" : ""}`}>
      <div className='sidebar-head d-flex p-3 text-center'>
        <h5>WBPDCL</h5>
      </div>
      <div>
        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header
            className='bg-danger text-light'
            closeButton
            style={{ borderBottom: "none", color: "#ff0000" }}>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='d-flex flex-column'>
              {/* <h5>Are you sure?</h5> */}
              <p>Do you want to logout?</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className='d-flex justify-content-end gap-2'>
              <button className='btn btn-danger' onClick={handleOkClick}>
                <FaPowerOff className='me-1' />
                Logout
              </button>
              <button
                className='btn btn-outline-primary'
                onClick={() => setShow(false)}>
                Cancel
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
      <div className='sidebar-body'>
        <ul className='sidebar-menu'>
          {demoMenu.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </ul>
        <div className='my-2'>
          <ul className='settings-menu'>
            <li className='settings-menu-item active mx-1 rounded'>
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
            <li
              className='settings-menu-item logout text-danger'
              onClick={logout}>
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
