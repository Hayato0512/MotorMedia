const mongoose = require("mongoose");
//initiate mongoose here

//create a new schema(Table)
const ConversationSchema = new mongoose.Schema(
  {
    //all the attributes. type, unique or not, some restrictions.
    members: {
      type: Array,
    },
  },

  { timestamps: true }
);

//this is a model

module.exports = mongoose.model("Conversation", ConversationSchema);
//this is how we export in node.js
