// Code for the main App component
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./modules/auth/Login";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Main from "./modules/main/Main";
import { ToastContainer } from "react-toastify";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import Reports from "./pages/Reports/Reports";
import UserReport from "./pages/Reports/UserReport/UserReport";
import LandReport from "./pages/Reports/LandReport/LandReport";
import MasterLand from "./pages/Reports/LandReport/MasterLand";
import NewLandReport from "./pages/Reports/LandReport/NewLandReport";
import SearchLand from "./pages/Reports/LandReport/SearchLand";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<PublicRoute />}>
          <Route path='/login' element={<Login />} />
        </Route>
        <Route path='/' element={<PrivateRoute />}>
          <Route path='/' element={<Main />}>
            <Route path='/' element={<Dashboard />} />
            <Route path='/reports' element={<Reports />}>
              <Route path='user' element={<UserReport />} />
              <Route path='land' element={<LandReport />} />
              <Route path='new-land' element={<NewLandReport />} />
              <Route path='land-master' element={<MasterLand />} />
              <Route path="search-land" element={<SearchLand/>}/>
            </Route>
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        autoClose={3000}
        draggable={false}
        position='top-right'
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
