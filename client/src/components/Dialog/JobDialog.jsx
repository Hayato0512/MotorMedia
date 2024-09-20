// JobDialog.jsx
import { React, useRef, useContext, useState, useEffect } from "react";
import GenericDialog from "./GenericDialog";
import JobForm from "./JobForm";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { logMessage } from "../../util/logging";

export default function JobDialog({ isOpen, onClose, onPost }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [salary, setSalary] = useState("");
  const [tags, setTags] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  const handleSubmission = async () => {
    const newJob = {
      employerId: currentUser._id,
      title: title,
      body: body,
      salary: salary,
      isOpen: true,
      tags: tags,
    };
    logMessage(
      `jobToBePosted looks like this ${JSON.stringify(newJob)}`,
      "INFO",
      "JobDialog"
    );

    try {
      const res = await axiosInstance.post("/jobs/create", newJob);
      console.log(`Job created: ${JSON.stringify(res.data)}`);
      onPost();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GenericDialog
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmission}
      dialogTitle="Post a Job"
      submitButtonText="Post Job"
    >
      <JobForm
        title={title}
        setTitle={setTitle}
        body={body}
        setBody={setBody}
        salary={salary}
        setSalary={setSalary}
        tags={tags}
        setTags={setTags}
      />
    </GenericDialog>
  );
}
