const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");
const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const s3 = require("../s3Config"); // Adjust the path as needed based on your folder structure

router.post(
  "/create",
  [
    body("employerId")
      .isString()
      .notEmpty()
      .withMessage("Employer ID is required."),
    body("title")
      .isString()
      .isLength({ max: 100 })
      .withMessage("Title must be less than 100 characters."),
    body("body")
      .isString()
      .isLength({ max: 500 })
      .withMessage("Body must be less than 500 characters."),
    body("salary")
      .optional()
      .isNumeric()
      .withMessage("Salary must be a number."),
    body("isOpen").isBoolean().withMessage("isOpen must be a boolean value."),
    body("tags").isArray().withMessage("Tags should be an array."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const job = Job(req.body);

      const savedJob = await job.save();

      res.json(savedJob);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.post(
  "/tags",
  body("tags").isArray().withMessage("Tags should be an array."),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tags = req.body.tags;
      // tags = tags.flat();
      console.log("Tags to search:", tags);

      //Ensure the tags is array
      if (!Array.isArray(tags)) {
        return res.status(400).json({ message: "Tags should be an array" });
      }
      const allQuestionsWithTags = await Question.find({
        tags: { $all: tags },
      });

      console.log("allQuestionsWithTags", allQuestionsWithTags);
      res.json(allQuestionsWithTags);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  }
);

router.get("/alljobs", async (req, res) => {
  try {
    // Fetch jobs and limit the result to 30
    const jobs = await Job.find().limit(30);

    // Send the jobs in the response
    res.status(200).json(jobs);
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).json({ message: "Server error while fetching jobs." });
  }
});

router.delete("/application/delete", async (req, res) => {
  const { fileName, jobId, userId } = req.query; //fileName undefined
  console.log("S3 instance:", s3); // Check if this prints an object with S3 functions
  console.log("FILENAME:", fileName, jobId, userId); // Check if this prints an object with S3 functions

  try {
    const params = {
      Bucket: "job-application-bucket", // your S3 bucket name
      Key: fileName, // the S3 key to delete
    };
    // Delete the file from S3
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error("Error deleting file from S3:", err);
        return res.status(500).send("Error deleting file from S3");
      }
      console.log("File successfully deleted from S3:", data);
      console.log("SO LET's delete the METADATA as well", data);
      // res.status(200).send("Job application and file deleted successfully");
    });
    const result = await JobApplication.findOneAndDelete({
      jobId: jobId,
      userId: userId,
      fileName: fileName,
    });
    console.log("jobs.js: /application/delete: deletion successful");
    //here, bring s3 into this file, and then complete deletion on AWS S3 as well.
    // Set up parameters for the S3 delete operation
    res.status(200).json({ message: "deletion successful." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching jobs." });
  }
});

router.get("/application/getone", async (req, res) => {
  const { uploaderId, jobId, employerId } = req.query;

  try {
    console.log("OK LETS FIND AN APPLICATION FOR YA");
    // Fetch jobs and limit the result to 30
    const jobApplication = await JobApplication.findOne({
      uploaderId: uploaderId,
      jobId: jobId,
      employerId: employerId,
    });

    // Send the jobs in the response
    res.status(200).json(jobApplication);
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).json({ message: "Server error while fetching jobs." });
  }
});

router.get(
  "/jobapplications/employer/alljobpostings/:employerId",
  async (req, res) => {
    try {
      const employerId = req.params.employerId;
      // Fetch jobs and limit the result to 30
      console.log("Jobs: EmployerId is ", employerId);
      const jobApplications = await JobApplication.find({
        employerId: employerId,
      });

      // Send the jobs in the response
      res.status(200).json(jobApplications);
    } catch (err) {
      // Handle any errors
      console.error(err);
      res.status(500).json({ message: "Server error while fetching jobs." });
    }
  }
);

router.get("/title/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    // Fetch jobs and limit the result to 30
    console.log("JOB ID ", jobId);
    const job = await Job.find({
      _id: jobId,
    });

    console.log("JOB TITLE ", job[0].title);
    // Send the jobs in the response
    res.status(200).json(job[0].title);
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).json({ message: "Server error while fetching jobs." });
  }
});
router.post(
  "/tags",
  body("tags").isArray().withMessage("Tags should be an array."),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tags = req.body.tags;

      //Ensure the tags is array
      if (!Array.isArray(tags)) {
        return res.status(400).json({ message: "Tags should be an array" });
      }
      const allJobsWithTags = await Job.find({
        tags: { $all: tags },
      });

      console.log("allJobsWithTags", allJobsWithTags);
      res.json(allJobsWithTags);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  }
);

router.get("/suggest", async (req, res) => {
  try {
    const userInput = req.query.search;
    if (!userInput) {
      return res.status(400).json({ message: "INVALID INPUT" });
    }
    const escapeRegex = (input) => {
      return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
    };
    const safeInput = escapeRegex(userInput);
    const matchingJobs = await Job.find({
      title: { $regex: safeInput, $options: "i" },
    }).limit(20);
    res.json(matchingJobs);
  } catch (error) {
    res.status(400).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
