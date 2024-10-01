// JobDialog.jsx
import { React, useRef, useContext, useState, useEffect } from "react";
import GenericDialog from "./GenericDialog";
import JobForm from "./JobForm";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { logMessage } from "../../util/logging";
import JobApplicationForm from "./JobApplicationForm";

const fileName = "JobApplicationDialog";

export default function JobApplicationDialog({
  isOpen,
  onClose,
  onPost,
  employerId,
  jobId,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const { user: currentUser } = useContext(AuthContext);

  const handleSubmission = async () => {
    logMessage(
      `Job Application: name: ${name}, email: ${email}, comment: ${comment}, `,
      "INFO",
      fileName
    );

    const formData = new FormData();
    formData.append("file", file); // Attach the file to the form data
    formData.append("uploaderId", currentUser._id); // Attach the file to the form data
    formData.append("employerId", employerId); // Attach the file to the form data
    formData.append("jobId", jobId); // Attach the file to the form data

    try {
      const response = await axiosInstance.post("/aws/upload", formData);

      // const result = await response.json();
      console.log("File uploaded successfully:", response);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    // const newApplication = {
    //   employerId: currentUser._id,
    //   title: title,
    //   body: body,
    //   salary: salary,
    //   isOpen: true,
    //   tags: tags,
    // };
    // logMessage(
    //   `jobToBePosted looks like this ${JSON.stringify(newJob)}`,
    //   "INFO",
    //   "JobDialog"
    // );
    // try {
    //   const res = await axiosInstance.post("/jobs/create", newJob);
    //   console.log(`Job created: ${JSON.stringify(res.data)}`);
    //   onPost();
    //   onClose();
    // } catch (error) {
    //   console.error(error);
    // }
  };

  useEffect(() => {
    if (file) {
      logMessage(
        `File State Updated: Name: ${file.name}, Type: ${file.type}, Size: ${file.size}`,
        "INFO",
        fileName
      );
    } else {
      logMessage(
        "File State Updated, but file is null or undefined",
        "INFO",
        fileName
      );
    }
  }, [file]);
  return (
    <GenericDialog
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmission}
      dialogTitle="Job Application"
      submitButtonText="Apply"
    >
      <JobApplicationForm
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        comment={comment}
        setComment={setComment}
        file={file}
        setFile={setFile}
      />
    </GenericDialog>
  );
}
