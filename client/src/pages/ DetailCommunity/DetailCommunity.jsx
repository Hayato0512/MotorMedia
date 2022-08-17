import { React, useRef, useContext, useState, useEffect } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import { axiosInstance } from "../../config";
import CommunityRightbar from "../../components/CommunityRightbar/CommunityRightbar";
import CommunityShare from "../../components/CommunityShare/CommunityShare";
import CommunityList from "../../components/CommunityList/CommunityList";
import CommunityFeed from "../../components/CommunityFeed/CommunityFeed";
import { useNavigate, useLocation } from "react-router-dom";
import "../Community/community.css";
import "./detailCommunity.css";
import { AuthContext } from "../../context/AuthContext";

export default function DetailCommunity() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();

  const { state } = useLocation();
  const chosenCommunity = state;
  console.log(
    `hey this is DetailCommunity, data is like this ${state.communityName}`
  );
  useEffect(() => {
    console.log(chosenCommunity);
    if (chosenCommunity.members.includes(user.username)) {
      console.log("yes, your the part of our group.");
      setIsMember(true);
    } else {
      console.log("no, your not the part of our group.");
      setIsMember(false);
    }
  }, [user, chosenCommunity]);
  const joinButtonClicked = async () => {
    console.log("lets join the user. ");
    console.log(`${user.username}`);
    console.log(`${chosenCommunity.members}`);
    console.log(
      "take this user's id(name), and communityName. and then just update the community"
    );
    var membersArray = chosenCommunity.members;
    if (membersArray.includes(user.username)) {
      console.log("you are already here");
    } else {
      membersArray.push(user.username);
      const bodyToPass = {
        members: membersArray,
      };
      try {
        const res = await axiosInstance.put(
          "/communities/" + chosenCommunity._id + "/update",
          bodyToPass
        );
        console.log(`res.data is like this ${res.data}`);
        const communityId = chosenCommunity._id;
        const originalCommunityArray = user.communities;
        originalCommunityArray.push(communityId);
        const userUpdateObject = {
          userId: user._id,
          communities: originalCommunityArray,
        };
        try {
          await axiosInstance.put(`/users/${user._id}`, userUpdateObject);
          console.log("the user's community has been updated");
        } catch (error) {
          console.log(error);
        }

        //put the communityID into user's communityList too.
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const goBackButtonClicked = () => {
    console.log("let's go back.");
    navigate(`/community`);
  };
  return isMember ? (
    <>
      <Topbar />
      <div className="chosencommunity">
        <div className="chosencommunitySidebarContainer">
          <Sidebar />
        </div>
        <div className="chosencommunityRight">
          <div className="chosencommunityRightTop">
            <div className="chosencommunityCover">
              <button
                className="chosencommunityGoBackButton"
                onClick={goBackButtonClicked}
              >
                go back to public community page
              </button>
              <img
                src={
                  chosenCommunity.coverPicture
                    ? PF + "posts/" + chosenCommunity.coverPicture
                    : PF + "posts/river.JPG"
                }
                alt=""
                className="chosencommunityCoverImg"
              />
              <div className="chosencommunityTitle">
                <h1 className="chosencommunityTitleText">
                  {chosenCommunity.communityName}
                </h1>
              </div>
            </div>
          </div>
          <div className="chosencommunityRightBottom">
            <div className="chosencommunityRightCenter">
              <div className="chosencommunityRightCenterFeed">
                <CommunityFeed chosenCommunity={chosenCommunity} />
              </div>
            </div>
            <div className="chosencommunityRightRight">
              <CommunityRightbar
                chosenCommunity={chosenCommunity}
                hidden={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Topbar />
      <div className="hiddenchosencommunity">
        <div className="hiddenchosencommunitySidebar">
          <Sidebar />
        </div>
        <div className="hiddenchosencommunityRight">
          <div className="hiddenchosencommunityRightTop">
            <div className="hiddenchosencommunityCover">
              <img
                src={
                  chosenCommunity.coverPicture
                    ? PF + "posts/" + chosenCommunity.coverPicture
                    : PF + "posts/river.JPG"
                }
                alt=""
                className="hiddenchosencommunityCoverImg"
              />
              <div className="hiddenchosencommunityTitle">
                <h1 className="hiddenchosencommunityTitleText">
                  {chosenCommunity.communityName}
                </h1>
                <div className="hiddenchosencommunityJoinButton">
                  <button
                    className="hiddenchosencommunityJoinButton"
                    onClick={joinButtonClicked}
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="hiddenchosencommunityRightBottom">
            <div className="hiddenchosencommunityRightCenter">
              <div className="hiddenchosencommunityRightCenterFeed"></div>
            </div>
            <div className="hiddenchosenCommunityRightRight">
              <CommunityRightbar
                chosenCommunity={chosenCommunity}
                hidden={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
