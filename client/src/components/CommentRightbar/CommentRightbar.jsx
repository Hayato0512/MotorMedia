import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./commentRightbar.css";

export default function CommentRightbar({ userOfThePost, commenters }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [commentersList, setCommentersList] = useState([]);
  useEffect(() => {
    console.log(`userOfThePost is ${userOfThePost}`);
  }, [userOfThePost]);
  return userOfThePost ? (
    <div className="commentRightbar">
      <div className="commentRightbarWrapper2">
        <div className="commentRightbarUserInfo">
          <div className="commentRightbarUserInfoTitle">User information</div>
          <div className="commentRightbarUserImgDiv">
            <img
              src={`${PF}/person/${userOfThePost.profilePicture}`}
              alt="profilePicture"
              className="commentRightbarUserImg"
            />
          </div>
          <div className="commentRightbarUserinfoItem">
            <span className="commentRightbarUserInfoKey">name:</span>
            <span className="commentRightbarUsername">
              {userOfThePost.username}
            </span>
          </div>
          <div className="commentRightbarUserinfoItem">
            <span className="commentRightbarUserInfoKey">city:</span>
            <span className="commentRightbarUserCity">
              {userOfThePost.city}
            </span>
          </div>
          <div className="commentRightbarUserinfoItem">
            <span className="commentRightbarUserInfoKey">from:</span>
            <span className="commentRightbarUserFrom">
              {userOfThePost.from}
            </span>
          </div>
          <div className="commentRightbarUserinfoItem">
            <span className="commentRightbarUserInfoKey">age:</span>
            <span className="commentRightbarUserAge">{userOfThePost.age}</span>
          </div>
        </div>

        <div className="commentRightbarCommentersList">
          <div className="commentRightbarCommentersListTitle">Commenters</div>
          {commenters ? (
            commenters.map((commenter) => (
              <>
                <Link
                  to={"/profile/" + commenter.data.username}
                  style={{ textDecoration: "none" }}
                  key={commenter.data.username}
                >
                  <div
                    className="commentRightbarCommenter"
                    key={commenter.data.username}
                  >
                    <div className="commentRightbarCommenterImgDiv">
                      <img
                        src={
                          commenter.data.profilePicture
                            ? PF + "person/" + commenter.data.profilePicture
                            : PF + "person/andrew.jpg"
                        }
                        alt=""
                        className="commentRightbarCommenterImg"
                      />
                    </div>
                    <div className="commentRightbarCommenterUsername">
                      {commenter.data.username}
                    </div>
                  </div>
                </Link>
              </>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  ) : (
    <>Loading</>
  );
}
