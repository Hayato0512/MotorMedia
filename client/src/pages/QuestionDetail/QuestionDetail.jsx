import React from "react";
import "./questionDetail.css";
import { useState, useEffect, useContext, useRef } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import CommentDetail from "../../components/CommentDetail/CommentDetail";

// get questionID as a parameter. questionId
export default function QuestionDetail() {
  const [questionId, setQuestionId] = useState("");
  const [question, setQuestion] = useState(null);
  const inputRef = useRef();
  const [comments, setComments] = useState([]);
  const [commenters, setCommenters] = useState([]);
  const [commentChanged, setCommentChanged] = useState(false);
  //get currentUesr
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { state } = useLocation();
  const [upvote, setUpvote] = useState(0);
  const [downvote, setDownvote] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);

  //
  const upvoteHandler = async () => {
    try {
      await axiosInstance.put("/questions/" + question._id + "/upvote", {
        userId: currentUser._id,
      });
    } catch (error) {}
    if (isUpvoted) {
      setUpvote(upvote - 1);
      setIsUpvoted(false);
    } else {
      //if it is not,
      setUpvote(upvote + 1);
      setIsUpvoted(true);
    }
    // setLike(isLiked ? like - 1 : like + 1);
  };
  const downvoteHandler = async () => {
    try {
      await axiosInstance.put("/questions/" + question._id + "/downvote", {
        userId: currentUser._id,
      });
    } catch (error) {}
    if (isDownvoted) {
      setDownvote(downvote - 1);
      setIsDownvoted(false);
    } else {
      //if it is not,
      setDownvote(downvote + 1);
      setIsDownvoted(true);
    }
    // setLike(isLiked ? like - 1 : like + 1);
  };

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
          setIsUpvoted(question.upvotes.includes(currentUser._id));
          setUpvote(question.upvotes.length);
          setDownvote(question.downvotes.length);
          setIsDownvoted(question.downvotes.includes(currentUser._id));
          //is postLIkes includes the current user, then it will be false
        }
      } catch (error) {}
    };
    fetchQuestion();
  }, [state, questionId]);
  //if I set quesetionId, no infinite loop even though I also change questionId by setQuestionId. maybe if the new value is the same as old one, it doesn't make this re-render.
  //On the other hand, every single res might be different. that is why even though I am fetching the same data from cloud, it's not quite the same.

  useEffect(() => {
    //set commenters
    const fetchCommenters = async () => {
      const userIds = [];
      comments.map((comment) => {
        if (!userIds.includes(comment.userId)) {
          userIds.push(comment.userId);
        }
      });
      const list = await Promise.all(
        userIds.map(
          async (userId) => await axiosInstance.get("/users?userId=" + userId)
        )
      );
      console.log(JSON.stringify(list));
      setCommenters(list);
    };
    fetchCommenters();
  }, [comments]);

  useEffect(() => {
    //get all the comments of the psot
    const fetchComments = async () => {
      if (question !== null) {
        try {
          const res = await axiosInstance.get(
            `/comments/allComments/${question._id}`
          );
          console.log(
            `all the comments of this post is ${JSON.stringify(res.data)}`
          );
          res.data.map((comment) => {
            console.log("aaa" + JSON.stringify(comment));
          });
          setComments(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchComments();
  }, [question, commentChanged]);

  const getQuestionTitle = () => {
    return;
  };

  const commentSendButtonClicked = async () => {
    console.log(
      `comment button clicked, so , user is ${currentUser.username}, and then questionId ${questionId}, and the comment is ${inputRef.current.value}`
      //create acomment
    );

    const newComment = {
      userId: currentUser._id,
      postId: question._id,
      desc: inputRef.current.value,
    };

    try {
      const res = await axiosInstance.post("/comments", newComment);
      console.log(
        `creating a new commentthe res.data is ${JSON.stringify(res.data)}`
      );
      // window.location.reload(false);
      setCommentChanged(!commentChanged);
      inputRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentDeletion = async () => {
    setCommentChanged(!commentChanged);
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
          <hr class="solid" />
          <div className="questionDetailBody">
            <div className="questionDetailBodyVoteIconsContainer">
              <ThumbUpAltRoundedIcon
                className="upvoteIcon"
                onClick={upvoteHandler}
              />
              <div className="questionDetailBodyVoteCount">{upvote}</div>
              <ThumbDownRoundedIcon
                className="downvoteIcon"
                onClick={downvoteHandler}
              />
            </div>
            <div className="questionDetailBodyText">
              {question ? question.body : "Loading..."}
            </div>
            <div className="questionDetailBodyUserInfo ">
              <div questionDetailBodyAskedDate>asked Feb 3, 2024</div>
              <div className="questionDetailBodyUserInfoLower">
                <img
                  src={
                    currentUser.profilePicture
                      ? PF + "person/" + currentUser.profilePicture
                      : PF + "person/" + "andrew.jpg"
                  }
                  alt=""
                  className="postProfileImg"
                />
                <div className="questionDetailBodyUserName">
                  {currentUser.username}
                </div>
              </div>
            </div>
          </div>
          <div className="questionDetailCommentContainer">
            <div className="questionDetailCommentInputs">
              <input
                type="text"
                ref={inputRef}
                placeholder="comment"
                className="questionDetailCommentInput"
              />
              <button
                className="questionDetailCommentButton"
                onClick={commentSendButtonClicked}
              >
                send
              </button>
            </div>
            <div className="questionDetailsComments">
              {comments.map((comment, i) => (
                <div
                  className="commentCenterCommentDetailWrapper
                    "
                  key={comment._id ? comment._id : i}
                >
                  <CommentDetail
                    comment={comment}
                    onDelete={handleCommentDeletion}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
