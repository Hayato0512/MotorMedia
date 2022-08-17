const mongoose = require("mongoose");
//initiate mongoose here

//create a new schema(Table)
const communityPostSchema = new mongoose.Schema(
  {
    //all the attributes. type, unique or not, some restrictions.
    communityId: {
      type: String,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },

  { timestamps: true }
);

//this is a model

module.exports = mongoose.model("communityPost", communityPostSchema);
//this is how we export in node.js
