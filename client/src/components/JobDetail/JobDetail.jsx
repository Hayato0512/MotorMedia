import React from "react";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";

import "./jobDetail.css";
import JobApplicationDialog from "../Dialog/JobApplicationDialog";

// get questionID as a parameter. questionId
export default function JobDetail() {
  const [jobId, setJobId] = useState("");
  const [job, setJob] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const inputRef = useRef();
  //get currentUesr
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { state } = useLocation();

  //get Job Http Request
  const fetchJob = useCallback(async () => {
    try {
      if (jobId != "") {
        const res = await axiosInstance.get(`/jobs/${jobId}`);
        console.log("jobDetail: fetched question is as follows: ", res.data);
        setJob(res.data);
      }
    } catch (error) {}
  }, [state, jobId]);

  useEffect(() => {
    if (state) {
      setJobId(state.jobId);
    } else {
      console.log("JobDetail.jsx: state is null");
    }

    fetchJob();
  }, [fetchJob]);
  //if I set quesetionId, no infinite loop even though I also change questionId by setQuestionId. maybe if the new value is the same as old one, it doesn't make this re-render.
  //On the other hand, every single res might be different. that is why even though I am fetching the same data from cloud, it's not quite the same.

  const applyClicked = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  // render using useEffect
  return (
    <div className="jobDetail">
      <Topbar />
      <div className="jobDetailContainer">
        <Sidebar />
        <div className="jobDetailCenter">
          <div className="jobDetailTitle">{job ? job.title : "Loading..."}</div>
          <hr class="solid" />
          <div className="jobDetailBody">
            <div className="jobDetailBodyText">
              {job ? job.body : "Loading..."}
            </div>
            <div className="jobDetailBodyUserInfo ">
              <div className="jobDetailBodyAskedDate">asked Feb 3, 2024</div>
              <div className="jobDetailBodyUserInfoLower">
                <img
                  src={
                    currentUser.profilePicture
                      ? PF + "person/" + currentUser.profilePicture
                      : PF + "person/" + "andrew.jpg"
                  }
                  alt=""
                  className="jobProfileImg"
                />
                <div className="jobDetailBodyUserName">
                  {currentUser.username}
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={applyClicked}
          >
            Apply
          </Button>
        </div>
      </div>
      <JobApplicationDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
}
