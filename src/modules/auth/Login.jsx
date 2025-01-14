import React from "react";
import "./Login.css";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { userLogin } from "../../store/reducers/auth";
import { demoUsers } from "../../utils/constants";
import { addReport } from "../../store/reducers/report";

const Login = () => {
  const dispatch = useDispatch();
  const login = (username, password) => {
    const user = demoUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      console.log("Login successful");
      const rportItem = {
        userId: user.id,
        username: user.username,
        type: "login",
        timestamp: new Date().toISOString(),
      };
      dispatch(userLogin(user));
    } else {
      console.log("Login failed");
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values);
      login(values.username, values.password);
    },
  });
  return (
    <div className="login-container">
      <div className="login-box bg-light d-flex flex-column justify-content-center align-items-center p-5 shadow rounded">
        <h1 className="login-heading mb-5">Login</h1>
        <form
          className="login-form d-flex flex-column"
          onSubmit={formik.handleSubmit}
        >
          <input
            className="input-field form-control"
            type="text"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange("username")}
          />
          <input
            className="input-field form-control"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange("password")}
          />
          <button className="login-button btn btn-primary" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
