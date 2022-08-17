const community = require("../models/Community");

const router = require("express").Router();

//get a community
router.get("/", async (req, res) => {
  const communityId = req.query.communityId;
  console.log("communityId is like this. query  ", communityId);
  const communityName = req.query.communityName;
  try {
    console.log(
      "before the communityFindById, since communityId",
      communityId,
      " , so findById"
    );
    const community3 = communityId
      ? await community.findById(communityId)
      : await community.findOne({ communityName: communityName });
    // const { password, updatedAt, createdAt, ...other } = user._doc;
    console.log(
      "after the communityFindById, since communityId",
      communityId,
      " , so findById"
    );
    res.status(200).json(community3);
    //instead of sending all the info, choose some important
  } catch (err) {
    console.log("it is not wlrking");
    res.status(500).json(err);
  }
});

//register the motorcycle, and then put the user into the ownerId.
//also, put this bike into users own bike. but, we can do that later.
router.post("/register", async (req, res) => {
  try {
    console.log("hey this is register from community.js");
    const name = req.body.name;
    const leaderId = req.body.leaderId;
    const members = req.body.members;
    console.log(`just got name & desc from req.body=> ${name}`); //undefined
    //nice, the name is coming in.
    //make a new Motorobject with the given name, and then
    //  ADD SOME LATER HERE
    const newCommunity = new community({
      communityName: name,
      leaderId: leaderId,
      members: members,
    });
    const returnedNewCommunity = await newCommunity.save();
    console.log("congrats!! new Community has been created.");
    // const post = await Post.findById(req.params.id);
    res.status(200).json(returnedNewCommunity);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update the community
router.put("/:id/update", async (req, res) => {
  console.log("/:id: aa, req.params.id is like this", req.params.id);
  console.log("ARE YOU READYYYYYY", req.params.id);
  //req.params id means /:id
  // if (req.body.password) {
  //   console.log("yes, req.body.password is there.");
  //   //if user try to update their password,
  //   try {
  //     console.log("debug:salt hasn't been made");
  //     const salt = await bcrypt.genSalt(10);
  //     req.body.password = await bcrypt.hash(req.body.password, salt);
  //     //so here if the user request password is not null, which means user is trying to update the passowrd
  //     //so, take that new password, and hash the pass, and then set it in mongo db
  //   } catch (err) {
  //     console.log("debug: something is wrong with bcrypt");
  //     return res.status(500).json(err);
  //   }
  // }
  try {
    console.log("before findBYIDANDUPDATEW");
    const returnedCommunity = await community.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    console.log("after findBYIDANDUPDATEW");

    //{$set:req.body} will update all the inputs in here
    res.status(200).json("the community has been updated");
  } catch (err) {
    console.log("this findByIdAndUpdate not working");
    return res.status(500).json(err);
  }
  // } else {
  //   //if mismatch id or not admin, user cannot update anything
  //   return res.status(403).json("You can only update your account");
  // }
});

//delete the community
router.delete("/:communityId/:leaderId", async (req, res) => {
  try {
    console.log("hello this is delete in community.js");
    const community1 = await community.findById(req.params.communityId);
    console.log("community.leaderIdis", community1.leaderId);
    console.log("hello2 this is delete in communityh.js");
    //find a post that has the userID. what if the user has multile?
    if (community1.leaderId === req.params.leaderId) {
      console.log("hello3 this is delete in posts.js");
      await community1.deleteOne();
      res.status(200).json("the community has been deleted");
    } else {
      res.status(403).json("userID mis match.you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// //insert user into the owner
// router.put("/:motorName/:userId", async (req, res) => {
//   try {
//     const motorName = req.params.motorName;
//     const userId = req.params.userId;
//     console.log(
//       `I will put user(${userId}) into the array of the bike ${motorName}`
//     );
//     const fetchedMotor = await motor.findOne({
//       motorName: req.params.motorName,
//     });
//     const motorId = fetchedMotor._id; //i have motorId here
//     var motorOwnerArray = fetchedMotor.owners;
//     if (motorOwnerArray.includes(userId)) {
//       console.log(
//         "the user is already in the ownerList of this bike so do nothing"
//       );
//     } else {
//       console.log("the user is not in the list, so ill add it");
//       motorOwnerArray.push(`${userId}`);
//       const bodyToApply = {
//         owners: motorOwnerArray,
//       };
//       console.log(`type of motorOwnerArray is like this ${motorOwnerArray}`);
//       //let's findById and update
//       const updatedMotor = await motor.findByIdAndUpdate(motorId, {
//         $set: bodyToApply,
//       });
//       res.status(200).json("suceed to update the motor");
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
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
