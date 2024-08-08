import React, { Component } from "react";
import Login from "./pages/login/Login";
import Messenger from "./pages/Messenger/Messenger";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Setting from "./pages/setting/Setting";
// import Chat from "./pages/Chat/Chat";
import Blog from "./pages/Blog/Blog";
import Comment from "./pages/Comment/Comment";
import Community from "./pages/Community/Community";
import DetailCommunity from "./pages/ DetailCommunity/DetailCommunity";
import Bookmark from "./pages/Bookmark/Bookmark";
import QuestionForum from "./pages/QuestionForum/QuestionForum";
import Job from "./pages/Job/Job";
import Events from "./pages/Events/Events";
import Courses from "./pages/Courses/Courses";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import SearchMotorCycle from "./pages/SearchMotorCycle/SearchMotorCycle";
import FriendRequest from "./pages/FriendRequest/FriendRequest";

//        <Route exact path="/" element={user ? <Home /> : <Register />} />
function App() {
  var { user } = useContext(AuthContext);
  if (user) {
    //user超変な感じになってますよ。
    // console.log("the user is not null");
    console.log(
      "in APP.js, we are about to throw this guy into the local storage",
      user
    );
    console.log("lets just throw this instead", user._id);
    //throw id, instead of a whole thing
    localStorage.setItem("user", JSON.stringify(user));
    // localStorage.setItem("user", user._id);

    console.log(JSON.stringify(user));
    //localStorage.setItem('items', JSON.stringify(items));
  } else {
    //look at the local storage,
    // var userFromStorage = JSON.parse(localStorage.getItem("user"));
    // console.log(userFromStorage);
    // user = userFromStorage;
    console.log("the user is null so look at the local storage");
  }
  return (
    <Router>
      <Routes>
        // <Route exact path="/" element={user ? <Home /> : <Register />} />
        <Route
          exact
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          exact
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route exact path="/profile/:username" element={<Profile />} />
        <Route exact path="/setting/:username" element={<Setting />} />
        <Route exact path="/searchMotorCycle" element={<SearchMotorCycle />} />
        <Route exact path="/community" element={<Community />} />
        <Route exact path="/detailCommunity" element={<DetailCommunity />} />
        <Route exact path="/blog" element={<Blog />} />
        <Route exact path="/messenger" element={<Messenger />} />
        <Route exact path="/comment" element={<Comment />} />
        <Route exact path="/bookmark" element={<Bookmark />} />
        <Route exact path="/questionForum" element={<QuestionForum />} />
        <Route exact path="/job" element={<Job />} />
        <Route exact path="/events" element={<Events />} />
        <Route exact path="/courses" element={<Courses />} />
        <Route exact path="/friendRequest" element={<FriendRequest />} />
      </Routes>
    </Router>
  );
}
// <Route exact path="/chat" element={<Chat />} />

export default App;
