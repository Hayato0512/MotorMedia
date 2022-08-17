import { React, useEffect, useState } from "react";
import "./profile.css";
import axios from "axios";
import { Person } from "@material-ui/icons";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useParams } from "react-router";
import { axiosInstance } from "../../config";
import "bootstrap/dist/css/bootstrap.css";
export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const [hover, setHover] = useState(false);
  const username = useParams().username;
  console.log(username);
  //clg
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);
  console.log("debug: user is like this", user);
  console.log(
    "debug: user's profile picture is like this ",
    user.profilePicture
  );
  const mouseHoverCover = () => {
    console.log("you just hover over the cover img");
    setHover(true);
  };
  const onLeave = () => {
    console.log("you just left the cover img");
    setHover(false);
  };
  const coverImgClicked = () => {
    console.log(
      "coverImg clicked, so you'll chose a picture, and upload, just like in the profile."
    );
  };

  const handleFileSubmit = async (file) => {
    console.log(
      "hey, the file is like this",
      file,
      ", so, i will set this as users rpfile, and also i will send this photo into the public page."
    );
    // file.preventDefault();
    if (file) {
      console.log("upload the photo here");
      const data = new FormData();
      data.append("file", file);
      data.append("name", file.name); //fileName
      console.log("file is like this in Setting.jsx", file);
      console.log("file.name is like this in Setting.jsx", file.name);
      console.log("data is like this in Setting.jsx", data);

      try {
        console.log("will upload this PROFILE PICTURE data", data);
        await axiosInstance.post("/upload", data);
        console.log(
          "after axios.post PROFILE PICTURE. if you see this message, then it means that the pic is successfullly uploaded."
        );
      } catch (error) {
        console.log(
          "there are some errors when uploading profile picture from Setting.jsx1"
        );
        console.log(error);
      }
    }
    const userBody = {
      userId: user._id,
      // username: user.username,
      coverPicture: file ? file.name : "",
    };
    // console.log("New Info= > username: " + inputRefName.current.value);
    try {
      console.log("debug:userBody is like th is ", userBody);
      console.log("iuser._id is like this", user._id);
      console.log("profilePic also get updated file.name is =>", file.name);
      await axiosInstance.put(`/users/${user._id}`, userBody);
      //relocate user to profile page

      // navigate(`/profile/${username}`);
    } catch (error) {
      console.log(error);
    }
  };
  return hover ? (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <label htmlFor="file" className="profileLabel">
              <div className="profileCover">
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png, .jpeg, .jpg"
                  onChange={(e) => {
                    // setFile(e.target.files[0]);
                    console.log("the file is this", e.target.files[0]);
                    console.log("just changed");
                    handleFileSubmit(e.target.files[0]);
                  }}
                />
                <img
                  src={
                    user.coverPicture
                      ? PF + "posts/" + user.coverPicture
                      : PF + "posts/river.JPG"
                  }
                  alt=""
                  className="profileCoverImg"
                  onMouseEnter={mouseHoverCover}
                  onMouseLeave={onLeave}
                  onClick={coverImgClicked}
                />
                <div className="divForClickToChangeText">
                  click to change the cover photo
                </div>
                <img
                  src={
                    PF + "person/" + user.profilePicture ||
                    PF + "person/andrew.jpg"
                  }
                  alt=""
                  className="profileUserImg"
                />
              </div>
            </label>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <label htmlFor="file" className="profileLabel">
              <div className="profileCover">
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png, .jpeg, .jpg"
                  onChange={(e) => {
                    // setFile(e.target.files[0]);
                    console.log("the file is this", e.target.files[0]);
                    console.log("just changed");
                    handleFileSubmit(e.target.files[0]);
                  }}
                />
                <img
                  src={
                    user.coverPicture
                      ? PF + "posts/" + user.coverPicture
                      : PF + "posts/river.JPG"
                  }
                  alt=""
                  className="profileCoverImg"
                  onMouseEnter={mouseHoverCover}
                  onMouseLeave={onLeave}
                  onClick={coverImgClicked}
                />
                <img
                  src={
                    PF + "person/" + user.profilePicture ||
                    PF + "person/andrew.jpg"
                  }
                  alt=""
                  className="profileUserImg"
                />
              </div>
            </label>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}

//rehugees from Rightbar.jsx
// useEffect(() => {
//   const list = currentUser2.favoriteMakes;
//   setFavoriteMakes(list);
//   console.log(`currentUser2.followings is this ${currentUser2}`);
//   setFollowed(currentUser2.followings.includes(user?._id));
// }, [currentUser2]);
