import { React, useEffect, useRef, useState, useContext } from "react";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { TextField, List, ListItem, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./questionRightbar.css";
import { logMessage } from "../../util/logging";

//fetch the currentUser, and fetch all the questions from the current user, and then show them. That is it

// get pros, to let QuestionForum let rightbar know if the current user posted a new question
export default function QuestionRightbar({ isQuestionPosted }) {
  //import current user
  const { user: currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  // set state questions
  const [questions, setQuestions] = useState([]);
  // have a useEffect that react to the currentUser change as well as some updates from QuestionFOrum. This will fetch all the
  useEffect(() => {
    const fetchOwnQuestions = async () => {
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
    };
    fetchOwnQuestions();
  }, [currentUser, isQuestionPosted]);
  //all the questions from the current user, and then setQuestion(response), so that the React re-renders.

  // add a list here
  //for the list, use non-vanilla cs. an UI library. probably material UI is good. Refer to the TagSearch/QuestionTextSearch.
  //on Click, this will take the user to the QuestionDetail. Awesome. everything is clear now. I can do it.
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
