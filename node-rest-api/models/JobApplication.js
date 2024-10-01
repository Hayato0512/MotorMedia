const mongoose = require("mongoose");

const jobApplication = new mongoose.Schema({
  uploaderId: String, // The ID of the user uploading the file
  employerId: String, // The ID of the employer for whom the file is uploaded
  jobId: String,
  fileName: String, // The file name as stored in S3
  fileUrl: String, // The S3 URL of the file
  uploadDate: { type: Date, default: Date.now }, // When the file was uploaded
});

const JobApplication = mongoose.model("JobApplication", jobApplication);

module.exports = JobApplication;
