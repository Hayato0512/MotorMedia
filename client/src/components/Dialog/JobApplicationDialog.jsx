// JobDialog.jsx
import { React, useRef, useContext, useState, useEffect } from "react";
import GenericDialog from "./GenericDialog";
import JobForm from "./JobForm";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { logMessage } from "../../util/logging";
import JobApplicationForm from "./JobApplicationForm";

export default function JobApplicationDialog({ isOpen, onClose, onPost }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const { user: currentUser } = useContext(AuthContext);

  const handleSubmission = async () => {
    logMessage(
      `Job Application: name: ${name}, email: ${email}, comment: ${comment}`,
      "INFO",
      "JobApplicationDialog"
    );
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
      />
    </GenericDialog>
  );
}
