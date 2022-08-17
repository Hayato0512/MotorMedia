import "./register.css";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import { axiosInstance } from "../../config";
export default function Register() {
  const username = useRef();
  const searchId = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useNavigate();
  const handleClick = async (e) => {
    console.log("debug: handleClick just called");
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      password.current.setCustomValidity("Password don't match!");
    } else {
      const user = {
        username: username.current.value,
        searchId: searchId.current.value,
        email: email.current.value,
        password: password.current.value,
        city: "",
        age: "",
      };
      try {
        console.log("debug: came into try. wait for the Axios");
        await axiosInstance.post("/auth/register", user);
        console.log("debug: I'll push you to the Login");
        history("/login");
      } catch (error) {
        console.log("debug:something is wrong here.");
        console.log(error);
      }
    }
  };

  // const loginButtonClicked = () => {
  //   window.location.replace("/login");
  // };

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
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="User ID"
              required
              ref={searchId}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              required
              placeholder="Password"
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              required
              placeholder="Password again"
              ref={passwordAgain}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <Link to={"/login"} className="loginRegisterButtonLink">
              <button className="loginRegisterButton">Log into Account</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
