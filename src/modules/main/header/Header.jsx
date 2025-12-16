import React, { useEffect, useRef, useState } from "react";
import "./header.css";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../../store/reducers/auth";
import { FaBars, FaUser } from "react-icons/fa";
import MapHeader from "../../../Components/MapHeader/MapHeader";
import { useLocation } from "react-router-dom";
import { toggleSideNav } from "../../../store/reducers/ui";
import { FaPowerOff } from "react-icons/fa6";
import { Dropdown, Modal } from "react-bootstrap";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleSidebar = () => {
    dispatch(toggleSideNav());
  };
  const location = useLocation();

  const handleOkClick = () => {
    dispatch(userLogout());
    setShow(false);
  };
  const [show, setShow] = useState(false);

  // const openLogout = () => {
  //   setShow(true);
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header
          className="bg-danger text-light"
          closeButton
          style={{ borderBottom: "none", color: "#ff0000" }}
        >
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            {/* <h5>Are you sure?</h5> */}
            <p>Do you want to logout?</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-sm btn-danger" onClick={handleOkClick}>
              <FaPowerOff className="me-1" />
              Logout
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn d-flex align-items-center text-light"
          onClick={toggleSidebar}
        >
          <FaBars size={20} />
        </button>
      </div>

      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <h5 className="text-light align-middle m-0 text-nowrap">
          Deucha Land Information
          <span className="d-none d-md-inline"> Management System</span>
        </h5>
      </div>
      {location.pathname == "/" && (
        <div>
          <MapHeader />
        </div>
      )}
      <div
        className="user_info d-none d-md-flex justify-content-center align-items-center gap-3"
        ref={dropdownRef}
      >
        <div className="h-100 d-flex align-items-center gap-2">
          <div
            className="bg-light border rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "30px", height: "30px", cursor: "pointer" }}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <FaUser size={18} color="#001f3d" />
          </div>
          <span>
            <p
              className="m-0 d-none d-lg-block"
              style={{ textTransform: "capitalize" }}
            >
              {user?.name}
            </p>
          </span>
          <div>
            {open && (
              <ul
                className="dropdown-menu dropdown-menu-end show mt-2"
                style={{ position: "absolute", right: "50px", top: "48px" }}
              >
                {/* <li>
                  <a className="dropdown-item" href="/profile">
                    Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/settings">
                    Settings
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li> */}
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => setShow(true)}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
        {/* <button
          className='btn btn-sm btn-danger d-flex align-items-center gap-1 rounded-circle p-1'
          onClick={openLogout}>
          <FaPowerOff size={18} />
        </button> */}
      </div>
    </div>
  );
};

export default Header;
