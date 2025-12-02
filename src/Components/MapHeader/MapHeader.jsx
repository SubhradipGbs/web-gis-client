import React from "react";
import "./mapheader.css";
import { FaInfoCircle, FaTools } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawer } from "../../store/reducers/ui";

const MapHeader = () => {
  const { drawerOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <div className='header-container d-flex align-items-center justify-content-end mx-2'>
      <button
        className='btn text-light'
        onClick={() => {
          dispatch(toggleDrawer());
        }}>
        <FaInfoCircle size={25} />
      </button>
    </div>
  );
};

export default MapHeader;
