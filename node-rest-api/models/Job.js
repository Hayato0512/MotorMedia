const mongoose = require("mongoose");
//initiate mongoose here

//create a new schema(Table)
const jobSchema = new mongoose.Schema(
  {
    //all the attributes. type, unique or not, some restrictions.
    employerId: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      max: 100,
    },
    body: {
      type: String,
      max: 500,
    },
    salary: {
      type: Number,
      default: 0,
    },
    isOpen: {
      type: Boolean,
      require: true,
    },
    tags: {
      type: Array,
      default: [],
    },
  },

  { timestamps: true }
);

jobSchema.index({ title: "text" }); // Create a text index on the title field

//this is a model

module.exports = mongoose.model("Job", jobSchema);
//this is how we export in node.js
