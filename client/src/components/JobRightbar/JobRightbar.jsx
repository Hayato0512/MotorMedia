import { React, useEffect, useState, useContext, useCallback } from "react";
import { List, ListItem, ListItemButton } from "@mui/material";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { logMessage } from "../../util/logging";
import JobRightbarItem from "../JobRightbarItem/JobRightbarItem";
import "./jobRightbar.css";

//fetch the currentUser, and fetch all the questions from the current user, and then show them. That is it
const fileName = "JobRightbar";

export default function JobRightbar({ isQuestionPosted }) {
  const { user: currentUser } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  const fetchApplications = useCallback(async () => {
    if (currentUser._id) {
      try {
        //something like this.
        const res = await axiosInstance.get(
          "/jobs/jobapplications/employer/alljobpostings/" + currentUser._id
        );
        logMessage(
          `Before setApplication, res.data is  ${JSON.stringify(res.data)}`,
          "INFO",
          fileName
        );
        if (Array.isArray(res.data)) {
          setApplications(res.data);
        } else {
          logMessage("res.data is not an array!", "ERROR", fileName);
        }
        logMessage(
          "Success in fetching user's postings applications",
          "INFO",
          fileName
        );
      } catch (error) {
        //asdf
        //https://medium.com/@seniruabeywickrama/5-best-practices-for-logging-in-react-js-6cc26e7c7e94
        logMessage(
          `Error in fetching jobApplication, ${error}`,
          "ERROR",
          fileName
        );
      }
    }
  }, [currentUser, isQuestionPosted]);

  // useEffect that react to the currentUser change as well as some updates from QuestionForum. This will fetch all the
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);
  //all the questions from the current user, and then setQuestion(response), so that the React re-renders.

  return (
    <div className="questionRightbar">
      {applications.length > 0 && (
        <List
          sx={{
            overflowY: "auto",
            border: "1px solid lightgray",
          }}
        >
          {applications.map((application) => (
            <JobRightbarItem
              jobApplication={application}
              key={application._id}
            />
          ))}
        </List>
      )}
    </div>
  );
}
