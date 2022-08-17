const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      searchId: req.body.searchId,
      email: req.body.email,
      password: hashedPassword,
      // username: "hayato",
      // email: "hayato@gmail.com",
      // password: "hayato",
    });

    // save user and return response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }

  // await user.save();
  // res.send("ok")
  //since it is writing in the database?
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("tag6");
    const user = await User.findOne({ email: req.body.email });
    //this one right here is the problem. why? this one is not working if outside of my room
    console.log("tag6");
    !user && res.status(404).send("user not found");
    console.log("tag6");

    console.log(`Login, come on`);
    console.log(`req.body.password is ${req.body.password}`);
    console.log(`user.password is ${user.password}`);
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(`validPassword is ${validPassword}`);
    console.log("tag6");
    if (validPassword) {
      res.status(200).json(user);
    } else {
      res.status(500).json(`password is inccorrect`);
    }
    // !validPassword && res.status(400).send("password doesn't match");

    console.log("tag6");
  } catch (err) {
    console.log("tag1");
    console.log("tag6");
    console.log(err);
    res.status(500).json(err);
  }
});

// router.get("/", (req,res)=>{

//     res.send("hey its auth route")
// } )
module.exports = router;
