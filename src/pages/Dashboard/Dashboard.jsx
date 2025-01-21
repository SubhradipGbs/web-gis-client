import React, { useState } from "react";
import MapWrapper from '../../Components/MapWrapper';
import { Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawer } from "../../store/reducers/ui";
import MapViewer from "../../Components/MapVewer/MapViewer";

const Dashboard = () => {
  const {drawerOpen}= useSelector((state)=>state.ui);
  const dispatch = useDispatch();

  return (
    <div className="w-100 h-100">
      <Offcanvas
        show={drawerOpen}
        onHide={() => {
          dispatch(toggleDrawer());
        }}
        placement="end"
        style={{ width: "200px" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Tools</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body></Offcanvas.Body>
      </Offcanvas>
      <div className="w-100 h-100">
        <MapViewer/>
        {/* <h1>Hello World</h1> */}
      </div>
    </div>
  );
};

export default Dashboard;
