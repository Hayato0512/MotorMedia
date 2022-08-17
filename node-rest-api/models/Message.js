const mongoose = require("mongoose");
//initiate mongoose here

//create a new schema(Table)
const MessageSchema = new mongoose.Schema(
  {
    //all the attributes. type, unique or not, some restrictions.
    conversationId: {
      type: String,
      require: true,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },

  { timestamps: true }
);

//this is a model

module.exports = mongoose.model("Message", MessageSchema);
//this is how we export in node.js
