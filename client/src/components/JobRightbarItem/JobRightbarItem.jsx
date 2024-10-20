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
        setApplicantName(applicantName.data);
        const jobTitle = await axiosInstance.get(
          "/jobs/title/" + jobApplication.jobId
        );

        logMessage(
          `jobTitle is like this ${jobTitle.data}`,
          "INFO",
          "JobRightbarItem"
        );
        setJobTitle(jobTitle.data);
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
    navigate("/jobDetail", {
      state: {
        jobId: id,
        applicantId: jobApplication.uploaderId,
        isFromJobRightbar: true,
      },
    });
  };

  return (
    <ListItem key={jobApplication._id}>
      <ListItemButton onClick={() => selectJobPosting(jobId)}>
        {jobTitle}
        {applicantName}
      </ListItemButton>
    </ListItem>
  );
}
