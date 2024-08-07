const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

//create a new conversation
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.recieverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(200).json(error);
  }
});

//get conv of a user
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get conv includes two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(null);
  }
});

//delete conversation
router.delete("/:conversationId", async (req, res) => {
  //first, delete specified conversation from the Conversation schema
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    await conversation.deleteOne();

    //Second, delete all the messages from message schema whose conversation Id is the deleted one
    try {
      await Message.deleteMany({ conversationId: req.params.conversationId });
      res
        .status(200)
        .json("The conversation and its messages have been deleted");
    } catch (error) {
      res
        .status(500)
        .json("Failed to delete the messages associated with the conversation");
    }
  } catch (error) {
    res.status(500).json("Failed to delete the conversation");
  }
});
module.exports = router;
