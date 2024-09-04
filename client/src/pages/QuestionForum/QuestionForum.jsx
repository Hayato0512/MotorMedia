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
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { TextField } from "@mui/material";

export default function QuestionForum() {
  const [order, setOrder] = useState("");
  const [tags, setTags] = useState([]);
  const [tagTextFieldValue, setTagTextFieldValue] = useState("");
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

  useEffect(() => {
    const fetchTaggedQuestions = async () => {
      console.log(
        "fetchTaggedQuestions. before axios call, tags are like this ",
        tags
      );
      const bodyToPass = {
        tags: tags,
      };
      const res = await axiosInstance.post("/questions/tags", bodyToPass);
      console.log("QuestionForum: fetchTaggedQuestions. res is ", res.data);
      setQuestionList(res.data);
    };
    fetchTaggedQuestions();
  }, [tags]);

  const handleChange = (event) => {
    setOrder(event.target.value);
    console.log(
      "QuestionForum: order has been changed to ",
      event.target.value
    );
  };
  useEffect(() => {
    //here, rearrnge the questionList depending on the order.
    const updateQuestionList = () => {
      const orderedQuestionList = orderQuestionList(order);
      setQuestionList(orderedQuestionList); //the orderedQuestionList has the correct order. so is it some sort of delay ?
    };
    updateQuestionList();
  }, [order]);

  const orderQuestionList = (order) => {
    let newQuestionList = [...questionList];
    console.log(
      "before sort, the questionList looks like this ",
      newQuestionList
    );
    if (order == "newest") {
      newQuestionList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (order == "oldest") {
      newQuestionList.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (order == "popular") {
      newQuestionList.sort((a, b) => b.upvotes.length - a.upvotes.length);
    }

    console.log(
      "after sort, the questionList looks like this ",
      newQuestionList
    );
    return newQuestionList;
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

  const handleTagDeletion = (tagToDelete) => {
    console.log("QuestionDialog: before setTag, tags are like this , ", tags);
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
    console.log("QuestionDialog: after setTag, tags are like this , ", tags);
    // setOpen(false);
  };

  const addTag = () => {
    setTags((prevTags) => [...prevTags, tagTextFieldValue]);
    //clear the field
    setTagTextFieldValue("");
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

            <div className="questionForumTagsContainer">
              <Stack direction="row" spacing={1}>
                {tags.map((tag) => (
                  <Chip label={tag} onDelete={() => handleTagDeletion(tag)} />
                ))}
              </Stack>

              <TextField
                id="outlined-multiline-flexible"
                label="tags"
                multiline
                value={tagTextFieldValue}
                fullWidth
                onChange={(e) => setTagTextFieldValue(e.target.value)}
                sx={{
                  height: "40px", // Set the height of the TextField
                  "& .MuiOutlinedInput-root": {
                    height: "100%", // Ensure the outlined input field takes the full height
                    alignItems: "flex-start", // Aligns the input content to the top
                  },
                  "& .MuiOutlinedInput-input": {
                    height: "100%", // Ensure the input area takes the full height
                    overflowY: "scroll", // Enable vertical scrolling for overflowing content
                    boxSizing: "border-box", // Ensure padding is considered inside the height
                  },
                }}
              ></TextField>
              <Button onClick={addTag}>Add Tag</Button>
            </div>
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
