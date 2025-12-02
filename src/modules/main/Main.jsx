import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import "./main.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideNav } from "../../store/reducers/ui";
import Preloader from "../../Components/PreLoader/PreLoader";
import { sleep } from "../../utils/helpers";

const Main = () => {
  const { sideNavCollapse } = useSelector((state) => state.ui);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    dispatch(toggleSideNav());
  };

  useEffect(() => {
    async function loadingApp() {
      await sleep(1000);
      setIsAppLoaded(true);
    }
    loadingApp();
  }, []);

  return (
    <div className='d-flex vh-100 vw-100'>
      {!isAppLoaded ? (
        <div>
          <Preloader />
        </div>
      ) : (
        <div className={`main d-flex flex-row w-100 h-100`}>
          <Sidebar />
          <div
            className={`main-container ${sideNavCollapse ? "collapsed" : ""}`}>
            <Header toggleSidebar={toggleSidebar} />
            <div className='content px-2 py-2'>
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
