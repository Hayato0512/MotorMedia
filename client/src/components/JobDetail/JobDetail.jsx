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
import { logMessage } from "../../util/logging";

// get questionID as a parameter. questionId
export default function JobDetail() {
  const [jobId, setJobId] = useState("");
  const [job, setJob] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const inputRef = useRef();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [fileName, setFileName] = useState("application.pdf"); // Set a default file name

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

  //get Job Http Request
  const fetchApplication = useCallback(async () => {
    try {
      logMessage(`fetchApplication Called `, "INFO", "JobDetail");
      if (jobId != "" && job) {
        logMessage(
          `fetchApplication about to throw request axios `,
          "INFO",
          "JobDetail"
        );
        const res = await axiosInstance.get(`/aws/files/get`, {
          params: {
            uploaderId: currentUser._id,
            jobId: jobId,
            employerId: job.employerId,
          },
          responseType: "arraybuffer", // Try using 'arraybuffer' to ensure proper binary handling
        });
        logMessage(res.config.url, "INFO", "JobDetail"); // This should show the full URL with parameters

        if (res) {
          // Revoke old Object URL if it exists
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
          }
          // Create a Blob from the PDF Stream
          const fileBlob = new Blob([res.data], { type: "application/pdf" });

          // Create an Object URL from the Blob
          const fileURL = URL.createObjectURL(fileBlob);

          setPdfUrl(fileURL);

          setFileName(res.data.originalName);

          // Option 1: Open the PDF in a new tab
          // window.open(fileURL, "_blank");

          // Option 2: Trigger a download (if you want the user to download the file)
          // const link = document.createElement('a');
          // link.href = fileURL;
          // link.setAttribute('download', 'application.pdf'); // Specify a filename
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);
        }
        // setJob(res.data)
      } else {
        logMessage(
          `fetchApplication Called BUT Job not READY`,
          "INFO",
          "JobDetail"
        );
      }
    } catch (error) {
      logMessage(
        `FAILED TO FETCH JOB APPLICATION ${error}`,
        "ERROR",
        "JobDetail"
      );
    }
  }, [state, jobId, job]);
  // Cleanup the URL when the component unmounts or the pdfUrl changes
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);
  useEffect(() => {
    if (state) {
      fetchApplication();
    } else {
    }
  }, [job]);
  //if I set quesetionId, no infinite loop even though I also change questionId by setQuestionId. maybe if the new value is the same as old one, it doesn't make this re-render.
  //
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
          <div className="jobDetailTitle">
            {job ? job.title : "Loading..."}
            {pdfUrl && "(You've already applied) "}
          </div>
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
            {pdfUrl && (
              <div>
                <a href={pdfUrl} download={fileName}>
                  View Your Application
                </a>
              </div>
            )}
          </div>

          {!pdfUrl && (
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={applyClicked}
            >
              Apply
            </Button>
          )}
        </div>
      </div>
      <JobApplicationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        employerId={job ? job.employerId : null}
        jobId={jobId}
      />
    </div>
  );
}
