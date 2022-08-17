import React, { useState, useEffect } from "react";
import { NativeSelect, FormControl } from "@material-ui/core";
// import styles from "./makePicker.module.css";
// import { makeList } from '../../api';
import { makeList } from "../../../api";
import "./makePicker.css";
// what does makeList return??
//array that has 550 name.

//ok, next, once user choose the make, somehow set the state as the choosen one,
// and request API call with the make.
/**
 * in order to do that, we need to send information from this file into
 * the API index.js as parameter, so that we can make another api call only with teh
 * make name. and then, export that function to the modelPicker, so that modelPicker.jsx
 * can display all the model in the drop down menu.
 * and once user choose which model, then we need to pass that model name to api,
 * to request api call that fetches specs of the specific model.
 * once we get the data of specs, we can pass that to the next html page,
 * to show specs using a whole page.
 *
 *
 *
 */

//get all the makes, and put that as options in the dropDownMenu. that is it.
const MakePicker = ({ handleMakeChange }) => {
  const [fetchedMakes, setFetchedMakes] = useState([]);

  const fetchAPI = async () => {
    console.log("before setFetchedMakes");
    setFetchedMakes(await makeList());
    console.log("after setFetchedMakes");
    console.log("fetchedMakes are like this ", fetchedMakes);
  };
  useEffect(() => {
    fetchAPI();
  }, []);

  /*useEffect(() => {
        makeList().then(res => {
            // check status for response and set data accordingly
            setFetchedMakes(res.data)
            // log the data
        })
      },[])*/

  //超絶ナイス。
  return (
    <div className="makePicker">
      <div className="makePickerContentWrapper">
        <div className="makePickerText">Choose a make</div>
        <div className="makePickerForm">
          <FormControl>
            <NativeSelect
              defaultValue=""
              onChange={(e) => handleMakeChange(e.target.value)}
            >
              <option>Select...</option>
              {fetchedMakes.map((fetchedMake) => (
                <option key={fetchedMake}>{fetchedMake}</option>
              ))}
            </NativeSelect>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

//{fetchedMakes.map((fetchedMake)=><option>{fetchedMake}</option>)}

export default MakePicker;
