const mongoose = require("mongoose");
//initiate mongoose here

//create a new schema(Table)
const OwnedMotorSchema = new mongoose.Schema(
  {
    //all the attributes. type, unique or not, some restrictions.
    motorName: {
      type: String,
      require: true,
    },
    specId: {
      type: String,
      require: true,
    },
    owners: {
      type: Array,
      default: [],
    },
    likers: {
      type: Array,
      default: [],
    },
    desc: {
      type: String,
      max: 500,
    },
  },

  { timestamps: true }
);

//this is a model

module.exports = mongoose.model("OwnedMotor", OwnedMotorSchema);
//this is how we export in node.js
