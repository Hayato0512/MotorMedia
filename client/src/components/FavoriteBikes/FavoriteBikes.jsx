import React, { Component, useContext, useState, useEffect } from "react";
import FavoriteBike from "../FavoriteBike/FavoriteBike";
import {
  fetchData,
  fetchModels,
  fetchSpec,
  fetchSpecById,
} from "../../api/index";
import "./favoriteBikes.css";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";

export default function FavoriteBikes() {
  const { user } = useContext(AuthContext);
  const [favoriteBikes, setFavoriteBikes] = useState([]);
  const favoriteBikeIds = user.favoriteMotorCycles;

  useEffect(() => {
    //go through user's favIDs, and then fetch bike object, put that into list using Promise.all and then setFavortiteBikes. look at the sidber
    const fetchFavBikes = async () => {
      const list = await Promise.all(
        favoriteBikeIds.map(
          async (id) => await axiosInstance.get("/motors?motorId=" + id)
        )
      );
      setFavoriteBikes(list);
      console.log("list[0] is like this", list[0]);
    };
    fetchFavBikes();
  }, [user]);

  useEffect(() => {
    const fetchSpec = async () => {
      console.log(`let's fetch the bikes information from the rapid API. `);
      console.log(
        `specId is like this in FavoriteBikes.jsx ${favoriteBikes[4].data.specId} `
      );
      const fetchedSpec = await fetchSpecById(favoriteBikes[4].data.specId);
      console.log(
        `ok, i just got fetchedSpec by ID. like this ${fetchedSpec.data.articleCompleteInfo.makeName}`
      );
    };
    fetchSpec();
    //so throw this spec id, to get the all the spec with the given Id.

    //let's see how spec is fetching hte thing
    //じゃなくて、userがお気に入りに登録するところで、もうそれをsave the object, as JSON.stringfy(object), so that we can just
  }, [user, favoriteBikes]);

  //   useEffect(() => {
  //     const fetchFollowings = async () => {
  //       const list = await Promise.all(
  //         followingsList.map(
  //           async (id) => await axiosInstance.get("/users?userId=" + id)
  //         )
  //       );
  //       console.log(`the list from promise.all is ${list}`);

  //       setFollowings(list);
  //     };
  //     fetchFollowings();
  //     // const fetchFollowings = async () => {
  //     //   followingsList.map(async (id) => {
  //     //     try {
  //     //       const theUser = await axiosInstance.get(`/users?userId=${id}`);
  //     //       if (followings.includes(theUser.data)) {
  //     //       } else {
  //     //         setFollowings((prev) => [...prev, theUser.data]);
  //     //       }
  //     //     } catch (error) {
  //     //       console.log(error);
  //     //     }
  //     //   });
  //     // };
  //     // fetchFollowings();
  //   }, [user]);
  return (
    <div className="favoriteBikes">
      <div className="favoriteBikesWrapper">
        <div className="favoriteBikesTitle">Favorite Bikes</div>
        <div className="favoriteBikesEntries">
          {favoriteBikes.map((bike) => (
            <div className="favoriteBikesEntry">
              <FavoriteBike bike={bike} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
