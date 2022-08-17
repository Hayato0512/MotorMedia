import React, { useState, useEffect } from "react";
import { NativeSelect, FormControl } from "@material-ui/core";
import "./modelPicker.css";
// import { fetchModels } from '../../api';
import { fetchModels } from "../../../api";

//we only wanna activate this if the value in the makePicker is not NULL.
//so,
//I need to think of a way to only activate this when user choose a make.
// How??
//now, I am struggling to wait for makePicker to send the make name, to the fetchModel,
//and then activate this jsx.
//so, I feel like we can wait on the fetchModel. instead of in here.
//like, in fetchModel in api/index.js, if make name is '', then wait to send request and wait to return something.
//and in this function, we can do something like
// const sosos = await fetchModel();
//hmm, or, we can just pass data to this ModelPicker from App.js. like <ModelPicker data = {fetchModel(make)}/>
//anyway, lets take a break a little bit.

//in app.js, set state make, and then, set the to like null or '' or something.
// and throw that into <ModelPicker make = {this.state.make}/>
//and, in modelPIcker.jsx, if the parameter is '', return nothing,
// if the parameter is not '', then call fetchAPI with the make name and
// get the datas, and return the drop down menu.
const ModelPicker = (fetchedModels) => {
  // if you want to pass multiple data to a component like this,
  // just parse them as a object and deconstrutthem

  var { props } = fetchedModels;
  var models = props.models;
  var handleModelChange = props.handleModelChange;
  //so models here is object, how to extrace models and the function from this?? next mission.
  //これに MOdelPicker = async (make)=>{}にsルト、objects cannot be react Child になる。
  //why?? lets come back to this why later.
  if (!models) {
    return (
      <div className="modelPickerWaiting">
        <div className="modelPickerWaitingTextDiv">
          <p>waiting for the user to select make...</p>
        </div>
      </div>
    );
  }
  //var fetchedModels =
  //だめだこれだと、ここでawaitでfetchedmodelをゲットできない。
  //so,once make is choosed, we need to fetch data in the app.js, and pass that as
  // parameter.
  //this one doen't need to recieve make. just need to recieve all the models from the make
  //so, in app.js, once makePikcer changed, in handleMakeChange,
  //fetch the all the models data, and set that as state, and , pass that into
  //<ModelPicker data = {this.state.models}/>

  return (
    <div className="modelPicker">
      <div className="modelPickerContentWrapper">
        <div className="modelPickerText">Choose a model</div>
        <div className="modelPickerForm">
          <FormControl>
            <NativeSelect
              defaultValue=""
              onChange={(e) => handleModelChange(e.target.value)}
            >
              <option>Select..</option>
              {models.map((model) => (
                <option key={model}>{model}</option>
              ))}
            </NativeSelect>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default ModelPicker;

//yw copy the word under the cursor

/** 
    
<ModelPicker make ={this.state.make}/>
*/

//Now, we can specify a specific model, so get all the specs of the model,
//and show that in another page

//we need onChange in this modelPicker to pass the model name to somewhere, where??
// in app.js. make handleModelChange function that get a model name as parameter.
// and then fetch data by calling a function in api/index.js , from App.js.
// and then set that spec as state, and then pass that to <Spec spec = {this.state.spec}/>
//and spec.jsx recieve the spec, and show that in a card or something. or div for now.

// ok , fucking awesome. now , we are able to pass a model name to the app.js.
//so, now, we want to pass that to api/index.js to fetch the spec
