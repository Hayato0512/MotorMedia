import { React, useContext, useState, useEffect, useRef } from "react";
import CommunityPost from "../CommunityPost/CommunityPost";
import CommunityShare from "../CommunityShare/CommunityShare";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";

export default function CommunityFeed({ chosenCommunity }) {
  //community object will come as prop from communityScreen
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  console.log(`in CommunityFeed, chosenCommunity is ${chosenCommunity}`);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("user is like this" + user);
      console.log("user._id is liek this" + user._id);
      //i want this axios to be community
      try {
        console.log(
          "before the axios in communityFEED",
          chosenCommunity.communityName
        );
        const res = await axiosInstance.get(
          "/communityPosts/community/" + chosenCommunity.communityName
        );
        console.log("after the axios in communityFEED");
        console.log(
          "res.data in CommunityFeed is like this COMMUNITYFEEDu",
          res.data
        ); //this is working. nice.next, let's just post. I need to get some help from share
        setPosts(
          res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    setTimeout(() => {
      console.log(
        "community is like this in communityFeed.jsx ",
        chosenCommunity
      );
    }, 1000);
    fetchPosts();
  }, [chosenCommunity]);
  return (
    <div className="communityFeed">
      <div className="communityFeedWrapper">
        <CommunityShare communityId={chosenCommunity._id} />
        {posts.map((p) => (
          <CommunityPost key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
