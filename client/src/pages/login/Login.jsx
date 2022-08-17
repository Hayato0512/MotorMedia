import { useRef, useContext } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import validator from "validator";
import { axiosInstance } from "../../config";
import { useState } from "react";
export default function Login() {
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const [emailError, setEmailError] = useState("");
  const handleClick = async (e) => {
    console.log(email.current.value);
    e.preventDefault();
    //it's fine, now, just fetch the user quickly, and then tell if the password is correct.

    try {
      const res = await axiosInstance.get(
        `/users/email/${email.current.value}`
      );
      console.log(`in login, fetching the user. res.data is ${res.data}`);
      console.log(`password.current.value is like ${password.current.value}`);

      // if (res.data.password === password.current.value) {
      loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      );
      // } else {
      // console.log("Password is incorrect, fuck off ");
      // }
    } catch (error) {
      console.log("the email doesn't exist ");
      console.log(error);
    }
  };

  const validateEmail = (e) => {
    var email = e.target.value;
    if (e.target.value.length > 5) {
      if (validator.isEmail(email)) {
        setEmailError("Valid Email :)");
      } else {
        setEmailError("Enter valid Email!");
      }
    } else {
      setEmailError("");
    }
  };

  console.log(user);
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">MotorMedia</h3>
          <span className="loginDesc">
            Welcome. this is a place where you meet cool people. If you are not
            one, then Fuck off.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              ref={email}
              type="email"
              className="loginInput"
              required
              onChange={(e) => validateEmail(e)}
            />
            <input
              placeholder="Password"
              type="password"
              className="loginInput"
              minLength="6"
              required
              ref={password}
            />
            <span className="validMessage">{emailError}</span>
            <button type="submit" disabled={isFetching} className="loginButton">
              {isFetching ? <CircularProgress size="15px" /> : "Log in"}
            </button>
            <span className="loginForgot">Forgot Passowrd?</span>
            <Link to="/register">
              <button className="loginRegisterButton">
                create a New Account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
