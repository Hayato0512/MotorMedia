import { React, useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";
import "./communityShare.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";

export default function CommunityShare({ communityId }) {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault(); //what is this for?

    const newPost = {
      userId: user._id,
      communityId: communityId,
      desc: desc.current.value,
    };
    if (file) {
      //if the picture exist, FIRST, post the picture to the DB.
      console.log("yes there is a file so go through this if statement");
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("file", file);
      data.append("name", file.name); //fileName
      console.log("data is like this in Share.jsx", data);
      newPost.img = file.name; //fileName

      //   console.log(newPost);
      try {
        console.log("debug: this one is not working.");
        await axiosInstance.post("/upload/community", data);
      } catch (error) {
        console.log("upload failed at line 30 in Share.jsx");
        console.log(error);
      }
    }

    try {
      await axiosInstance.post("/communityPosts", newPost);
      //これ消してもちゃんと、public に行く。

      window.location.reload();
      //installed multer and path to upload photos
      //multer is node.js middleware for uploading files
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={
              user.profilePicture
                ? PF + "person/" + user.profilePicture
                : PF + "person/" + "andrew.jpg"
            }
            alt=""
            className="shareImage"
          />
          <input
            placeholder={"What's to share in your group " + user.username + "?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareButtom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png, .jpeg, .jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <button className="shareButton" type="submit">
              share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
