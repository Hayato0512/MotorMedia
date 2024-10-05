import { React, useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemButton } from "@mui/material";
import { axiosInstance } from "../../config";
import { logMessage } from "../../util/logging";

export default function JobRightbarItem({ jobApplication }) {
  const navigate = useNavigate();
  const [jobId, setJobId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [applicantName, setApplicantName] = useState("");

  const fetchApplicationDetails = useCallback(async () => {
    if (jobApplication) {
      try {
        const jobId = jobApplication.jobId;
        setJobId(jobId);
        const applicantName = await axiosInstance.get(
          "/users/name/" + jobApplication.uploaderId
        );
        setApplicantName(applicantName);
        const jobTitle = await axiosInstance.get(
          "/jobs/title/" + jobApplication.jobId
        );

        setJobTitle(jobTitle);
      } catch (error) {
        logMessage(
          "Some error detected in fetchApplicationDetails",
          "ERROR",
          "JobRightbarItem"
        );
      }
    }
  }, [jobApplication]);

  useEffect(() => {
    fetchApplicationDetails();
  }, [fetchApplicationDetails]);

  const selectJobPosting = (id) => {
    navigate("/jobDetail", { state: { jobId: id } });
  };

  return (
    <ListItem key={jobApplication._id}>
      <ListItemButton onClick={() => selectJobPosting(jobId)}>
        {applicantName}
        {jobTitle}
      </ListItemButton>
    </ListItem>
  );
}
