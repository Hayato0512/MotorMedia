import React from "react";
import "./closeFriend.css";
import { Users } from "../../dummyData";

export default function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log("in closeFriend, user is like this", user);
  return (
    <li className="sidebarFriend">
      <img
        src={PF + user.data.profilePicture}
        alt=""
        className="sidebarFriendImg"
      />
      <span className="sidebarFriendName">{user.data.username}</span>
    </li>
  );
}
