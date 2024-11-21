import React from "react";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { axiosInstance } from "../../config";
import { logMessage } from "../../util/logging";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@mui/material";
import { Send } from "@material-ui/icons";
import { Modal } from "react-bootstrap";

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

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    if (job) {
      if (isEmployer) {
        fetchAllApplications();
      } else {
        fetchUserApplication();
      }
    } else {
    }
  }, [job, isEmployer, refreshTrigger]);

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
          jobId: job._id,
          employerId: job.employerId,
        },
        responseType: "arraybuffer", // Try using 'arraybuffer' to ensure proper binary handling
      });
      logMessage(res.config.url, "INFO", "JobDetailBottomPart"); // This should show the full URL with parameters

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

        logMessage(
          `res.data is  ${JSON.stringify(res)}`,
          "INFO",
          "JobDetailBottomPart"
        );
        // here, fetch application, and then get the fileName.
        // we have uploaderId: currentUser._id,
        //jobId: job._id,
        //employerId: job.employerId
        try {
          const res2 = await axiosInstance.get(`/jobs/application/getone`, {
            params: {
              uploaderId: currentUser._id,
              jobId: job._id,
              employerId: job.employerId,
            },
          });
          logMessage(
            `res2 received, res2.data is ${res2.data.fileName}`,
            "INFO",
            "JobDetailBottomPart"
          );
          setFileName(res2.data.fileName);
        } catch (error) {}
        setUserApplied(true);
      }
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

  const deleteApplicationClicked = async () => {
    try {
      //filename is undefined. find out why.
      logMessage(
        `before deletion, filename is ${fileName}`,
        "INFO",
        "JobDetailBottomPart"
      );
      const res = await axiosInstance.delete(`/jobs/application/delete`, {
        params: {
          fileName: fileName,
          jobId: job._id,
          userId: currentUser._id,
        },
      });
      logMessage(
        "Application deletion successful.",
        "INFO",
        "JobDetailBottomPart"
      ); // This should show the full URL with parameters
      //close the modal,
      setShow(false);
      // Trigger refresh
      setUserApplied(false);
      setRefreshTrigger((prev) => !prev); // Toggle refreshTrigger
    } catch (error) {
      logMessage(error, "ERROR", "JobDetailBottomPart"); // This should show the full URL with parameters
    }
    // and then just throw that into server, and they will deal with it.
  };

  const deleteCancelClicked = () => {
    setShow(false);
  };

  useEffect(() => {
    logMessage(
      `fileName changed to ${fileName}`,
      "INFO",
      "JobDetailBottomPart"
    );
  }, [fileName]);
  return (
    <div>
      {isEmployer ? (
        <div>
          <h3>Applications for this Job</h3>
          {applications.length > 0 ? (
            <ul>
              {applications.map((application, index) => (
                <li key={index}>
                  <a
                    href={`/aws/files/download/${application.fileId}`}
                    download={application.fileName}
                  >
                    {application.fileName}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No applications found.</p>
          )}
        </div>
      ) : (
        <div>
          {userApplied && pdfUrl ? (
            <div>
              <a href={pdfUrl} download={fileName}>
                View Your Application
              </a>
              <Button
                variant="contained"
                endIcon={<Send />}
                onClick={handleShow}
              >
                Delete Your Application
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              endIcon={<Send />}
              onClick={applyClicked}
            >
              Apply
            </Button>
          )}
        </div>
      )}

      <Modal show={show}>
        <Modal.Header closeButton>
          <Modal.Title>delete application?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <></>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={deleteApplicationClicked}>
            delete
          </Button>

          <Button variant="secondary" onClick={deleteCancelClicked}>
            cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
