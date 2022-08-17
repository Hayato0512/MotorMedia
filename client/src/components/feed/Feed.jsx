import "./feed.css";
import React, { Component, useState, useEffect, useContext } from "react";
import Share from "../share/Share";
import Post from "../post/Post";
import axios from "axios";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";

//username is not coming. if username is coming, that just means it is home page. if coming, that is profile page.
export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchPosts = async () => {
      console.log("username is like this", username);
      console.log("user is like this" + user);
      console.log("user._id is liek this" + user._id);
      const res = username
        ? await axiosInstance.get("/posts/profile/" + username)
        : await axiosInstance.get("/posts/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);
  //this [] mean, run this useEffect, only once when render feed.
  //dont listen to changes//so if i do [text], everytime text changes,
  //this will run.

  //<input type="text" onChange={(e) => setText(e.target.value)} />
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}

        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
