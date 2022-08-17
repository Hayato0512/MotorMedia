const express = require("express");

const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const auth = require("./routes/auth");
const postRoute = require("./routes/posts");
const motorRoute = require("./routes/motors");
const communityRoute = require("./routes/communities");
const communityPostRoute = require("./routes/communityPosts");
const conversationPostRoute = require("./routes/conversations");
const messagePostRoute = require("./routes/messages");
const commentRoute = require("./routes/comments");
const multer = require("multer");
const path = require("path");
var cors = require("cors");
dotenv.config();
//FOR PACKAGE.JSON
// "heroku-postbuild": "cd client && npm install && npm run build"

//connect to the DB here
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to MongoDB");
  }
);

app.use("/images", express.static(path.join(__dirname, "public/images/")));

app.use(express.json());
// app.use(helmet());
app.use(morgan("common"));
app.use(cors({ origin: true, credentials: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.path == "/api/upload") {
      console.log("yes the path is /api/upload");
      cb(null, "public/images/posts/");
    }
    if (req.path == "/api/upload/profile") {
      console.log("yes the path is /api/upload/profile");
      cb(null, "public/images/person/");
    }
    if (req.path == "/api/upload/community") {
      console.log("yes the path is /api/upload/community");
      cb(null, "public/images/communityPosts/");
    }
    console.log(
      "req.path is like this",
      req.path,
      "ARUUUUUERWERERWEREWRWERERR"
    );
    // cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log(
      "req.body.name is like this SHARE POST PHOTO REQUEST",
      req.body.name
    );
    console.log(
      "file.originalname is like this SHARE PROFILE PIC REQUEST",
      file.originalname
    );
    cb(null, file.originalname);
  },
});

//upload post from share
const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    console.log("UPLOADING FROM SHARE, req looks like this", req.body);
    console.log("file uploaded nicely EEEEHHHEHHEHHEHHHEHEHEEE");
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.log("error is catched in /api/upload.");
    console.log(error);
  }
});
///upload profile picture
const upload2 = multer({ storage });
app.post("/api/upload/profile", upload2.single("file"), (req, res) => {
  try {
    console.log("UPLOADING FROM SETTING, req looks like this", req.body);
    console.log("profile file uploaded nicely HAHAHAHHAHAHAHAHAHAHAHAHHHHHH");
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.log("error is catched in /api/upload.");
    console.log(error);
  }
});
///upload community post picture
const upload3 = multer({ storage });
app.post("/api/upload/community", upload3.single("file"), (req, res) => {
  try {
    console.log("UPLOADING FROM SETTING, req looks like this", req.body);
    console.log(
      "communityFile picture file uploaded nicely HAHAHAHHAHAHAHAHAHAHAHAHHHHHH"
    );
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.log("error is catched in /api/upload.");
    console.log(error);
  }
});
//get all the users
app.get("/api/allusers", (req, res) => {
  try {
    console.log("debug: I will try to get all the users");
    // console.log("file uploaded nicely");
    // const users = mongoose.getUsers()
    // console.log("debug: users from mongoose is like this", users);
    return res.status(200).json(" will return users here");
  } catch (error) {
    console.log("error is catched in /api/upload.");
    console.log(error);
  }
});
//set some routes in here
app.use("/api/users", userRoute);
app.use("/api/auth", auth);
app.use("/api/posts", postRoute);
app.use("/api/motors", motorRoute);
app.use("/api/communities", communityRoute);
app.use("/api/communityPosts", communityPostRoute);
app.use("/api/conversations", conversationPostRoute);
app.use("/api/messages", messagePostRoute);
app.use("/api/comments", commentRoute);
// app.get("/", (req, res) => {
//   res.send("welcome to Home");
// });
// app.get("/users",(req, res)=>{
//     res.send("welcome to Users");
// } )

// app.use(express.static(path.join(__dirname, "/client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/client/build/", "index.html"));
// });

//add lister??
app.listen(process.env.PORT || 8800, () => {
  console.log("Backend server is runningaaaaa ~!!!!");
});

//just in case you need it in package.json
// "server": "nodemon index.js --ignore react-social"
