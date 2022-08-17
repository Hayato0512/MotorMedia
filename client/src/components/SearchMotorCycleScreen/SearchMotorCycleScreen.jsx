import { fetchData, fetchModels, fetchSpec } from "../../api/index";
import React, { Component, useState, useContext, useEffect } from "react";
import MakePicker from "../MotorCycleApis/makePicker/makePicker";
import ModelPicker from "../MotorCycleApis/modelPicker/modelPicker";
import Spec from "../MotorCycleApis/spec/spec";
import "./searchMotorCycleScreen.css";
import { AuthContext } from "../../context/AuthContext";
import OwnersList from "../OwnersList/OwnersList";
import axios from "axios";

import {
  Typography,
  AppBar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CssBaseline,
  Grid,
  Toolbar,
  Container,
  Button,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
//why if fetcheddata and makelist in bracket and makePicker is not??
import useStyles from "./style";
// import axios from "axios";
import { axiosInstance } from "../../config";

function SearchMotorCycleScreen() {
  //go through users in DB, to see if they own a motorCycle. to do that, I will get the name of the model, and then
  //for each entry in DB, I will take a look at their motorcycle array. and for each item in the array, I'll check if it matches with the given name of the model.
  //if match, i will send the use infomation and store into an array, so that I can show it in the list of owners.
  //the array is gonna be a state

  const classes = useStyles();
  /*
  state = 

    data:[],
    make:"",
    models:null,
    spec:{},
  }
* */
  const [data, setData] = useState([]);
  const [make, setMake] = useState("");
  const [specId, setSpecId] = useState("");
  const [models, setModels] = useState(null);
  const [spec, setSpec] = useState({});
  const [motorName, setMotorName] = useState({});
  const [ownersArray, setOwnersArray] = useState([]);
  const [ownerObjectsArray, setOwnerObjectsArray] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    //what is this fetchOwnerObjectsArray doing?
    //then, set the array as state  to do what?? to pass to the OwnersList. since in this page we don't really need ownersLIst.\
    //
    console.log("spec is there? or no?? =>", spec);
    if (Object.keys(spec).length === 0) {
      console.log("spec is not there yet. ");
    } else {
      console.log("spec is here. so we can do something at the same time");
      //
    }
    //so, once spec is there, we can do something.
    console.log("hey this useEffect is just called.");
    console.log(
      `ownerObjectsArray looks like this in iuseEffect ${ownerObjectsArray}`
    );
    //so, it is empty.
  }, [ownerObjectsArray.length]);

  if (Object.keys(spec).length !== 0) {
    //if specObject is empty, {}

    const favoriteBikeButtonClicked = async () => {
      const motorName = spec.articleCompleteInfo.modelName;
      let userMotorArrayLiked = user.favoriteMotorCycles; //this is user's motorCycle List
      console.log("user tried to put this bike into his fav");
      //まず、put that bike into the bike schema.
      //this try/catch deals with registering the MotorCycle.
      try {
        const resultMotor = await axiosInstance.get(
          `/motors?motorName=${motorName}`
        );
        if (resultMotor.data === null) {
          console.log("the bike does't exist in the DB. so will register.");
          console.log(
            `before throwing specId into the body, specId is ${specId}`
          );
          const motorBody = {
            motorName: motorName,
            specId: specId,
          };
          await axiosInstance.post("/motors/register", motorBody);
        } else {
          console.log("the bike exsits in the dataBase");
        }
      } catch (error) {
        console.log(error);
      }

      console.log("putting the userInto the likerList");
      //this try/catch deals with putting the user into the likerList.
      try {
        console.log("inside of trycatch putting the userInto the likerList1");
        const responseFromUpdateMotor = await axiosInstance.put(
          `/motors/${motorName}/${user._id}/like`
        );
        console.log("inside of trycatch putting the userInto the likerList2");
        // console.log(responseFromUpdateMotor);
      } catch (error) {
        console.log("inside of catch putting the userInto the likerList");
        // console.log(responseFromUpdateMotor);
        console.log(error);
      }

      console.log("putting motorId into the user's favMotorList.");
      //this try/catch deals with putting motorId into the user's favMotorList.
      try {
        const resultMotor2 = await axiosInstance.get(
          `/motors?motorName=${motorName}`
        );
        const arrayToPass = user.favoriteMotorCycles;
        const motorId = resultMotor2.data._id;
        if (arrayToPass.includes(motorId)) {
          console.log(
            "you already have it in your favoBikes, so this button click don't do anything"
          );
        } else {
          arrayToPass.push(motorId);
          console.log(`array to pass is this ${arrayToPass}`);
          //lastly, put the motor_id into the array, and then put that as req.body.
          //then, call axios.
          const userObjectForUpdate = {
            userId: user._id,
            favoriteMotorCycles: arrayToPass,
          };
          console.log("Hey we are updating the user. ");
          const responseFromUpdateUser = await axiosInstance.put(
            `/users/${user._id}`,
            userObjectForUpdate
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    const ownButtonClicked = async () => {
      const motorName = spec.articleCompleteInfo.modelName;
      console.log("the name of the model is ", motorName);
      let userMotorArray = user.motorCyclesOwned; //this is user's motorCycle List
      //このアッレイには、バイクの名前たちを入れていく。
      // userMotorArray = [1, 2, 3];
      const haveFlag = false;
      userMotorArray.forEach((element) => {
        if (element == motorName) {
          haveFlag = true;
          console.log(
            "the model is found in the array. so this user already have it."
          );
        }
      });
      //if the model is in the user's ownList, "already have it"
      if (haveFlag) {
        console.log(
          "the user already have this bike, so click don't do anything"
        );
      } else {
        console.log(
          "the user dont have this. so, first check if the model is registyerd, if not do it, and then, put the user into the list"
        );
        const resultMotor = await axiosInstance.get(
          `/motors?motorName=${motorName}`
        );
        // const res = await axios.get(`/users?userId=${post.userId}`);
        if (resultMotor.data === null) {
          // if(the model is not registered)
          //check if the name is in the schema by searchBYName. if null, then means the bike is not registered . so register.
          console.log("the bike does't exist in the DB. so will register.");
          //register the bike here

          // const userBody =
          //   userId: user._id,
          //   username: inputRefName.current.value,
          //   email: inputRefEmail.current.value,
          //   city: inputRefCity.current.value,
          //   age: inputRefAge.current.value,
          //   from: inputRefFrom.current.value,
          //   desc: inputRefDesc.current.value,
          // };
          const motorBody = {
            motorName: motorName,
          };
          const formData = new FormData();
          formData.append("motorName", motorName);
          formData.append("desc", "hey thiis is the motor");
          await axiosInstance.post("/motors/register", motorBody);
          // await axios.put("/motors", {})
        } else {
          console.log("result Motor is liek this", resultMotor.data);
        }
        //if the bike is already in the DB, then just put the user into the array.
        //just put the userId into the array of the motorCycle
        console.log("the bike exist in the DB.");
        //1, put the user into the ownerList of the bike how?=>get the bike, and userId, and update
        const responseFromUpdateMotor = await axiosInstance.put(
          `/motors/${motorName}/${user._id}`
        );
        console.log(responseFromUpdateMotor);
        //2, put the motorId into user's motorcycle
        //so, update the user information.

        //first, get the user. to fetch the ownerdMotorcycle Array.
        //user._motorCycles  でいけるわ。ゆーざーfetdchする必要なかったわ
        // ?motorName=${motorName}`
        //second, get the motorcycle, to get the motor._id.
        const resultMotor2 = await axiosInstance.get(
          `/motors?motorName=${motorName}`
        );
        const arrayToPass = user.motorCycles;
        const motorId = resultMotor2.data._id;
        console.log(`arrayToPass is like this ${user.motorCycles}`);
        console.log(`user...  is like this ${user.city}`);

        if (arrayToPass.includes(motorId)) {
          console.log(
            "you already have it, so this button click don't do anything"
          );
        } else {
          arrayToPass.push(motorId);
          console.log(`array to pass is this ${arrayToPass}`);
          //lastly, put the motor_id into the array, and then put that as req.body.
          //then, call axios.
          const userObjectForUpdate = {
            userId: user._id,
            motorCyclesOwned: arrayToPass,
          };
          const responseFromUpdateUser = await axiosInstance.put(
            `/users/${user._id}`,
            userObjectForUpdate
          );
        }
        //else if the model is not in the user's ownList, then
        //if the model is unregistered, register first
      }
      //put this user into the ownersList of this bikek
      //first, get the name of motorcycle, and the userId
      //and, make json object with name like this
      //How do I get the User?? Let's see how other page know who's in it
      //wait, if, the motorCycle is already registerd, only thing I do is put the userId into the array.
      //should I make a different axos request? like, just
      //if the motor is registerd, I need to register the motor first. and then , put the user into the array.]
      //so, I should defenetly separate them. so separation should occur in this file.
      //if(motor is not regisitered){
      //await axios.put("/register", motor)
      // }
      //await axios.put("/:userId")
      //こうやってやれば、もし登録されてなかったら、登録した後に、そのユーザーを、プットできる。
      //もし登録されてるんだったら、そのユーザーをプットするだけでいい。ok. let's do this .
      //tomorrow morning. I can do it!!51
      //Context is for passing down props essencially all the way down to any of the children. kindof global state for all of the children of the provider
      /**{
       * "motorname" :"unko"
       * "desc": ""
       * "owners" : [this user]
       * }
       * await axios.post("/motors/register", motor)
       * const motor = {
       * motorName: NAMEOFMOTORCYUCLE
       * 

      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        city: "",
        age: "",
      };
       * 
       */
    };
    const getOwnersInfo = async (element) => {
      const theUser = await axiosInstance.get(`/users?userId=${element}`);
      console.log("in getOwnersInfo(), the user is like this ", theUser.data);
      const returnObject = {
        username: theUser.data.username,
        city: theUser.data.city,
      };
      return returnObject;
    };
    return (
      <div className="searchMotorCycleResult">
        <div className="searchMotorCycleResultSpecDiv">
          <Spec spec={spec} />
        </div>
        <div className="searchMotorCycleResultRightDiv">
          <div className="searchMotorCycleResultRightDivWrapper">
            <button
              className="searchMotorCycleResultGoBackButton"
              variant="contained"
              onClick={() => {
                //setMake("");
                setModels(null);
                setSpec({});
              }}
            >
              Back to previous page
            </button>
            <div className="divForAddModelToFavorite">
              add this model to favorite?
              <button
                className="searchScreenOwnButton"
                onClick={favoriteBikeButtonClicked}
              >
                add
              </button>
            </div>
            <div className="divForOwningTheModel">
              You own this??
              <button
                className="searchScreenOwnButton"
                onClick={ownButtonClicked}
              >
                I own this
              </button>
            </div>
            <div className="searchScreenOwnersListDiv">
              <div className="searchScreenOwnersListTitle">Owners List</div>
              <div className="searchScreenOwnersList">
                {ownerObjectsArray.map((element) => {
                  if (ownerObjectsArray.size == 0) {
                    return <h1>loading...</h1>;
                  } else {
                    return;
                  }
                  //ここでasync使えないなら、外部のfunction にまずelement投げて、その
                  //function　をasync にして、そして　そこでaxios投げて、それをreturn するfunction をつくっるjk
                  //wait for a bit. for getOwnersInfo to finish.
                  //こっちが先に行っちゃってるから、usernameが定義されてないという子定義されているという状況
                  // const res = await axios.get(`/users?username=${username}`)
                  // const theUser = await axios.get(`/users?userId=${element}`);
                  // console.log(`theUser is like this ${JSON.stringify(theUser.data)}`);
                  // {theUser._id}aa
                  return (
                    <div className="searchScreenOwner">
                      <button className={classes.button}>contact</button>
                    </div>
                  );
                })}
                <OwnersList ownerObjectsArray={ownerObjectsArray} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const handleMakeChange = async (selectedMake) => {
    //console.log('he just changed it to ', selectedMake);
    const fetchedModel = await fetchModels(selectedMake);
    //console.log('fetchedModels are like this',fetchedModel);
    //    this.setState({make:selectedMake, models:fetchedModel});
    setMake(selectedMake);
    setModels(fetchedModel);

    //そしたr、このmakeの名前でAPIを読んで。dataをゲットする。そしたらそれをどうやってどこに投げる？？
    //add 'models' to the state.
    //で、<modelPicker data = {this.state.models}/>みたいなかんじでmodelPickerに投げてみる。
    //ok, now this function is successfully getting make change.
  };

  // useEffect(() => {
  //   const fetchMotor = async () => {
  //     console.log("hey this is useEffect in SearchMotorCycleScreen");
  //     const motorName = spec.articleCompleteInfo.modelName;
  //     setMotorName(motorName);
  //     const res = await axios.get(`/motors?motorName=${motorName}`);
  //     setOwnersArray(res.data);
  //     console.log(res.data);
  //     console.log("ok, got the bike in useEffect");
  //     //   inputRef.current.focus();
  //     //so, this axios get takes query instead of just /sdfa/jkfajd/jfdj
  //   };
  //   fetchMotor();
  // }, []);

  //this will be called when the model changes => that is exactly when we want to send the ownersArray to the ownersList.jsx
  const handleModelChange = async (selectedModel) => {
    //console.log('what up this is handleModelChange, you just selected ', selectedModel);
    let makeAndModel = {
      make: make,
      model: selectedModel,
    };
    //spec business
    var fetchedSpec;
    fetchedSpec = await fetchSpec(makeAndModel);
    const articleID = fetchedSpec.articleCompleteInfo.articleID;
    console.log(`articleID is ${articleID}`);
    var modelName = makeAndModel.model;
    setSpec(fetchedSpec);
    setSpecId(articleID);
    setMotorName(modelName);
    try {
      const res = await axiosInstance.get(`/motors?motorName=${modelName}`);
      console.log(
        "res.data.owners is like this -> in handleModelChange again!! ",
        res.data.owners
      );
      var ownersObjectsArray = [];
      res.data.owners.map(async (ownerId) => {
        const theUser = await axiosInstance.get(`/users?userId=${ownerId}`);
        ownersObjectsArray.push(theUser.data);
        // setOwnerObjectsArray((prev) => [[...prev, theUser.data]]);
        //I did it becuase the way before, it doen't change it. just same reference, add one, so the child won't know if the prop changes
      });
      console.log(
        "after map, ownersObjectsArray is like this ",
        ownersObjectsArray
      );
      console.log("so, i will try to set this as state");
      setOwnerObjectsArray(ownersObjectsArray);

      // const motorName = spec.articleCompleteInfo.modelName;//something is wrong with this
      // setMotorName(motorName);
      // setOwnersArray(res.data.owners);
      // res.data.owners.map(async (userId) => {
      //   const theUser = await axios.get(`/users?userId=${userId}`);
      //   //lets store data object into the aray
      //   ownersObjectsArray.push(theUser.data);
      //   // clg
      //   // ownersObjectsArray.push(theUser);
      //   console.log(`theUser in modelChagne is like this ${theUser.data}`);
      // });
      // console.log(
      //   "after mapping, the array looks like this",
      //   ownersObjectsArray
      // ); //よし。入ってるよ。
      // setOwnerObjectsArray(ownersObjectsArray);
      // console.log("ownersObjectsArray is set  like this=>", ownerObjectsArray);
      // そしたら、ここでお＝なー達の名前わかってるから、
      //こいつらをgo through して、store these userObjects into another state. so that I can access from UI ownersList
      // console.log("debug: modelName is like this", modelName);
      // console.log("before axios. clear");
      // const owners = await axios.get("/motors");
      // console.log("owners is like this ", owners);
      // //so, I think this await axios.get(*) is looping forever.
      // //cuz, it doesn't throw error. so, It's waiting.
      // //which means, there is something wrong with the call. let's go to index.js
      // console.log("after axios. clear");
    } catch (error) {
      console.log("debug: Ok, There is something wrong with axios.get(kjkjk");
      console.log("debug: ", error);
    }
    // setTimeout(async () => {
    //   fetchedSpec = await fetchSpec(makeAndModel);
    //   var modelName = makeAndModel.model;
    //   setSpec(fetchedSpec);
    //   console.log("debug: modelName is like this", modelName);
    //   working;
    //   const owners = await axios.get("/allusers");
    //   console.log("debug:owners are like this", owners);
    // }, 1000);
    //console.log('in app.js we recieved this spec ', fetchedSpec);
    //this.setState({spec:fetchedSpec});
  };
  //nice, ok then lets make a drop down menu to choose any bikes.
  //first, get all the makers. and let the user choose one.
  //once choosen, show one more drop down menu that has all the models from the makers.
  //and, once it is choosen, navigate user to a different page to show all the detail about
  // the motorCycle.
  let propsForModelPicker = {
    models: models,
    handleModelChange: handleModelChange,
  };

  return (
    <div className="searchMotorCycleScreenContainer">
      <div className="searchMotorCycleScreenTitleDiv">
        <div className="searchMotorCycleScreenTitleText">Search MotorCycle</div>
      </div>
      <div className="searchMotorCyclePickersDiv">
        <div className="searchMotorCycleMakePickerDiv">
          <MakePicker handleMakeChange={handleMakeChange} />
        </div>
        <div className="searchMotorCycleModelPickerDiv">
          <ModelPicker props={propsForModelPicker} />
        </div>
      </div>
    </div>
  );
}

// <Typography variant="h4">Choose a make</Typography>
// <Typography variant="h3" color="primary" gutterBottom>
//   Hayato's MotorCycle Search Engine
// </Typography>
//   <div className="searchMotorCycleScrenContainer">
//     // <Grid container spacing={2} className={classes.Grid}
//     //   <Grid item xs={12} md={12}>
//     //     <Typography variant="h3"></Typography>
//     //   </Grid>
//     //   <Grid item xs={12} md={12}>
//     //     <Typography variant="h3"></Typography>
//     //   </Grid>
//     //   <Grid item xs={12} md={12}></Grid>
//     //   <Grid item xs={12} md={6}>
//         <MakePicker handleMakeChange={handleMakeChange} />
//       // </Grid>
//       // <Grid item xs={12} md={6}>
//         <ModelPicker props={propsForModelPicker} />
//       // </Grid>
//       // <Grid item xs={12} md={6}></Grid>
//     // </Grid>
//   </div>
// );

export default SearchMotorCycleScreen;

// <Container maxWidth="sm">
//   <Typography variant="h2" align="center" color="textPrimary">
//     a
//   </Typography>
//   <Typography
//     variant="h5"
//     align="center"
//     color="textSecondary"
//     paragraph
//   >
//     Hello this is Hayato Koyama, I am trying to learn to style with
//     using material-ui here. so this paragraph has nothing to do with
//     the actual motorCycle app, but bear with me.
//   </Typography>
//   <div className={classes.button}>
//     <Grid container spacing={2}>
//       <Grid item>
//         <Button variant="contained" color="primary">
//           see my photo
//         </Button>
//       </Grid>
//       <Grid item>
//         <Button variant="outlined" color="secondary">
//           secondary action
//         </Button>
//       </Grid>
//     </Grid>
//   </div>
// </Container>

// <main>
//   <div className={classes.container}></div>
//   <Container className={classes.cardGrid} maxWidth="md">
//     <Grid container spacing={4}>
//       <Grid item>
//         <Card className={classes.card}>
//           <CardMedia
//             className={classes.cardMedia}
//             image="https://source.unsplash.com/random"
//             title="image title"
//           />
//           <CardContent className={classes.cardContent}>
//             <Typography variant="h5">Heading</Typography>
//             <Typography>
//               this is a media card. you can describe the content in here
//             </Typography>
//           </CardContent>
//           <CardActions>
//             <Button size="small" color="primary">
//               view
//             </Button>
//             <Button size="small" color="primary">
//               edit
//             </Button>
//           </CardActions>
//         </Card>
//       </Grid>
//     </Grid>
//   </Container>
// </main>

// <footer className={classes.footer}>
//   <Typography variant="h6" align="center">
//     Footer
//   </Typography>
//   <Typography variant="subtitle1" align="center" color="textSecondary">
//     Thank you for visiting my website.
//   </Typography>
// </footer>
