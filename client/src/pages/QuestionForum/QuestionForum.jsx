//Core imports
import {
  React,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";

//important imports
import { AuthContext } from "../../context/AuthContext";

//MUI imports and UI related
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./questionForum.css";

// Other Components
import Question from "../../components/question/Question";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import QuestionDialog from "../../components/questionDialog/QuestionDialog";
import TagSearch from "../../components/TagSearch/TagSearch";
import QuestionTextSearch from "../../components/QuestionTextSearch/QuestionTextSearch";
import QuestionRightbar from "../../components/QuestionRightbar/QuestionRightbar";
import useFetchQuestions from "../../hooks/useFetchQuestions";
import orderQuestionList from "../../util/sortQuestions";

export default function QuestionForum() {
  const [tags, setTags] = useState([]); //so I need these tags here, to show the chips. but also I wanna let the parent component
  const [order, setOrder] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQuestionPosted, setIsQuestionPosted] = useState(false);
  const { user: currentUser } = useContext(AuthContext);
  const { questionList, setQuestionList } = useFetchQuestions(
    currentUser,
    tags
  ); // Using the custom hook

  const handleChange = (event) => {
    setOrder(event.target.value);
  };
  const questionCreateClicked = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  //Order Change logic here
  useEffect(() => {
    const sortedQuestions = orderQuestionList(questionList, order);
    setQuestionList(sortedQuestions);
  }, [order, questionList]);

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
            <QuestionTextSearch />
          </div>
          <div className="questionForumFilterContainer">
            <FormControl sx={{ width: "30%" }}>
              <InputLabel id="demo-simple-select-label">Filter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={order}
                label="Order"
                onChange={handleChange}
              >
                <MenuItem value={"oldest"}>oldest</MenuItem>
                <MenuItem value={"popular"}>most popular</MenuItem>
                <MenuItem value={"newest"}>newest</MenuItem>
              </Select>
            </FormControl>
          </div>
          <TagSearch onChange={setTags} />
          <div className="questionList">
            {questionList.map((question) => (
              <Question question={question} />
            ))}
          </div>
        </div>
        <QuestionRightbar isQuestionPosted={isQuestionPosted} />
      </div>
      <QuestionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onPost={setIsQuestionPosted}
      />
    </>
  );
}
