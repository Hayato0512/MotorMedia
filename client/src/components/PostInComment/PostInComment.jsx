import "./postInComment.css";
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

export default function PostInComment({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  //for pop up for post deletion
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
    //is postLIkes includes the current user, then it will be false
  }, [currentUser._id, post.likes]);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  // var chosenUser = null;
  // er.map((user) => {
  //   if (user.id === post.userId) {
  //     chosenUser = user;
  //   }
  // });

  const likeHandler = async () => {
    try {
      await axiosInstance.put("/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
      console.log("alright");
    } catch (error) {}
    if (isLiked) {
      setLike(like - 1);
      setIsLiked(false);
    } else {
      //if it is not,
      setLike(like + 1);
      setIsLiked(true);
    }
    setLike(isLiked ? like - 1 : like + 1);
  };
  const threeDotsClicked = () => {
    console.log("debug: lets show some pop up to delete");
  };
  const deleteCancelClicked = () => {
    setShow(false);
  };

  const deleteClicked = async (e) => {
    e.preventDefault(); //what is this for?
    console.log(
      "debug: delete clicked, let's delete post by doing axiosInstance.delete(ostkjkjk )",
      post._id
    );
    //geyt the post ID
    console.log("currentUser._id", currentUser._id);
    const data = new FormData();
    data.append("userId", currentUser._id);
    const bodyToPass = {
      userId: currentUser._id,
    };
    try {
      const res = await axiosInstance.delete(
        `/posts/${post._id}/${currentUser._id}`,
        {
          userId: currentUser._id,
        }
      );
      console.log(res);
      setShow(false);
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };

  const commentClicked = () => {
    console.log(`comment Button Clicekd, take the user to the comment page`);
    var objectToPassToComment = {
      post: post,
      isCommunityPost: false,
      isPost: true,
      isProfile: false,
      isHome: false,
    };
    // navigate(-1);
    navigate("/comment", { state: objectToPassToComment });
  };
  return (
    <div className="postInComment">
      <div className="postInCommentWrapper">
        <div className="postInCommentTop">
          <div className="postInCommentTopleft">
            <Link to={`/profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PF + "person/" + user.profilePicture
                    : PF + "person/" + "andrew.jpg"
                }
                alt=""
                className="postInCommentProfileImg"
              />
            </Link>
            <span className="postInCommentUsername">{user.username}</span>
            <span className="postInCommentDate">{format(post.createdAt)}</span>
          </div>
          <div className="postInCommentTopRight">
            <MoreVert className="postThreeDots" onClick={handleShow} />
          </div>
        </div>
        <div className="postInCommentCenter">
          <Modal show={show}>
            <Modal.Header closeButton>
              <Modal.Title>delete the post?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <></>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={deleteClicked}>
                delete
              </Button>

              <Button variant="secondary" onClick={deleteCancelClicked}>
                cancel
              </Button>
            </Modal.Footer>
          </Modal>
          <span className="postInCommentText">{post?.desc}</span>
          <img
            src={PF + "posts/" + post.img}
            alt=""
            className="postInCommentImg"
          />
        </div>
        <div className="postInCommentBottom">
          <div className="postInCommentButtomLeft">
            <FavoriteBorder className="likeIcon" onClick={likeHandler} />
            <TwoWheeler className="likeIcon" onClick={likeHandler} />
            <span className="postLikeCounter">{like} people liked</span>
          </div>
          <div className="postInCommentButtomRight"></div>
        </div>
      </div>
    </div>
  );
}
