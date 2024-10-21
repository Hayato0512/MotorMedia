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
const questionRoute = require("./routes/questions");
const tagRoute = require("./routes/tags");
const jobRoute = require("./routes/jobs");
const multer = require("multer");
const path = require("path");
var cors = require("cors");
dotenv.config();
const AWS = require("aws-sdk");
const JobApplication = require("./models/JobApplication");

//FOR PACKAGE.JSON
// "heroku-postbuild": "cd client && npm install && npm run build"

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-west-1",
});

//connect to the DB here
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to MongoDB");
  }
);

app.use("/images", express.static(path.join(__dirname, "public/images/")));
app.use(helmet());

app.use(express.json());
// app.use(helmet());
app.use(morgan("common"));
app.use(cors({ origin: "*", credentials: true }));

const awsStorage = multer.memoryStorage();
const awsUpload = multer({ storage: awsStorage });

// Upload route
app.post("/api/aws/upload", awsUpload.single("file"), (req, res) => {
  const file = req.file;
  const uploaderId = req.body.uploaderId; // Assuming the uploader's ID is passed in the request body
  const employerId = req.body.employerId; // Assuming the employer's ID is passed in the request body
  const jobId = req.body.jobId; // Assuming the employer's ID is passed in the request body

  if (file) {
    console.log(
      `index.js, NODE SIDE. api/aws/upload. file ${file}, uploaderId ${uploaderId}, employerId ${employerId}, jobId ${jobId}`
    );
  } else {
    console.log(`index.js, NODE SIDE. api/aws/upload. file is NULL`);
  }

  const s3Key = `${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: "job-application-bucket", // your bucket name
    Key: s3Key, // file name with timestamp
    Body: file.buffer, // file data
    ContentType: file.type, // file type
  };

  // Upload the file to S3
  s3.upload(params, async (err, data) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).send("Error uploading file");
    }

    // File uploaded successfully
    // File uploaded successfully, save metadata to the database
    try {
      const newJobApplication = new JobApplication({
        uploaderId: uploaderId, // User ID who uploaded the file
        employerId: employerId, // Employer ID to whom the file belongs
        jobId: jobId, // The job ID related to this application
        fileName: s3Key, // The file name (timestamp added)
        fileUrl: data.Location, // The S3 file URL
      });

      await newJobApplication.save();
      res.status(200).json({ message: "File uploaded", url: data.Location });
    } catch (e) {
      console.error("Error saving file metadata to the database:", e);
      return res.status(500).send("Error saving file metadata");
    }
  });
});

app.get("/api/aws/files/get", async (req, res) => {
  console.log("Full req.query:", req.query); // Log the entire query object

  const { uploaderId, jobId, employerId } = req.query;

  try {
    console.log(
      `index.js, before find application, uploaderId ${uploaderId}, employerId ${employerId}, jobId ${jobId}`
    );
    const application = await JobApplication.findOne({
      uploaderId: uploaderId,
      employerId: employerId,
      jobId: jobId,
    });
    if (!application) {
      console.log("HEYHEYHEYHEYHEY NO APPLICATION LIKE THAT");
      return res.status(404).send("Job application not found");
    }

    const s3Key = application.fileName; // Assuming fileName is the S3 Key used for storage
    console.log("S3 key is like this ", s3Key);

    // 2. Fetch the file from S3
    const params = {
      Bucket: "job-application-bucket", // your bucket name
      Key: s3Key, // the key you used when uploading the file
    };
    // Stream the file from S3
    s3.getObject(params, (err, data) => {
      if (err) {
        console.error("Error fetching file from S3:", err);
        return res.status(500).send("Error fetching file from S3");
      }

      // Set headers to prompt download or display in browser
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${s3Key}`);
      // Send the file data
      res.send(data.Body);
    });
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).send("Error fetching files");
  }
});

app.get("/api/aws/files/getAll", async (req, res) => {
  const { employerId } = req.query;
  try {
    // 1. get all the job applications whose employerId is req.query.employerId.
    //2. create an array containing all the file names that has been submitted.
    const applications = await JobApplication.find({
      employerId: employerId,
    });

    if (!applications.length) {
      return res
        .status(404)
        .send("No job applications found for this employer.");
    }

    // 2. Extract the filenames from the applications
    const fileNames = applications.map((app) => app.fileName);

    // 3. Fetch all the files from S3
    const filePromises = fileNames.map(async (fileName) => {
      const params = {
        Bucket: "job-application-bucket", // your bucket name
        Key: fileName,
      };
      try {
        const fileData = await s3.getObject(params).promise();
        return {
          fileName,
          fileData: fileData.Body,
        };
      } catch (err) {
        console.error(`Error fetching file ${fileName} from S3:`, err);
        return null; // Return null for failed fetches
      }
    });

    // Resolve all file fetch promises
    const files = await Promise.all(filePromises);

    // Filter out any failed fetches
    const successfulFiles = files.filter((file) => file !== null);

    if (!successfulFiles.length) {
      return res.status(500).send("Failed to fetch files from S3.");
    }
    // 4. Send the files back to the client
    res.setHeader("Content-Type", "application/json");
    res.send(
      successfulFiles.map(({ fileName, fileData }) => ({
        fileName,
        fileContent: fileData.toString("base64"), // Convert buffer to base64 string
      }))
    );
  } catch (error) {
    console.error("Error fetching files:", err);
    res.status(500).send("Error fetching files");
  }
});

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
app.use("/api/questions", questionRoute);
app.use("/api/tags", tagRoute);
app.use("/api/jobs", jobRoute);
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
