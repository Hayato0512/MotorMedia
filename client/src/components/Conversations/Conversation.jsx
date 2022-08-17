import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { axiosInstance } from "../../config";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    //currentuseじゃない方をとって、そいつを見せるのか

    const getUser = async () => {
      try {
        const res = await axiosInstance("/users?userId=" + friendId);
        setUser(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);
  return (
    <div className="conversation">
      <img
        src={
          user ? PF + "person/" + user.profilePicture : PF + "person/andrew.jpg"
        }
        alt=""
        className="conversationImg"
      />
      <span className="conversationName">
        {user ? user.username : "Loading..."}
      </span>
    </div>
  );
}
