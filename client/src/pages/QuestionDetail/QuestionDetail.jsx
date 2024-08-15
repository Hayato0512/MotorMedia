import React from "react";
import "./questionDetail.css";
import { useState, useEffect, useContext } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";

// get questionID as a parameter. questionId
export default function QuestionDetail() {
  const [questionId, setQuestionId] = useState("");
  const [question, setQuestion] = useState(null);
  //get currentUesr
  const { user: currentUser } = useContext(AuthContext);
  const { state } = useLocation();

  useEffect(() => {
    if (state) {
      setQuestionId(state.questionId);
      console.log("QuestionDetail.jsx: state is ", state);
    } else {
      console.log("QuestionDetail.jsx: state is null");
    }
    console.log("QuestionDetail: HEHEHEHHEHHE");

    //get Question Http Request
    const fetchQuestion = async () => {
      try {
        if (questionId != "") {
          const res = await axiosInstance.get(`/questions/${questionId}`);
          console.log(
            "QuestionDetail: fetched question is as follows: ",
            res.data
          );
          setQuestion(res.data);
        }
      } catch (error) {}
    };
    fetchQuestion();
  }, [state, questionId]);
  //if I set quesetionId, no infinite loop even though I also change questionId by setQuestionId. maybe if the new value is the same as old one, it doesn't make this re-render.
  //On the other hand, every single res might be different. that is why even though I am fetching the same data from cloud, it's not quite the same.

  useEffect(() => {
    const fetchSpec = async () => {
      console.log(`let's fetch the bikes information from the rapid API. `);
    };
    fetchSpec();
  }, [state, question]);

  const getQuestionTitle = () => {
    return;
  };

  // render using useEffect
  return (
    <div className="questionDetail">
      <Topbar />
      <div className="questionDetailContainer">
        <Sidebar />
        <div className="questionDetailCenter">
          <div className="questionDetailTitle">
            {question ? question.title : "Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
}
