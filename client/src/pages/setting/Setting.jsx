import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "./setting.css";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import { axiosInstance } from "../../config";
export default function Setting() {
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  //   const [city, setCity] = useState({});
  const username = useParams().username;
  //now this username has "hayato"
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const inputRefCity = useRef();
  const inputRefName = useRef();
  const inputRefEmail = useRef();
  const inputRefAge = useRef();
  const inputRefFrom = useRef();
  const inputRefDesc = useRef();
  const navigate = useNavigate();
  //what is null? initial value??
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/users?username=${username}`);
      setUser(res.data);
      console.log(res.data);
      //   inputRef.current.focus();
      //so, this axios get takes query instead of just /sdfa/jkfajd/jfdj
    };
    fetchUser();
  }, [username]);
  //[username] means, everytime username changs, call thsi useEffect again to update

  const handleClick = async (e) => {
    console.log(
      "hey, the file is like this",
      file,
      ", so, i will set this as users rpfile, and also i will send this photo into the public page."
    );
    e.preventDefault();
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
        await axiosInstance.post("/upload/profile", data);
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
      // username: inputRefName.current.value,
      profilePicture: file ? file.name : user.profilePicture,
      email: inputRefEmail.current.value,
      city: inputRefCity.current.value,
      age: inputRefAge.current.value,
      from: inputRefFrom.current.value,
      desc: inputRefDesc.current.value,
    };
    // console.log("New Info= > username: " + inputRefName.current.value);
    try {
      console.log("debug:userBody is like th is ", userBody);
      console.log("iuser._id is like this", user._id);
      await axiosInstance.put(`/users/${user._id}`, userBody);
      setTimeout(() => {
        console.log("Yes, I just updated the user information. Take a look.");
      }, 5000);
      //relocate user to profile page
    } catch (error) {
      console.log(`error occured when updating`);
      setTimeout(() => {
        console.log(error);
      }, 5000);
    }
    navigate(`/profile/${username}`);
  };
  return (
    <>
      <Topbar />
      <div className="setting">
        <div className="settingWrapper">
          <form className="settingInputs" onSubmit={handleClick}>
            <div className="settingLeft">
              <div className="settingImage">
                <img
                  src={PF + "person/" + user.profilePicture}
                  alt=""
                  className="settingImg"
                />
                <div className="settingImgeInput">
                  <label htmlFor="file" className="settingLabel">
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="file"
                      accept=".png, .jpeg, .jpg"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        console.log("the file is this", e.target.files[0]);
                      }}
                    />
                    <span>click to upload a profile picture</span>
                  </label>
                </div>
              </div>
              <div className="settingLeftBottom"></div>
            </div>
            <div className="settingRight">
              <div className="settingRightInputs">
                <div className="settingRightUpperInputs">
                  <div className="settingInput">
                    <div className="settingInputWrapper">
                      email
                      <input
                        type="text"
                        ref={inputRefEmail}
                        defaultValue={user.email}
                        className="settingInputField"
                      />
                    </div>
                  </div>
                  <div className="settingInput">
                    <div className="settingInputWrapper">
                      City
                      <input
                        ref={inputRefCity}
                        type="text"
                        defaultValue={user.city}
                        className="settingInputField"
                      />
                    </div>
                  </div>
                  <div className="settingInput">
                    <div className="settingInputWrapper">
                      Age
                      <input
                        type="text"
                        ref={inputRefAge}
                        defaultValue={user.age}
                        className="settingInputField"
                      />
                    </div>
                  </div>
                </div>
                <div className="settingRightLowerInputs">
                  <div className="settingInput">
                    <div className="settingInputWrapper">
                      From
                      <input
                        type="text"
                        ref={inputRefFrom}
                        defaultValue={user.from}
                        className="settingInputField"
                      />
                    </div>
                  </div>
                  <div className="settingInputBio">
                    <div className="settingInputWrapper">
                      Bio
                      <input
                        type="text"
                        size={50}
                        ref={inputRefDesc}
                        defaultValue={user.desc}
                        className="settingInputFieldBio"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="settingRightButtonSection">
                <div className="updateButtonContainer">
                  <button className="updateButton" type="submit">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
