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
  const navigate = useNavigate();

  useEffect(() => {
    if (state) {
      setQuestionId(state.questionId);
    }

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
  }, [state]);

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
