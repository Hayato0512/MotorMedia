const mongoose = require("mongoose");
//initiate mongoose here

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true, //remove white space
  },
});

tagSchema.index({ name: 1 });

const Tag = mongoose.model("Tag", tagSchema);
//export this
module.exports = Tag;
