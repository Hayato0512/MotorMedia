import "./question.css";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { MoreVert, FavoriteBorder, TwoWheeler } from "@material-ui/icons";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
export default function Question({ question, onChange }) {
  // const [like, setLike] = useState(question.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  //for pop up for post deletion
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  // useEffect(() => {
  //   setIsLiked(question.likes.includes(currentUser._id));
  //   //is postLIkes includes the current user, then it will be false
  // }, [currentUser._id, question.likes]);
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const res = await axiosInstance.get(`/users?userId=${question.userId}`);
  //     setUser(res.data);
  //   };
  //   fetchUser();
  // }, [question.userId]);

  const likeHandler = async () => {
    //   try {
    //     await axiosInstance.put("/posts/" + post._id + "/like", {
    //       userId: currentUser._id,
    //     });
    //     console.log("alright");
    //   } catch (error) {}
    //   if (isLiked) {
    //     setLike(like - 1);
    //     setIsLiked(false);
    //   } else {
    //     //if it is not,
    //     setLike(like + 1);
    //     setIsLiked(true);
    //   }
    //   setLike(isLiked ? like - 1 : like + 1);
  };

  const threeDotsClicked = () => {
    console.log("debug: lets show some pop up to delete");
  };

  const deleteCancelClicked = () => {
    setShow(false);
  };

  const deleteClicked = async (e) => {
    //   e.preventDefault(); //what is this for?
    //   console.log(
    //     "debug: delete clicked, let's delete post by doing axiosInstance.delete(ostkjkjk )",
    //     post._id
    //   );
    //   //geyt the post ID
    //   console.log("currentUser._id", currentUser._id);
    //   const data = new FormData();
    //   data.append("userId", currentUser._id);
    //   const bodyToPass = {
    //     userId: currentUser._id,
    //   };
    //   try {
    //     const res = await axiosInstance.delete(
    //       `/posts/${post._id}/${currentUser._id}`,
    //       {
    //         userId: currentUser._id,
    //       }
    //     );
    //     console.log(res);
    //     setShow(false);
    //     onChange();
    //   } catch (error) {
    //     console.log(error);
    //   }
  };

  const commentClicked = () => {
    //   console.log(`comment Button Clicekd, take the user to the comment page`);
    //   var objectToPassToComment = {
    //     post: post,
    //     isCommunityPost: false,
    //     isPost: true,
    //     isProfile: false,
    //     isHome: false,
    //   };
    //   navigate("/comment", { state: objectToPassToComment });
  };

  var questionDetailsObject = {
    questionId: question._id,
  };

  return (
    <div className="question">
      <div className="questionWrapper">
        <div className="questionTop">
          <div className="questionTopleft">
            <Link to={`/profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PF + "person/" + user.profilePicture
                    : PF + "person/" + "andrew.jpg"
                }
                alt=""
                className="questionProfileImg"
              />
            </Link>
            <span className="questionUsername">{question.userId}</span>
            <span className="questionDate">{question.createdAt}</span>
          </div>
          <div className="questionTopRight">
            <MoreVert className="questionThreeDots" onClick={handleShow} />
          </div>
        </div>
        <div className="questionCenter">
          <Modal show={show}>
            <Modal.Header closeButton>
              <Modal.Title>delete the post?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={deleteClicked}>
                delete
              </Button>

              <Button variant="secondary" onClick={deleteCancelClicked}>
                cancel
              </Button>
            </Modal.Footer>
          </Modal>
          <Link
            to={{
              pathname: "/questionDetail/",
              state: questionDetailsObject,
            }}
            // navigate("/comment", { state: objectToPassToComment });
            style={{ textDecoration: "none" }}
            // key={commenter.data.username}
          >
            <span className="questionTitle">{question.title}</span>
          </Link>
          <span className="questionDesc">{question.body}</span>
          {/* <img src={PF + "posts/" + post.img} alt="" className="postImg" /> */}
          <img alt="" className="questionImg" />
        </div>
        <div className="questionBottom">
          <div className="questionButtomLeft">
            <FavoriteBorder className="likeIcon" onClick={likeHandler} />
            <TwoWheeler className="likeIcon" onClick={likeHandler} />
            {/* <span className="postLikeCounter">{like} people liked</span> */}
            <span className="questionLikeCounter">5 people liked</span>
          </div>
          <div className="questionButtomRight">
            <div className="questionCommentText" onClick={commentClicked}>
              comments
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
