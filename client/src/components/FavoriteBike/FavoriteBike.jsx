import React, { Component, useContext, useState, useEffect } from "react";
import { fetchSpecById } from "../../api/index";

export default function FavoriteBike({ bike }) {
  const [chosenBike, setChosenBike] = useState([]);
  const [specId, setSpecId] = useState("");
  const [make, setMake] = useState(null);
  console.log(`in FavoriteBike, bike is ${JSON.stringify(bike.data)}`);

  useEffect(() => {
    if (bike) {
      setChosenBike(bike.data);
      setSpecId(bike.data.specId);
    }
  }, [bike]);

  useEffect(() => {
    //get the spec by specID here
    const fetchSpec = async () => {
      console.log(`let's fetch the bikes information from the rapid API. `);
      console.log(`specId is like this in FavoriteBikes.jsx ${specId} `);
      const fetchedSpec = await fetchSpecById(specId);
      console.log(
        `ok, i just got fetchedSpec by ID. like this ${fetchedSpec.data.articleCompleteInfo.makeName}`
      );
      setMake(fetchedSpec.data.articleCompleteInfo.makeName);
    };
    if (specId) {
      fetchSpec();
    } else {
      console.log(`specId is not ready yet`);
    }
  }, [bike]);

  return (
    <div className="favoriteBike">
      <div className="favoriteBikeModelName">{bike.data.motorName} -</div>
      <div className="favoriteBikeMakeName">{make ? make : ""} </div>
    </div>
  );
}
