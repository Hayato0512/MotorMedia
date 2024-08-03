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
  const { user } = useContext(AuthContext); //this user is undefined.
  console.log("FavoriteBikes: user", user);
  const [favoriteBikes, setFavoriteBikes] = useState([]);
  const favoriteBikeIds = user?.favoriteMotorCycles;

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
    };
    fetchSpec();
  }, [user, favoriteBikes]);

  return (
    <div className="favoriteBikes">
      <div className="favoriteBikesWrapper">
        <div className="favoriteBikesTitle">Favorite Bikes</div>
        <div className="favoriteBikesEntries">
          {favoriteBikes.map((bike, i) => (
            <div className="favoriteBikesEntry" key={bike.id ? bike.id : i}>
              <FavoriteBike bike={bike} key={bike.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
