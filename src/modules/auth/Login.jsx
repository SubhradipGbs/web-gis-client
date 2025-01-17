import React from "react";
import "./Login.css";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { userLogin } from "../../store/reducers/auth";
import axios from "axios";

const Login = () => {
  const dispatch = useDispatch();
  const login = async (email, password) => {
    const response = await axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    });

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
      console.log("Login failed");
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
  return (
    <div className='login-container'>
      <video autoPlay loop muted id='background_vid'>
        <source src='/Deocha_Sample_video.mp4' type='video/mp4' />
      </video>
      <div className='login-box d-flex flex-column justify-content-center align-items-center p-5 rounded'>
        <h1 className='login-heading mb-5'>Login</h1>
        <form
          className='login-form d-flex flex-column'
          onSubmit={formik.handleSubmit}>
          <input
            className='input-field form-control'
            type='email'
            placeholder='Email'
            value={formik.values.email}
            onChange={formik.handleChange("email")}
          />
          <input
            className='input-field form-control'
            type='password'
            placeholder='Password'
            value={formik.values.password}
            onChange={formik.handleChange("password")}
          />
          <button className='login-button btn btn-primary' type='submit'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
