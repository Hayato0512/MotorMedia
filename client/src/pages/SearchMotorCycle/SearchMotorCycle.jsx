import React from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import SearchMotorCycleScreen from "../../components/SearchMotorCycleScreen/SearchMotorCycleScreen";
import "./searchMotorCycle.css";

export default function SearchMotorCycle() {
  return (
    <>
      <Topbar />
      <div className="searchMotorCycle">
        <div className="searchMotorCycleSidebar">
          <Sidebar />
        </div>
        <div className="searchMotorCycleScreenDiv">
          <SearchMotorCycleScreen />
        </div>
        <div className="searchMotorCycleRightbar"></div>
      </div>
    </>
  );
}
