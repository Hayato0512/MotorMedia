const mongoose = require("mongoose");
//initiate mongoose here

//create a new schema(Table)
const commentSchema = new mongoose.Schema(
  {
    //all the attributes. type, unique or not, some restrictions.
    userId: {
      type: String,
      require: true,
    },
    postId: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    likes: {
      type: Array,
      default: [],
    },
  },

  { timestamps: true }
);

//this is a model

module.exports = mongoose.model("Comment", commentSchema);
//this is how we export in node.js
