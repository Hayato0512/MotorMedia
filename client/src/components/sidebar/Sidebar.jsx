import "./sidebar.css";
import React, { Component, useContext, useState } from "react";
import {
  RssFeed,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
  Comment,
  Search,
  People,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { axiosInstance } from "../../config";
import FavoriteBikes from "../FavoriteBikes/FavoriteBikes";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [followings, setFollowings] = useState([]);
  const followingsList = user.followings;
  useEffect(() => {
    const fetchFollowings = async () => {
      const list = await Promise.all(
        followingsList.map(
          async (id) => await axiosInstance.get("/users?userId=" + id)
        )
      );
      console.log(`the list from promise.all is ${list}`);

      setFollowings(list);
    };
    fetchFollowings();
  }, [user]);
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <Link style={{ textDecoration: "none" }} to="/">
            <li className="sidebarListItem">
              <RssFeed className="sidebarIcon" />
              <span className="sidebarListItemText">Home</span>
            </li>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/searchMotorCycle">
            <li className="sidebarListItem">
              <Search className="sidebarIcon" />
              <span className="sidebarListItemText">Search MotorCycle</span>
            </li>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/community">
            <li className="sidebarListItem">
              <People className="sidebarIcon" />
              <span className="sidebarListItemText">Community</span>
            </li>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/bookmark">
            <li className="sidebarListItem">
              <Bookmark className="sidebarIcon" />
              <span className="sidebarListItemText">Post Bookmark</span>
            </li>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/questionForum">
            <li className="sidebarListItem">
              <HelpOutline className="sidebarIcon" />
              <span className="sidebarListItemText">Question Forum</span>
            </li>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/job">
            <li className="sidebarListItem">
              <WorkOutline className="sidebarIcon" />
              <span className="sidebarListItemText">Jobs</span>
            </li>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/events">
            <li className="sidebarListItem">
              <Event className="sidebarIcon" />
              <span className="sidebarListItemText">MotorCycle Events</span>
            </li>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/courses">
            <li className="sidebarListItem">
              <School className="sidebarIcon" />
              <span className="sidebarListItemText">MotorCycle Courses</span>
            </li>
          </Link>
        </ul>
        <hr className="sidebarHr" />
        <div className="sidebarFavoriteBikes">
          <FavoriteBikes />
        </div>
      </div>
    </div>
  );
}
