const mongoose = require("mongoose");
//initiate mongoose here

//create a new schema(Table)
const CommunitySchema = new mongoose.Schema(
  {
    //all the attributes. type, unique or not, some restrictions.
    communityName: {
      type: String,
      require: true,
    },
    numberOfPeople: {
      type: Number,
      default: 0,
    },
    coverPicture: {
      type: String,
      default: "",
    },
    leaderId: {
      type: String,
      default: "",
    },
    members: {
      type: Array,
      default: [],
    },
    desc: {
      type: String,
      max: 500,
    },
    posts: {
      type: Array,
      default: [],
    },
  },

  { timestamps: true }
);

//this is a model

module.exports = mongoose.model("Community", CommunitySchema);
//this is how we export in node.js
