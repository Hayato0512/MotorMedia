const User = require("../models/User");

const router = require("express").Router();

// router.get("/", (req, res) => {
//   res.send("hey its user route");
// });

//de;ete a user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    //req.params id means /:id
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      //{$set:req.body} will update all the inputs in here
      res.status(200).json("the account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    //if mismatch id or not admin, user cannot update anything
    return res.status(403).json("You can only delete your account");
  }
});
//update a user
router.put("/:id", async (req, res) => {
  console.log("/:id: aa, req.params.id is like this", req.params.id);
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    console.log("YESYESYESYSEYSYESYE");
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
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      console.log("after findBYIDANDUPDATEW");

      //{$set:req.body} will update all the inputs in here
      res.status(200).json("the account has been updated");
    } catch (err) {
      console.log("this findByIdAndUpdate not working");
      return res.status(500).json(err);
    }
    // } else {
    //   //if mismatch id or not admin, user cannot update anything
    //   return res.status(403).json("You can only update your account");
    // }
  }
});
//get a user

//maybe create one more get real quick, and then ya.
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  console.log("userID is like this. query  ", userId);
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, createdAt, ...other } = user._doc;
    res.status(200).json(other);
    //instead of sending all the info, choose some important
  } catch (err) {
    console.log("it is not wlrking");
    res.status(500).json(err);
  }
});
//get user by their email
router.get("/email/:email", async (req, res) => {
  const userEmail = req.params.email;
  console.log("userEmail is like this. query  ", userEmail);
  // const username = req.query.username;
  try {
    const user = await User.findOne({ email: userEmail });
    const { updatedAt, createdAt, ...other } = user._doc;
    res.status(200).json(other);
    //instead of sending all the info, choose some important
  } catch (err) {
    console.log("it is not wlrking");
    res.status(500).json(err);
  }
});
//get user by their searchId
router.get("/searchId/:searchId", async (req, res) => {
  const userSearchId = req.params.searchId;
  console.log("userEmail is like this. query  ", userSearchId);
  // const username = req.query.username;
  try {
    const user = await User.findOne({ searchId: userSearchId });
    const { updatedAt, createdAt, ...other } = user._doc;
    res.status(200).json(other);
    //instead of sending all the info, choose some important
  } catch (err) {
    console.log("it is not wlrking");
    res.status(500).json(err);
  }
});
//get all the users
// router.get("/allUsers", async (req, res) => {
//   // const userId = req.query.userId;
//   // console.log("userID is like this. query  ", userId);
//   // const username = req.query.username;
//   // await User.getUsers();
//   try {
//     // const user = userId
//       // ? // ? await User.findById(userId)
//         await User.getUsers()
//       : await User.findOne({ username: username });
//     const { password, updatedAt, createdAt, ...other } = user._doc;
//     res.status(200).json(other);
//     //instead of sending all the info, choose some important
//   } catch (err) {
//     console.log("it is not wlrking");
//     res.status(500).json(err);
//   }
// });
//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    console.log(`WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW2`);
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

//follow auser
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    //this means, we put someone we want to follow in body, and someone who wants to follow the person goes parameter.
    try {
      //find the user, and put that user into the follow array of the param user.
      const currentUser = await User.findById(req.body.userId);
      console.log("find akiko");
      const user = await User.findById(req.params.id);
      console.log("find hayato too");
      console.log("user is like this", user);
      if (!user.followers.includes(req.body.userId)) {
        console.log("this shoudl be visible");
        //if user dont have currentUser as followers, then
        //wait, user is the one who gets followed. currentUser is trying to follow user.
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user added to the followers");
      } else {
        res.status(403).json("you already have it as follower");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself man.");
  }
});
//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    //this means, we put someone we want to follow in body, and someone who wants to follow the person goes parameter.
    try {
      //find the user, and put that user into the follow array of the param user.
      const currentUser = await User.findById(req.body.userId);
      const user = await User.findById(req.params.id);
      if (user.followers.includes(req.body.userId)) {
        //if currentUser is following user, then
        //remove currentUSer from user's followers list, and remove user from currentUser's following list
        //wait, user is the one who gets unfollowed. currentUser is trying to unfollow user.
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } }); //this is jh
        res.status(200).json("user removed from the followers");
      } else {
        res.status(403).json("you don't have it as follower");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself man.");
  }
});

module.exports = router;
