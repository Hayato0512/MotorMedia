import React from "react";
import "./communityPost.css";
import { MoreVert, FavoriteBorder, TwoWheeler } from "@material-ui/icons";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";

export default function CommunityPost({ post }) {
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
    //そのpostの持ち主をfetchする
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = async () => {
    try {
      await axiosInstance.put("/communityPosts/" + post._id + "/like", {
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
        `/communityPosts/${post._id}/${currentUser._id}`,
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
      isCommunityPost: true,
      isPost: false,
      isProfile: false,
      isHome: false,
    };
    navigate("/comment", { state: objectToPassToComment });
    // Navigate("/DetailCommunity", { state: data });
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopleft">
            <Link to={`/profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PF + "person/" + user.profilePicture
                    : PF + "person/" + "andrew.jpg"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert className="postThreeDots" onClick={handleShow} />
          </div>
        </div>
        <div className="postCenter">
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
          <span className="postText">{post?.desc}</span>
          <img
            src={PF + "communityPosts/" + post.img}
            alt=""
            className="postImg"
          />
        </div>
        <div className="postBottom">
          <div className="postButtomLeft">
            <FavoriteBorder className="likeIcon" onClick={likeHandler} />
            <TwoWheeler className="likeIcon" onClick={likeHandler} />
            <span className="postLikeCounter">{like} people liked</span>
          </div>
          <div className="postButtomRight">
            <div className="postCommentText" onClick={commentClicked}>
              comments
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
