import "./rightbar.css";
import { Add, Remove } from "@material-ui/icons";
import React, { Component, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";
import { useNavigate } from "react-router-dom";
export default function Rightbar({ user }) {
  console.log("debug: inRightBar, user is like this", user); //UNDEFINED
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [currentUser2, setCurrentUser2] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("debug: currentUser is like th is", currentUser);
  const [favoriteBikes, setFavoriteBikes] = useState([]);
  const [favoriteMakes, setFavoriteMakes] = useState([]);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  );
  // console.log(
  //   "when this rightbar starts, currentUser(michelle).followings.includes(hayato) is this ",
  //   currentUser.followings.includes(user?._id)
  // );
  console.log(
    "when this rightbar starts, currentUser.followiongs is like this",
    currentUser.followings
  );

  useEffect(() => {
    //go through user's favIDs, and then fetch bike object, put that into list using Promise.all and then setFavortiteBikes. look at the sidber
    const fetchFavBikes = async () => {
      console.log("fetchFavBikes. user is ", user);
      const favoriteBikeIds = user.favoriteMotorCycles;
      const favoriteMakes = user.favoriteMakes;
      try {
        const list = await Promise.all(
          favoriteBikeIds.map(
            async (id) => await axiosInstance.get("/motors?motorId=" + id)
          )
        );
        setFavoriteBikes(list);
        setFavoriteMakes(favoriteMakes);
        console.log("list[0] is like this", list[0]);
      } catch (e) {
        console.log("fetchFavBikes: Rightbar.jsx: error received: ", e);
      }
    };
    if (user) {
      fetchFavBikes();
    }
  }, [user]);
  useEffect(() => {
    // const fetchUser = async () => {
    // };
    fetchUser();
    setTimeout(() => {
      console.log("after 1000 time out, user?_id is like this", user?._id);

      if (user && currentUser2.followings) {
        setFollowed(currentUser2.followings.includes(user?._id));
      }
      console.log(
        "check, does currentuser have user._id as followisn??",
        currentUser2.followings
      );
    }, 1000);
    console.log("prop user just updated now, ", user);
    // setTimeout(() => {
    //   console.log("user?.id is this after timeOut", user._id);
    // }, 1000);
  }, [user, currentUser.followings]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        if (user._id) {
          var currentUser2 = await axiosInstance.get(
            `/users?userId=${user._id}`
          );
          console.log(
            `in fetch communities, currentUSe2 is ${currentUser2.data.communities}`
          );
          const list = await Promise.all(
            currentUser2.data.communities.map(
              async (communityId) =>
                await axiosInstance(`/communities?communityId=${communityId}`)
            )
          );
          console.log(`list is like this ${list}`);
          setCommunities(list);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCommunities();
  }, [user]);
  // [user];
  const fetchUser = async () => {
    console.log("hello");
    var currentUser2 = await axiosInstance.get(
      `/users?userId=${currentUser._id}`
    );
    console.log("currentUser2 is like this", currentUser2.data);
    setCurrentUser2(currentUser2.data);
    console.log("hello2");
  };
  const handleClick = async () => {
    try {
      console.log("is hayato follow ? ", followed);
      if (followed) {
        await axiosInstance.put("/users/" + user._id + "/unfollow", {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axiosInstance.put("/users/" + user._id + "/follow", {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
        //where does this payload go??
      }
    } catch (error) {
      console.log(error);
    }
    setFollowed(!followed);
  };

  useEffect(() => {
    console.log(`will call getFriends to fetch all the friends`);
    const getFriends = async () => {
      try {
        console.log(`getFriends just before the axios `);
        if (currentUser2._id) {
          const friendList = await axiosInstance.get(
            "/users/friends/" + currentUser2._id
          );
          console.log(`getFriends just after the axios `);
          setFriends(friendList.data);
          console.log(`just setFriends. they are like ${friendList.data}`);
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    };

    getFriends();
  }, [currentUser2, user]);
  const HomeRightbar = () => {
    return (
      <>
        <div className="rightbarFollowings">
          <div className="rightbarFollowingsTitle">Friends</div>
          {friends.length !== 0 ? (
            friends.map((friend) => (
              <Link
                to={"/profile/" + friend.username}
                style={{ textDecoration: "none" }}
                key={friend.username}
              >
                <div className="rightbarFollowing">
                  <img
                    src={
                      friend.profilePicture
                        ? PF + "person/" + friend.profilePicture
                        : PF + "person/andrew.jpg"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">
                    {friend.username}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <>loading</>
          )}
        </div>
      </>
    );
  };
  ///hahah
  const communityEntryClicked = async (event) => {
    console.log(`communityClicked. id is ${event.target.id}`);
    //fetch the commuity object. and then navigate.
    try {
      const { data } = await axiosInstance(
        `/communities?communityName=${event.target.id}`
      );
      navigate("/DetailCommunity", { state: data });
    } catch (error) {
      console.log(error);
    }
  };
  const startChattingButtonClicked = async () => {
    console.log(
      "debug: start chat clieked, so let's figire out how to start chat. you can do it."
    );
    //create conversation. need both people's ID. get them first.
    //user -> そのプロファイルの持ち主
    //currentUser-> それをvisitしてる人。so the currentUser is the sender, user is the recieverj
    console.log(
      `so the user is ${user.username}, and then currentUser is ${currentUser.username}`
    );
    const senderId = currentUser._id;
    const recieverId = user._id;
    try {
      const bodyToPass = {
        senderId,
        recieverId,
      };
      //check if there is any conversation between them already , and if so, we don' tmake this axiosCall below.
      const resIfExist = await axiosInstance.get(
        `/conversations/find/${senderId}/${recieverId}`
      );
      console.log(`resIfExist is like this ${JSON.stringify(resIfExist.data)}`);
      if (resIfExist.data === null) {
        console.log("resIfExist is null, so ill create a new one.");
        const res = await axiosInstance.post("/conversations", bodyToPass);
        console.log(`res is like this ${res.data}`);
        navigate(`/messenger`);
      } else {
        console.log(
          "resIfExist is not null so it exists, so just navigate user to there"
        );
        navigate(`/messenger`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <div className="rightbarButtonsWrapper">
            <button className="rightbarFollowButton" onClick={handleClick}>
              {followed ? "Unfollow" : "Follow"}
              {followed ? <Remove /> : <Add />}
            </button>
            <div className="rightbarChatStartButtonWrapper">
              {followed ? (
                <button
                  className="rightbarChatStartButton"
                  onClick={startChattingButtonClicked}
                >
                  Start Chatting
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
        <h4 className="rightbarUserInfoTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">age:</span>
            <span className="rightbarInfoValue">{user.age}</span>
          </div>
        </div>
        <div className="rightbarFavorites">
          <div className="rightbarFavoritesWrapper">
            <div className="rightbarFavoriteMakes">
              <div className="rightbarFavoriteMakesTitle">Favorite Makes</div>
              <div className="rightbarFavoriteMakesEntries">
                {favoriteMakes.map((make) => (
                  <div className="rightbarFavoriteModelsEntry">{make}</div>
                ))}
              </div>
            </div>
            <div className="rightbarFavoriteModels">
              <div className="rightbarFavoriteModelsTitle" key={"title"}>
                Favorite Models
              </div>
              <div className="rightbarFavoriteModelsEntries" key={"entries"}>
                {favoriteBikes.map((bike, i) => (
                  <div
                    className="rightbarFavoriteModelsEntry"
                    key={bike.id ? bike.id : i}
                  >
                    {bike.data.motorName}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="rightbarFollowings">
          <span className="rightbarTitleUserFriend">User friends</span>
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
              key={friend.username}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + "person/" + friend.profilePicture
                      : PF + "person/andrew.jpg"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="rightbarCommunities">
          <div className="rightbarCommunitiesTitle">Communities</div>
          <div className="rightbarCommunityEntries">
            {communities.map((community) => (
              <div
                className="rightbarCommunityEntry"
                key={community.data.communityName}
                id={community.data.communityName}
                onClick={communityEntryClicked}
              >
                {community.data.communityName}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper"></div>
      {user ? <ProfileRightbar /> : <HomeRightbar />}
    </div>
  );
}
