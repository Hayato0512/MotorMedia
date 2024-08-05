import React from "react";
import "./commentDetail.css";
import { useState, useEffect, useContext, useRef } from "react";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
export default function CommentDetail({ comment, onDelete }) {
  const [user, setUser] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  useEffect(() => {
    const getUsernameAsync = async () => {
      const userId = comment.userId;
      const res = await axiosInstance.get(`/users?userId=${userId}`);
      console.log("res.data is like this in Community page", res.data);
      const theUser = res.data;
      setUser(theUser);
    };
    getUsernameAsync();
  }, []);

  useEffect(() => {
    console.log(`comment is like this ${JSON.stringify(comment)}`);
    const userIdOfTheComment = comment.userId;
    if (currentUser._id === userIdOfTheComment) {
      setShowDeleteButton(true);
    }
  }, [comment]);

  const commentDeleteButtonClicked = async (event) => {
    console.log(
      `delete clicked. the current user is ${user._id}, and then the user who commented is ${event.target.id} `
    );
    //this try catch just fetch the comment
    try {
      const res = await axiosInstance.get(`/comments/${event.target.id}`);
      console.log(`res.data is ${res.data._id}`);
      const userIdOfThePost = res.data.userId;
      console.log(`userIdOfThePost is ${userIdOfThePost}`);
      if (userIdOfThePost !== currentUser._id) {
        console.log(`you cannot delete it `);
      } else {
        const res2 = await axiosInstance.delete(
          `/comments/${event.target.id}/${userIdOfThePost}`
        );
        console.log(`deletion success. `);
      }
      onDelete();
      //Here, I wanna update the UI. but only the comment component. not the whole screen.
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="commentDetail">
      <div className="commentDetailUpper">
        <div className="commentDetailUpperRight">
          <div className="commentCenterCommentUserPicrure">
            <img
              className="chatOnlineImg"
              src={
                user
                  ? PF + "person/" + user.profilePicture
                  : PF + "person/andrew.jpg"
              }
              alt=""
            />
          </div>
          <div className="commentCenterCommentUsername">
            {user ? user.username : <></>}
          </div>
        </div>
        {showDeleteButton ? (
          <>
            <div className="commentCenterCommentDeleteButtonDiv">
              <button
                className="commentCenterCommentDeleteButton"
                id={comment._id}
                onClick={commentDeleteButtonClicked}
              >
                delete
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="commentCenterComment">{comment.desc}</div>
    </div>
  );
}
