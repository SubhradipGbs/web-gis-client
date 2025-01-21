import React from "react";
import "./mapheader.css";
import { FaTools } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawer } from "../../store/reducers/ui";

const MapHeader = () => {
  const {drawerOpen}= useSelector((state)=>state.ui);
  const dispatch = useDispatch();

  return (
    <div className="header-container d-flex align-items-center justify-content-end mx-2" >
      <div>
        <button className="btn text-light" onClick={()=>{dispatch(toggleDrawer())}}>
          <FaTools />
        </button>
      </div>
    </div>
  );
};

export default MapHeader;
