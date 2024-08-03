import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import { MoreVert, FavoriteBorder, TwoWheeler } from "@material-ui/icons";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { format } from "timeago.js";
import CommentDetail from "../../components/CommentDetail/CommentDetail";
import "./comment.css";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../config";
import CommentRightbar from "../../components/CommentRightbar/CommentRightbar";
import { AuthContext } from "../../context/AuthContext";
import PostInComment from "../../components/PostInComment/PostInComment";
export default function Comment() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [commenters, setCommenters] = useState([]);
  const inputRef = useRef();
  useEffect(() => {
    setPost(state.post);
  }, [state]);
  console.log(`in Comment page, data is ${state.post.userId}`);
  //state is null when from post.jsx

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
    console.log(
      `hey this is comment.jsx. so , window.location.href is ${window.location.href}`
    );
    console.log(`hey waht up a??????`);
    //get all the comments of the psot
    const fetchComments = async () => {
      console.log(`hey waht up a1??????`);
      if (post !== null) {
        console.log(`hey waht up a2??????`);
        try {
          const res = await axiosInstance.get(
            `/comments/allComments/${post._id}`
          );
          console.log(`hey waht up a3??????`);
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
  }, [post]);
  const commentSendButtonClicked = async () => {
    console.log(
      `comment button clicked, so , user is ${user.username}, and then postId ${post._id}, and the comment is ${inputRef.current.value}`
      //create acomment
    );

    const newComment = {
      userId: user._id,
      postId: post._id,
      desc: inputRef.current.value,
    };
    try {
      const res = await axiosInstance.post("/comments", newComment);
      console.log(`creating a new commentthe res.data is ${res.data}`);
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getUsernameAsync = async () => {
      try {
        if (post) {
          const res = await axiosInstance.get(`/users?userId=${post.userId}`);
          console.log("res.data is like this in Community page", res.data);
          const theUser = res.data;
          setPostUser(theUser);
          console.log(`will setPostUser`);
          console.log(`this is getUsername, ${theUser.username}`);
        }
      } catch (e) {}
    };
    getUsernameAsync();
  }, [post]);
  const goBackButtonClicked = () => {
    navigate(-1);
  };
  return (
    <>
      <Topbar />
      <div className="commentDiv">
        {post ? (
          <div className="comment">
            <div className="commentSidebarWrapper">
              <Sidebar />
            </div>
            <div className="commentCenter">
              <div className="commentCenterWrapper">
                <div className="commentCenterBackButtonWrapper">
                  <button
                    className="commentCenterBackButton"
                    onClick={goBackButtonClicked}
                  >
                    back
                  </button>
                </div>
                <div className="commentCenterPostWrapper">
                  <div className="commentPostWrapper">
                    <PostInComment key={post._id} post={post} />
                  </div>
                </div>
                <div className="commentCenterCommentWrapper">
                  <div className="commentCenterCommentInputs">
                    <input
                      type="text"
                      ref={inputRef}
                      placeholder="comment"
                      className="commentCenterCommentInput"
                    />
                    <button
                      className="commnetCenterCommentButton"
                      onClick={commentSendButtonClicked}
                    >
                      send
                    </button>
                  </div>
                  <div className="commentCenterComments">
                    {comments.map((comment, i) => (
                      <div
                        className="commentCenterCommentDetailWrapper
                    "
                        key={comment._id ? comment._id : i}
                      >
                        <CommentDetail comment={comment} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h1>loading</h1>
        )}
        <div className="commentRightbarWrapper">
          <CommentRightbar userOfThePost={postUser} commenters={commenters} />
        </div>
      </div>
    </>
  );
}

// {this.getUsername(comment.userId)}
