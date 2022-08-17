const motor = require("../models/OwnedMotor");

const router = require("express").Router();

//get a motor cycle
router.get("/", async (req, res) => {
  const motorId = req.query.motorId;
  try {
    console.log("hey this is from motors.js");
    // const newMotor = new OwnedMotor({
    // motorName:req.body.motorName,
    // owners:req.body.motorName,
    // desc:req.body.desc
    // })
    console.log("req.body.motorName is this ", req.query.motorName); //undefined
    const fetchedMotor = motorId
      ? await motor.findById(motorId)
      : await motor.findOne({
          motorName: req.query.motorName,
        });
    console.log("user is back from findOne. result is ", fetchedMotor);
    //     const newUser = new User({
    // const post = await Post.findById(req.params.id);
    //       : await User.findOne({ username: username });
    res.status(200).json(fetchedMotor);
  } catch (err) {
    console.log("fail to find the motor.so return false");
    console.log(err);
    res.status(500).json(null);
  }
});

//register the motorcycle, and then put the user into the ownerId.
//also, put this bike into users own bike. but, we can do that later.
router.post("/register", async (req, res) => {
  try {
    console.log("hey this is register from motors.js");
    const name = req.body.motorName;
    const desc = req.body.desc;
    const specId = req.body.specId;
    console.log(`hey req.body.motorName is this ${req.body.motorName}`); //why is it undefined??
    console.log(`just got name & desc from req.body=> ${name}`); //undefined
    //nice, the name is coming in.
    //make a new Motorobject with the given name, and then
    const newMotor = new motor({
      motorName: name,
      desc: desc,
      owners: [],
      specId,
    });
    const returnedNewMotor = await newMotor.save();
    // const post = await Post.findById(req.params.id);
    res.status(200).json(returnedNewMotor);
  } catch (err) {
    res.status(500).json(err);
  }
});

//insert user into the owner
router.put("/:motorName/:userId", async (req, res) => {
  try {
    const motorName = req.params.motorName;
    const userId = req.params.userId;
    console.log(
      `I will put user(${userId}) into the array of the bike ${motorName}`
    );
    const fetchedMotor = await motor.findOne({
      motorName: req.params.motorName,
    });
    const motorId = fetchedMotor._id; //i have motorId here
    var motorOwnerArray = fetchedMotor.owners;
    if (motorOwnerArray.includes(userId)) {
      console.log(
        "the user is already in the ownerList of this bike so do nothing"
      );
    } else {
      console.log("the user is not in the list, so ill add it");
      motorOwnerArray.push(`${userId}`);
      const bodyToApply = {
        owners: motorOwnerArray,
      };
      console.log(`type of motorOwnerArray is like this ${motorOwnerArray}`);
      //let's findById and update
      const updatedMotor = await motor.findByIdAndUpdate(motorId, {
        $set: bodyToApply,
      });
      res.status(200).json("suceed to update the motor");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//insert user into the likers
router.put("/:motorName/:userId/like", async (req, res) => {
  try {
    const motorName = req.params.motorName;
    const userId = req.params.userId;
    console.log(
      `I will put user(${userId}) into the array of the bike ${motorName}`
    );
    const fetchedMotor = await motor.findOne({
      motorName: req.params.motorName,
    });
    const motorId = fetchedMotor._id; //i have motorId here
    var motorLikersArray = fetchedMotor.likers;
    if (motorLikersArray.includes(userId)) {
      console.log(
        "the user is already in the likerList of this bike so do nothing"
      );
      res.status(200).json("user is there");
    } else {
      console.log("the user is not in the list, so ill add it");
      motorLikersArray.push(`${userId}`);
      const bodyToApply = {
        likers: motorLikersArray,
      };
      console.log(`type of motorOwnerArray is like this ${motorLikersArray}`);
      //let's findById and update
      const updatedMotor = await motor.findByIdAndUpdate(motorId, {
        $set: bodyToApply,
      });
      res.status(200).json("suceed to update the motor");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// //get a motorcycle
// router.get("/", async (req, res) => {
//   const userId = req.query.userId;
//   console.log("userID is like this. query  ", userId);
//   const username = req.query.username;
//   try {
//     const user = userId
//       ? await User.findById(userId)
//       : await User.findOne({ username: username });
//     const { password, updatedAt, createdAt, ...other } = user._doc;
//     res.status(200).json(other);
//     //instead of sending all the info, choose some important
//   } catch (err) {
//     console.log("it is not wlrking");
//     res.status(500).json(err);
//   }
// });
// router.post("/register", async (req, res) => {
//   try {
//     //generate new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);

//     //create new user
//     const newUser = new User({
//       username: req.body.username,
//       email: req.body.email,
//       password: hashedPassword,
//       // username: "hayato",
//       // email: "hayato@gmail.com",
//       // password: "hayato",
//     });

//     // save user and return response
//     const user = await newUser.save();
//     res.status(200).json(user);
//   } catch (error) {
//     console.log(error);
//   }

//   // await user.save();
//   // res.send("ok")
//   //since it is writing in the database?
// });
module.exports = router;
