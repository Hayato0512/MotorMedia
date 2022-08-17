const mongoose = require("mongoose");
//initiate mongoose here

//create a new schema(Table)
const UserSchema = new mongoose.Schema(
  {
    //all the attributes. type, unique or not, some restrictions.
    searchId: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: false,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    age: {
      type: Number,
      max: 10,
    },
    motorCyclesOwned: {
      type: Array,
      default: [],
    },
    favoriteMakes: {
      type: Array,
      default: [],
    },
    favoriteMotorCycles: {
      type: Array,
      default: [],
    },
    communities: {
      type: Array,
      default: [],
    },
  },

  { timestamps: true }
);

//this is a model

module.exports = mongoose.model("User", UserSchema);
//this is how we export in node.js
