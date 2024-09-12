import { React, useEffect, useRef, useState, useContext } from "react";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { TextField, List, ListItem, ListItemButton } from "@mui/material";

//fetch the currentUser, and fetch all the questions from the current user, and then show them. That is it

// get pros, to let QuestionForum let rightbar know if the current user posted a new question
export default function QuestionRightbar({ onChange }) {
  //import current user
  const { user: currentUser } = useContext(AuthContext);

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
        } catch (error) {
          //search for a best practice to log
          //Create a helper functfirstion for logging that takes the type of log and message. and then it gives a consistent log.
          //https://medium.com/@seniruabeywickrama/5-best-practices-for-logging-in-react-js-6cc26e7c7e94
          console.error("QuestionRightbar: ");
        }
      }
    };
    fetchOwnQuestions();
  }, [user, onChange]);
  //all the questions from the current user, and then setQuestion(response), so that the React re-renders.

  // add a list here
  //for the list, use non-vanilla cs. an UI library. probably material UI is good. Refer to the TagSearch/QuestionTextSearch.
  //on Click, this will take the user to the QuestionDetail. Awesome. everything is clear now. I can do it.
  return (
    <div>
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
