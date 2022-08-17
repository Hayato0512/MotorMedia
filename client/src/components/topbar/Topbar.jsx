import React, { Component, useContext } from "react";
//useRef to get the input field value.
import {
  Search,
  Person,
  Chat,
  Notifications,
  Settings,
} from "@material-ui/icons";
import "./topbar.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import { axiosInstance } from "../../config";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const inputRef = useRef();
  const navigate = useNavigate();

  const searchButtonClicked = async () => {
    console.log(inputRef.current.value);
    console.log(
      `since the searchInput is ${inputRef.current.value}, we search it in the UserDataBase. if exist, we take you to the profile page.`
    );
    //throw axios call with the name.
    //like, find one => which file is doing it? let's see,
    const searchedSearchId = inputRef.current.value;
    try {
      const res = await axiosInstance.get(
        `/users/searchId/${searchedSearchId}`
      );
      console.log(
        "inTopBar, res.data is this. let's jump into this guys profile",
        res.data
      );
      navigate(`/profile/${res.data.username}`);
      //ok, how to jump to the profile???->let's see in profile page, how to jump to other's profile
    } catch (error) {
      console.log(error);
      //let's show the result =>
      console.log("sorry, there is no username like that");
    }
  };
  const logoutClicked = () => {
    console.log("logout clicked");
    localStorage.removeItem("user");
    window.location.replace("/");
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Motor Media</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            ref={inputRef}
            placeholder="Search for friend loser"
            className="searchInput"
          />
          <button onClick={searchButtonClicked} className="topbarSearchButton">
            go
          </button>
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks"></div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Link to="/friendRequest" style={{ textDecoration: "none" }}>
              <Person className="friendRequestIcon" />
            </Link>
          </div>
          <div className="topbarIconItem">
            <Link to="/messenger">
              <Chat className="topbarChatIcon" />
            </Link>
          </div>
        </div>
        <Link to={`/setting/${user.username}`}>
          <Settings className="topbarSetting" />
        </Link>

        <button className="logoutButton" onClick={logoutClicked}>
          log out
        </button>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + "person/" + user.profilePicture
                : PF + "person/" + "andrew.jpg"
            }
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
