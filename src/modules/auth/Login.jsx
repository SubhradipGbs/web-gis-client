import React, { useEffect, useState } from "react";
import "./Login.css";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { userLogin } from "../../store/reducers/auth";
import { sleep } from "../../utils/helpers";
import Preloader from "../../Components/PreLoader/PreLoader";
import apiClient from "../../utils/apiClient";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  const dispatch = useDispatch();
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(
        `/auth/login`,
        {
          email,
          password,
        }
      );
      setIsLoading(false);
      if (response.status === 200) {
        const user = response.data.data;
        // const rportItem = {
        //   userId: user.id,
        //   username: user.username,
        //   type: "login",
        //   timestamp: new Date().toISOString(),
        // };
        dispatch(userLogin(user));
      } else {
        setIsLoading(false);
        setErrorMessage("Invalid username or password");
        console.log("Login failed");
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.response?.data?.message || "Login failed");
      console.error("Error during login:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values);
      login(values.email, values.password);
    },
  });

  useEffect(() => {
    async function loaderFn() {
      await sleep(1000);
      setIsAppLoaded(true);
    }
    loaderFn();
  }, []);

  return (
    <>
      {!isAppLoaded ? (
        <div className='login-container'>
          <Preloader />
        </div>
      ) : (
        <div className='login-container'>
          <header className='login-header'>
            <h1 className='header-title'>
              Deucha Land Information Management System
            </h1>
          </header>
          <div className='form-conteiner'>
            <div className='login-form1'>
              <div className='logo'>
                <img
                  src='/logo.png'
                  alt='WB Government Logo'
                  className='logo-img'
                />
              </div>

              <h2 className='login-title'>Deucha Portal</h2>
              <form onSubmit={formik.handleSubmit}>
                <div className='input-grp'>
                  <label htmlFor='email'>Email</label>
                  <input
                    type='email'
                    id='email'
                    placeholder='Enter email'
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    required
                  />
                </div>
                <div className='input-grp'>
                  <label htmlFor='password'>Password</label>
                  <input
                    type='password'
                    id='password'
                    placeholder='Enter password'
                    value={formik.values.password}
                    onChange={formik.handleChange("password")}
                    required
                  />
                </div>
                {errorMessage && <p className='error'>{errorMessage}</p>}

                <button
                  type='submit'
                  className='login-btn'
                  disabled={isLoading}>
                  {isLoading ? "Loading..." : "Login"}
                </button>
              </form>
              {/* {isLoading && <div className='loading'>Loading...</div>} */}
            </div>
          </div>

          <footer className='login-footer'>
            <div className='footer-content'>
              <div className='footer-logo'>
                <img
                  src='/mainfooterbg.png'
                  alt='WB Government Footer Logo'
                  className='footer-img'
                />
              </div>
              <div className='footer-text'>
                <p>&copy; 2025 West Bengal Government. All rights reserved.</p>
                <p>
                  <a href='/privacy-policy'>Privacy Policy</a> |{" "}
                  <a href='/terms-of-service'>Terms of Service</a> |{" "}
                  <a href='/contact'>Contact Us</a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default Login;
