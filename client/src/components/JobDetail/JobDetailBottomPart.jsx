import React from "react";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { axiosInstance } from "../../config";
import { logMessage } from "../../util/logging";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@mui/material";
import { Send } from "@material-ui/icons";

export default function JobDetailBottomPart({
  job,
  currentUser,
  isEmployer,
  setIsDialogOpen,
}) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [fileName, setFileName] = useState("application.pdf"); // Set a default file name
  const [applications, setApplications] = useState([]); // For employer view
  const [userApplied, setUserApplied] = useState(false); // For applicant view

  useEffect(() => {
    if (job) {
      if (isEmployer) {
        fetchAllApplications();
      } else {
        fetchUserApplication();
      }
    } else {
    }
  }, [job, isEmployer]);

  // Cleanup the URL when the component unmounts or the pdfUrl changes
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const fetchAllApplications = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/aws/files/getAll`, {
        params: {
          jobId: job._id,
        },
      });
      setApplications(res.data);
    } catch (error) {
      logMessage(
        `Error fetching all applications: ${error}`,
        "ERROR",
        "JobDetailBottomPart"
      );
    }
  }, [job]);

  //get Job Http Request
  const fetchUserApplication = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/aws/files/get`, {
        params: {
          uploaderId: currentUser._id,
          jobId: state.jobId,
          // employerId: job.employerId,
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
    } catch (error) {
      logMessage(
        `FAILED TO FETCH JOB APPLICATION ${error}`,
        "ERROR",
        "JobDetail"
      );
    }
  }, [currentUser, job]);

  const applyClicked = () => {
    setIsDialogOpen(true);
  };
  return (
    <div>
      {pdfUrl && (
        <div>
          <a href={pdfUrl} download={fileName}>
            View Your Application
          </a>
        </div>
      )}
      {!pdfUrl && (
        <Button variant="contained" endIcon={<Send />} onClick={applyClicked}>
          Apply
        </Button>
      )}
      JobDetailBottomPart
    </div>
  );
}
