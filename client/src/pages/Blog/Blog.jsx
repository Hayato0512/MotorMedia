import React from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import BlogScreen from "../../components/BlogScreen/BlogScreen";
export default function Blog() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <BlogScreen />
        <Rightbar />
      </div>
    </>
  );
}
