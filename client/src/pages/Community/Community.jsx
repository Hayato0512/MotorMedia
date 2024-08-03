import { React, useRef, useContext, useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Toolbar,
  Container,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import CommunityList from "../../components/CommunityList/CommunityList";
import CommunityFeed from "../../components/CommunityFeed/CommunityFeed";
import { AuthContext } from "../../context/AuthContext";
import CommunityScreen from "../../components/CommunityScreen/CommunityScreen";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import { axiosInstance } from "../../config";
import CommunityRightbar from "../../components/CommunityRightbar/CommunityRightbar";
import CommunityShare from "../../components/CommunityShare/CommunityShare";
import "./community.css";
import { ExpandLessSharp } from "@material-ui/icons";
import DetailCommunity from "../ DetailCommunity/DetailCommunity";
import { useNavigate } from "react-router-dom";

export default function Comunity() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [currentUser, setCurrentUser] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [communityNames, setCommunityNames] = useState([]);
  const [chosenCommunity, setChosenCommunity] = useState(null);
  const inputRefName = useRef();
  const { user } = useContext(AuthContext);
  var theUser = null;
  const Navigate = useNavigate();
  const inputRef = useRef();
  //use this user._id to set currentUser as state

  useEffect(() => {
    const fetchUserAndSetCommunities = async () => {
      const res = await axiosInstance.get(`/users?userId=${user._id}`);
      console.log("res.data is like this in Community page", res.data);
      theUser = res.data;
      console.log("res.data.communities.size is ", res.data.communities.length);
      const list = await Promise.all(
        res.data.communities.map(
          async (communityId) =>
            await axiosInstance(`/communities?communityId=${communityId}`)
        )
      );
      console.log(`list is like this ${list} in Community`);
      setCommunities(list);
      // res.data.communities.map(async (communityId) => {
      //   //should be 4 of them
      //   try {
      //     const community = await axiosInstance(
      //       `/communities?communityId=${communityId}`
      //     );
      //     console.log(
      //       "community is like this hahahhahahHSAHAHAHAH",
      //       community.data
      //     );
      //     ///before putting the new data into the array, print array everytime to see if the duplicate actually exists
      //     console.log(
      //       `before putting new communityData ${community.data}, the communities array look like ${communities}`
      //     );
      //     console.log(
      //       `before the if statement. communityNames ->${communityNames}, communityNameComeing is ${community.data.communityName}`
      //     );

      //     if (checkIfExist(community.data.communityName)) {
      //       console.log(
      //         `${community.data} is already in the array. so don't set it.`
      //       );
      //     } else {
      //       console.log(
      //         `${community.data.communityName} is not there yet. So, will set`
      //       );
      //       setCommunities((prev) => [...prev, community.data]);
      //       // communityNames.push(community.data.communityName);
      //       communitiesGlobal.push(community.data.communityName);
      //       // setCommunityNames((prev) => [
      //       //   ...prev,
      //       //   community.data.communityName,
      //       // ]);
      //     }
      //   } catch (error) {
      //     console.log(error);
      //   }
      // });
    };
    fetchUserAndSetCommunities();
  }, [user]);
  // useEffect(() => {
  //   console.log("communities just changed to like this", communities);
  //   //   //     setCommunities(communityObjectArrayTemp);
  //   //   //     setCurrentUser(theUser);
  // }, [communities]);
  // const checkIfExist = (communityName) => {
  //   if (communitiesGlobal.includes(communityName)) {
  //     console.log("yes, it includes. so don't put this one in the state array");
  //     return true;
  //   } else {
  //     console.log(
  //       "yes, the array don't include this. so don't put this one in the state array"
  //     );
  //     return false;
  //   }
  // };
  const communityCreateButtonClicked = async () => {
    console.log(
      "createButtonClicked, now, the ref is this",
      inputRefName.current.value
    );
    const res = await axiosInstance.get(`/users?userId=${user._id}`);
    console.log("res.data is like this in Community page", res.data);
    theUser = res.data;

    const inputName = inputRefName.current.value;
    const communityObject = {
      name: inputName,
      leaderId: theUser._id,
      members: [user.username],
      //members にleader入れrてpass
    };
    try {
      const returnedCommunity = await axiosInstance.post(
        "/communities/register",
        communityObject
      );
      console.log(
        "congrats. after register, returnedCommunity ->_id  is like this ",
        returnedCommunity.data._id
      );
      // console.log("currentUser is like this", currentUser);
      const originalCommunityArray = theUser.communities;
      console.log(
        "originalCommunityArray is like this",
        originalCommunityArray
      );
      originalCommunityArray.push(returnedCommunity.data._id);
      console.log(
        "originalCommunityArray is like this after adding the created community _id",
        originalCommunityArray
      );
      const userUpdateObject = {
        userId: user._id,
        communities: originalCommunityArray,
      };
      await axiosInstance.put(`/users/${user._id}`, userUpdateObject);
      console.log(
        "congratsration. you just added the community id into your aray."
      );

      //now this is the id that we put into the currentUser's community array. do it.
    } catch (error) {
      console.log(error);
    }
    window.location.reload();
    //here, do axios.put register with the given name.
  };

  const communityButtonClicked = async (event) => {
    console.log("hey event.target.id is like this", event.target.id);
    //ok, now we have the name of the community, so
    try {
      const { data } = await axiosInstance(
        `/communities?communityName=${event.target.id}`
      );
      console.log("the chosen community feching is ready like this", data);
      //ok, the object are ready , let's set this
      Navigate("/DetailCommunity", { state: data });
      // setChosenCommunity(data);
    } catch (error) {}
  };
  const communitySearchButtonClicked = async () => {
    console.log("ok, ill take the user to the community if the name hits");
    console.log(inputRef.current.value);
    const searchedCommunityName = inputRef.current.value;
    //jump to the community page.
    //first, get the community by axiosIn stance, to see if it exist.
    try {
      const { data } = await axiosInstance(
        `/communities?communityName=${searchedCommunityName}`
      );
      if (data == null) {
        console.log("sorry, the community doesn't exist");
      } else {
        // setChosenCommunity(data);
        Navigate("/DetailCommunity", { state: data });
        //take the user to the communitypage
      }
    } catch (error) {}
    //if exist, then navigate user to the communitypage.
    //if not, then don't take any step
  };
  const goBackButtonClicked = () => {
    console.log("let's go back.");
    setChosenCommunity(null);
    // navigate(`/community`);
  };

  return chosenCommunity ? (
    <>
      <button
        className="chosencommunityGoBackButton"
        onClick={goBackButtonClicked}
      >
        go back to public community page
      </button>
      <DetailCommunity chosenCommunity={chosenCommunity} />
    </>
  ) : (
    <>
      <Topbar />
      <div className="community">
        <div className="comunitySideberWrapper">
          <Sidebar />
        </div>
        <div className="communityUnko">
          <div className="communityUpperDiv">
            <div className="communityTitle">Community List</div>
            <div className="communityCreateInputs">
              <h1 className="communityCreateTitle">Create a community</h1>
              <div className="communityCreateInputDiv">
                <div className="communityCreateInputField">
                  <input
                    type="text"
                    ref={inputRefName}
                    placeholder="type new community name"
                  />
                </div>
                <div className="communityCreateButton">
                  <button
                    onClick={communityCreateButtonClicked}
                    className="communityCreateButton"
                  >
                    create
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="communitySearch">
            <h2 className="communitySearchTitle">SearchCommunity</h2>
            <div className="communitySearchInputDivs">
              <div className="communitySearchInput">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a community name"
                />
              </div>
              <div className="communitySearchButton">
                <button
                  onClick={communitySearchButtonClicked}
                  className="communitySearchButton"
                >
                  go
                </button>
              </div>
            </div>
          </div>

          <div className="communityEntries">
            {communities.map((c, i) => {
              return (
                <div className="communityEntry" key={c && c.id ? c.id : i}>
                  <h3 className="communityEntryName" key={c.data.id}>
                    {c.data.communityName}
                  </h3>
                  <button
                    className="communityEntryButton"
                    key={c.data}
                    id={c.data.communityName}
                    onClick={communityButtonClicked}
                  >
                    go
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="communityRightbarWrapper">
          <Rightbar />
        </div>
      </div>
    </>
  );
}

// <CommunityList communities={communitiesGlobal} />
