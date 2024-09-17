import { React, useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { List, ListItem, ListItemButton } from "@mui/material";

import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { logMessage } from "../../util/logging";
import "./questionRightbar.css";

//fetch the currentUser, and fetch all the questions from the current user, and then show them. That is it

export default function QuestionRightbar({ isQuestionPosted }) {
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const fetchOwnQuestions = useCallback(async () => {
    if (currentUser._id) {
      try {
        //something like this.
        const res = await axiosInstance.get(
          "/questions/own/" + currentUser._id
        );
        setQuestions(res.data);
        logMessage(
          "Success in fetching user's own question",
          "INFO",
          "QuestionRightbar"
        );
      } catch (error) {
        //asdf
        //https://medium.com/@seniruabeywickrama/5-best-practices-for-logging-in-react-js-6cc26e7c7e94
        logMessage(
          "Error in fetching user's own question",
          "ERROR",
          "QuestionRightbar"
        );
      }
    }
  }, [currentUser, isQuestionPosted]);

  // useEffect that react to the currentUser change as well as some updates from QuestionForum. This will fetch all the
  useEffect(() => {
    fetchOwnQuestions();
  }, [fetchOwnQuestions]);
  //all the questions from the current user, and then setQuestion(response), so that the React re-renders.

  const selectQuestion = (id) => {
    navigate("/questionDetail", { state: { questionId: id } });
  };
  return (
    <div className="questionRightbar">
      Your Own Question
      {questions.length > 0 && (
        <List
          sx={{
            overflowY: "auto",
            border: "1px solid lightgray",
          }}
        >
          {questions.map((question) => (
            <ListItem key={question._id}>
              <ListItemButton onClick={() => selectQuestion(question._id)}>
                {question.title}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}
