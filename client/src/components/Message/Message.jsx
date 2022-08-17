import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { axiosInstance } from "../../config";
import "./message.css";
import { format } from "timeago.js";

export default function Message({ message, own }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    //get user here with message.sender
    const getUser = async () => {
      try {
        const res = await axiosInstance("/users?userId=" + message.sender);
        setUser(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [message]);
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={
            user
              ? PF + "person/" + user.profilePicture
              : PF + "person/andrew.jpg"
          }
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
