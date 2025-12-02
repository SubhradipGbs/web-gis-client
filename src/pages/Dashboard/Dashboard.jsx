import React, { useEffect, useRef, useState } from "react";
import MapWrapper from "../../Components/MapWrapper";
import { Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changeSideNav, toggleDrawer } from "../../store/reducers/ui";
import MapViewer from "../../Components/MapVewer/MapViewer";
import "./dashboard.css";
import { colorCodes } from "../../utils/constants";

const Dashboard = () => {
  const { drawerOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const parentRef = useRef();

  useEffect(() => {
    dispatch(changeSideNav(true));
  }, []);

  return (
    <div className='w-100 h-100 offcanvas-parent' ref={parentRef}>
      <div className={`custom-offcanvas ${drawerOpen ? "open" : ""}`}>
        <div className='offcanva-body d-flex flex-wrap justify-content-start align-items-center px-2'>
          {colorCodes.map((item) => (
            <div className='info-box'>
              <div
                className={`color-box ${item.class ? item.class : ""}`}
                style={{
                  background: item.color,
                  border: `2px solid ${item.border}`,
                }}></div>
              <p className='color-title'>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='w-100 h-100'>
        <MapViewer />
      </div>
    </div>
  );
};

export default Dashboard;
