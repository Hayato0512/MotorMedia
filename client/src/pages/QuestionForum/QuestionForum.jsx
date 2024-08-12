import { React, useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
// import FormControl from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import "./questionForum.css";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Question from "../../components/question/Question";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import QuestionDialog from "../../components/questionDialog/QuestionDialog";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";

export default function QuestionForum() {
  const [age, setAge] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  const inputRefName = useRef();

  useEffect(() => {
    const fetchFeedQuestions = async () => {
      const res = await axiosInstance.get("/questions/feed/" + currentUser._id);
      console.log("QuestionForum: fetchFeedQuestions. res is ", res.data);
      setQuestionList(res.data);
    };
    fetchFeedQuestions();
  }, [currentUser]);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const questionCreateClicked = () => {
    console.log(
      "questionCreateClicked, now, the ref is this",
      inputRefName.current.value
    );
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Topbar />
      <div className="questionForum">
        <Sidebar />
        <div className="questionForumContainer">
          <div className="questionForumTitleContainer">
            <div className="questionForumTitle">Question Forum</div>
          </div>
          <div className="questionCreateButtonDiv">
            <div className="questionCreateButton">
              <button
                onClick={questionCreateClicked}
                className="questionCreateButton"
              >
                + Post Question
              </button>
            </div>
          </div>
          <div className="questionSearchInputDiv">
            <input
              type="text"
              ref={inputRefName}
              placeholder="Search Question"
              className="questionSearchInputField"
            />
            <button
              onClick={questionCreateClicked}
              className="questionSearchButton"
            >
              create
            </button>
          </div>
          <div className="questionForumFilterContainer">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Filter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={10}>oldest</MenuItem>
                <MenuItem value={20}>most popular</MenuItem>
                <MenuItem value={30}>newest</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="questionList">
            {questionList.map((question) => (
              <Question question={question} />
            ))}
          </div>
        </div>
        <Rightbar />
      </div>
      <QuestionDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
}
