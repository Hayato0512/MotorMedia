const router = require("express").Router();
const Comment = require("../models/Comment");
const User = require("../models/User");
// router.get("/",(req,res)=>{

//     console.log("post page")
// })
// we just used it to check if it is connected or not

//create a comment
router.post("/", async (req, res) => {
  const newComment = Comment(req.body); //what does this post() do??
  //I see get the request, and make a new post object with data, and assign it to a variable
  try {
    console.log("let's post");
    const savedComment = await newComment.save();
    //this will save newPost in the post dataBase.
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a comment

router.put("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    //find a post that has the userID. what if the user has multile?
    if (comment.userId === req.body.userId) {
      await comment.updateOne({ $set: req.body });
      res.status(200).json("the post has been posted");
    } else {
      res.status(403).json("userID mis match.you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a comment
router.delete("/:commentId/:userId", async (req, res) => {
  try {
    console.log("hello this is delete in posts.js");
    const comment = await Comment.findById(req.params.commentId);
    //find a post that has the userID. what if the user has multile?
    if (comment.userId === req.params.userId) {
      console.log("hello3 this is delete in posts.js");
      await comment.deleteOne();
      res.status(200).json("the comment has been deleted");
    } else {
      res.status(403).json("userID mis match.you can delete only your comment");
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

//get a post
router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get all the comment of the post
router.get("/allComments/:postId", async (req, res) => {
  console.log(`hey this is "/allComments/:postId"`);
  try {
    console.log(" hey this is reqparamuserID" + req.params.postId);
    const allCommentsOfThePost = await Comment.find({
      postId: req.params.postId,
    });
    res.json(allCommentsOfThePost);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
    console.log("are?");
  }
});

// //get user's all posts
// router.get("/profile/:username", async (req, res) => {
//   try {
//     console.log("now /profile/:username");
//     const user = await User.findOne({ username: req.params.username });
//     const posts = await Post.find({ userId: user._id });
//     res.status(200).json(posts);
//   } catch (err) {
//     res.status(500).json(err);
//     console.log(err);
//     console.log("are?");
//   }
// });
module.exports = router;
