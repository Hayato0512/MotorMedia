const mongoose = require("mongoose");
//initiate mongoose here

//create a new schema(Table)
const questionSchema = new mongoose.Schema(
  {
    //all the attributes. type, unique or not, some restrictions.
    userId: {
      type: String,
      require: true,
    },
    questionId: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      max: 100,
    },
    desc: {
      type: String,
      max: 500,
    },
    upvotes: {
      type: Array,
      default: [],
    },
    downvotes: {
      type: Array,
      default: [],
    },
    isResolved: {
      type: Boolean,
      require: true,
    },
  },

  { timestamps: true }
);

//this is a model

module.exports = mongoose.model("Comment", commentSchema);
//this is how we export in node.js
