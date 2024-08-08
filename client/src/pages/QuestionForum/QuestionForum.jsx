import { React, useRef, useState } from "react";
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
export default function QuestionForum() {
  const [age, setAge] = useState("");
  const inputRefName = useRef();

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const questionCreateClicked = () => {
    console.log(
      "questionCreateClicked, now, the ref is this",
      inputRefName.current.value
    );
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
            <Question />
            <Question />
            <Question />
            <Question />
            <Question />
            <Question />
            <Question />
            <Question />
          </div>
        </div>
        <Rightbar />
      </div>
    </>
  );
}
