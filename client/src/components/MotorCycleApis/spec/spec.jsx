import React, { useState, useEffect, useContext } from "react";
import { axiosInstance } from "../../../config";
import { AuthContext } from "../../../context/AuthContext";
import "./spec.css";
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
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
// import useStyles from '../../pages/Home/style';
import useStyles from "./style";
import { ExpandMore } from "@material-ui/icons";
const Spec = (spec) => {
  const { user } = useContext(AuthContext);
  console.log(`in spec.jsx, the user is ${user.favoriteMotorCycles}`);
  const classes = useStyles();
  let specObject = spec.spec;
  var arrayToPass = user.favoriteMakes;
  //let otherSpecs = spec.
  // console.log("specObject is ", specObject);

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (Object.keys(specObject).length === 0) {
    //if specObject is empty, {}
    return;
  }

  let { articleCompleteInfo } = specObject;
  let { articleImage } = specObject;
  let { chassisSuspensionBrakesAndWheels } = specObject;
  // console.log(chassisSuspensionBrakesAndWheels);
  // console.log(articleCompleteInfo);
  let { makeName } = articleCompleteInfo;
  let { modelName } = articleCompleteInfo;
  let { categoryName } = articleCompleteInfo;
  let { priceName } = articleCompleteInfo;
  let { yearName } = articleCompleteInfo;
  let imageLink = articleImage.link;
  let { frontBrakesName } = chassisSuspensionBrakesAndWheels;
  let { frontSuspensionName } = chassisSuspensionBrakesAndWheels;
  let { rearBrakesName } = chassisSuspensionBrakesAndWheels;
  let { rearSuspensionName } = chassisSuspensionBrakesAndWheels;

  const addMakeButtonClicked = async () => {
    console.log(
      "debug: let's fetch the make name, and then add it to the list. but we need to create schema first. its called favoriteMakes"
    );
    //add makeName to User's list by updating. same process
    if (user.favoriteMakes === undefined) {
      console.log(
        "the user's favoriteMakes array is undefined. user don't have the array yet"
      );
      addMakeToList();
    } else {
      if (arrayToPass.includes(makeName)) {
        console.log("debug: the user already has it in the favMakeList");
      } else {
        addMakeToList2();
      }
    }
  };
  const addMakeToList = async () => {
    arrayToPass = [];
    arrayToPass.push(makeName);
    const userObjectForUpdate = {
      userId: user._id,
      favoriteMakes: arrayToPass,
    };
    try {
      const responseFromUpdateUser = await axiosInstance.put(
        `/users/${user._id}`,
        userObjectForUpdate
      );
      console.log("Hey we just updated the user. have a look.");
    } catch (error) {
      console.log(error);
    }
  };
  const addMakeToList2 = async () => {
    arrayToPass.push(makeName);
    const userObjectForUpdate = {
      userId: user._id,
      favoriteMakes: arrayToPass,
    };
    try {
      const responseFromUpdateUser = await axiosInstance.put(
        `/users/${user._id}`,
        userObjectForUpdate
      );
      console.log("Hey we just updated the user. have a look.");
    } catch (error) {
      console.log(error);
    }
  };
  //justify="center"で真ん中に来た。おk。
  return (
    <div className="spec">
      <div className="specWrapper">
        <div className="specUpperDiv">
          <div className="specModelName">{modelName}</div>
        </div>
        <div className="specLowerDiv">
          <div className="specImageContainer">
            <img src={imageLink} alt="" className="specImage" />
          </div>

          <div className="specSpecContainer">
            <div className="specBasicSpecContainer">
              <div className="specBasicSpecItem">
                <div className="specBasicSpecKey">make:</div>
                <div className="specBasicSpecValue">
                  {makeName}
                  <button
                    onClick={addMakeButtonClicked}
                    className="favoriteMakeAddButton"
                  >
                    add to favorite
                  </button>
                </div>
              </div>
              <div className="specBasicSpecItem">
                <div className="specBasicSpecKey">category:</div>
                <div className="specBasicSpecValue">{categoryName}</div>
              </div>
              <div className="specBasicSpecItem">
                <div className="specBasicSpecKey">year:</div>
                <div className="specBasicSpecValue">{yearName}</div>
              </div>
              <div className="specBasicSpecItem">
                <div className="specBasicSpecKeyPrice">price: </div>
                <div className="specBasicSpecValue">{priceName}</div>
              </div>
            </div>
            <div className="specDetailedSpecContainer">
              <div className="specDetailedSpecItem">
                <div className="specDetailedSpecKey">front brakes: </div>
                <div className="specDetailedSpecValue">{frontBrakesName}</div>
              </div>
              <div className="specDetailedSpecItem">
                <div className="specDetailedSpecKey">front suspension:</div>
                <div className="specDetailedSpecValue">
                  {frontSuspensionName}
                </div>
              </div>
              <div className="specDetailedSpecItem">
                <div className="specDetailedSpecKey">rear brakes: </div>
                <div className="specDetailedSpecValue">{rearBrakesName}</div>
              </div>
              <div className="specDetailedSpecItem">
                <div className="specDetailedSpecKeyRearSuspension">
                  rear suspension:{" "}
                </div>
                <div className="specDetailedSpecValue">
                  {rearSuspensionName}
                </div>
              </div>
              <div className="specDetailedFrontBrakes"></div>
              <div className="specDetailedFrontSuspension"></div>
              <div className="specDetailedRearBrakes"></div>
              <div className="specDetailedRearSuspension"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spec;

// <Container className={classes.cardGrid} maxWidth="md">
//   <Grid container spacing={0} alignItems="center" justifyContent="center">
//     <Grid item>
//       <Card className={classes.card}>
//         <CardMedia
//           className={classes.cardMedia}
//           image={imageLink}
//           title="motorCycle"
//         />
//         <CardContent className={classes.cardContent}>
//           <Typography variant="h3">{modelName}</Typography>
//           <Typography variant="h5">make: {makeName}</Typography>
//           <Typography>category: {categoryName}</Typography>
//           <Typography>year: {yearName}</Typography>
//           <Typography>price: {priceName}</Typography>

//           <Typography>put the collapsiable thing here</Typography>
//           <Accordion
//             expanded={expanded === "panel1"}
//             onChange={handleChange("panel1")}
//           >
//             <AccordionSummary
//               expandIcon={<ExpandMore />}
//               aria-controls="panel1bh-content"
//               id="panel1bh-header"
//             >
//               <Typography sx={{ width: "33%", flexShrink: 0 }}>
//                 detailed Specs
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Typography display="block">
//                 front brakes: {frontBrakesName}
//               </Typography>
//             </AccordionDetails>
//             <AccordionDetails>
//               <Typography display="block">
//                 front suspension: {frontSuspensionName}
//               </Typography>
//             </AccordionDetails>
//             <AccordionDetails>
//               <Typography display="block">
//                 rear brakes: {rearBrakesName}
//               </Typography>
//             </AccordionDetails>
//             <AccordionDetails>
//               <Typography display="block">
//                 rear suspension: {rearSuspensionName}
//               </Typography>
//             </AccordionDetails>
//           </Accordion>
//         </CardContent>
//       </Card>
//     </Grid>
//   </Grid>
// </Container>
