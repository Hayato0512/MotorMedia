const router = require("express").Router();
const Question = require("../models/Question");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// we just used it to check if it is connected or not

//create a question
router.post("/", async (req, res) => {
  const newQuestion = Question(req.body); //what does this post() do??
  //I see get the request, and make a new post object with data, and assign it to a variable
  try {
    console.log("let's post");
    const savedQuestion = await newQuestion.save();
    //this will save newPost in the post dataBase.
    res.status(200).json(savedQuestion);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a comment
router.put("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    //find a post that has the userID. what if the user has multile?
    if (question.userId === req.body.userId) {
      await question.updateOne({ $set: req.body });
      res.status(200).json("the question has been posted");
    } else {
      res
        .status(403)
        .json("userID doesn't match. you can only update your own questions");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a question
router.delete("/:questionId/:userId", async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    //find a post that has the userID. what if the user has multile?
    if (question.userId === req.params.userId) {
      await comment.deleteOne();
      res.status(200).json("the question has been deleted");
    } else {
      res
        .status(403)
        .json("userID mis match.you can only delete your own questions");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// //like a post
// router.put("/:id/like", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     //find a post that has the userID. what if the user has multile?
//     console.log(`when like, req.body.userId is ${req.body.userId}`);
//     if (!post.likes.includes(req.body.userId)) {
//       //if body user hasn't liked it yet,
//       await post.updateOne({ $push: { likes: req.body.userId } }); //push
//       //the post now has the user in like list.
//       res.status(200).json("the post has been liked");
//     } else {
//       await post.updateOne({ $pull: { likes: req.body.userId } }); //pull
//       res.status(403).json("the post has been disliked");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//get a question
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all the questions of the user
router.get("/allQuestions/:userId", async (req, res) => {
  try {
    console.log(" hey this is the userId " + req.params.userId);
    const allQuestionsOfTheUser = await Question.find({
      userId: req.params.userId,
    });
    res.json(allQuestionsOfTheUser);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
    console.log("are?");
  }
});

// get all the questions of the user
router.post(
  "/tags",
  body("tags").isArray().withMessage("Tags should be an array."),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tags = req.body.tags;
      // tags = tags.flat();
      console.log("Tags to search:", tags);

      //Ensure the tags is array
      if (!Array.isArray(tags)) {
        return res.status(400).json({ message: "Tags should be an array" });
      }
      const allQuestionsWithTags = await Question.find({
        tags: { $all: tags },
      });

      console.log("allQuestionsWithTags", allQuestionsWithTags);
      res.json(allQuestionsWithTags);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  }
);

router.get("/feed/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the current user with followers
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the userId array to include the current user's ID and the IDs of the users they follow
    const userIdsToQuery = [userId, ...currentUser.followings];

    // Fetch questions where the userId is in the array
    const allQuestionsOfTheUser = await Question.find({
      userId: { $in: userIdsToQuery },
    });

    res.json(allQuestionsOfTheUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//upvote a question
router.put("/:id/upvote", async (req, res) => {
  try {
    //if id not in upvote array, , add it to the array,
    const question = await Question.findById(req.params.id);

    if (!question.upvotes.includes(req.body.userId)) {
      await question.updateOne({ $push: { upvotes: req.body.userId } }); //push
      //and check if the id exist in downvote, if so, remove it.
      if (question.downvotes.includes(req.body.userId)) {
        await question.updateOne({ $pull: { downvotes: req.body.userId } });
      }

      res.status(200).json("the question has been upvoted");
    } else {
      // if id already in the array, remove it.
      await question.updateOne({ $pull: { upvotes: req.body.userId } }); //pull
      res.status(403).json("the question has been unvoted");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//downvote a question
router.put("/:id/downvote", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    //if id not in downvote array, add it to the array,
    if (!question.downvotes.includes(req.body.userId)) {
      await question.updateOne({ $push: { downvotes: req.body.userId } }); //push
      //and check if the id exist in upvote, if so, remove it
      if (question.upvotes.includes(req.body.userId)) {
        await question.updateOne({ $pull: { upvotes: req.body.userId } });
      }

      res.status(200).json("the question has been downvoted");
    } else {
      //if id already in the array, remove it.
      await question.updateOne({ $pull: { downvotes: req.body.userId } }); //pull
      res.status(403).json("the question has been unvoted");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
