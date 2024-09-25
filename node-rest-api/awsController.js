const AWS = require("aws-sdk");

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // store in environment variable
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // store in environment variable
  region: "us-west-1", // e.g., 'us-west-1'
});

// Create an S3 instance
const s3 = new AWS.S3();
