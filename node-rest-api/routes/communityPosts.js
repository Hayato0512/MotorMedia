const router = require("express").Router();
const CommunityPost = require("../models/CommunityPost");
const Community = require("../models/Community");
const User = require("../models/User");
// router.get("/",(req,res)=>{

//     console.log("post page")
// })
// we just used it to check if it is connected or not

//create a post

router.post("/", async (req, res) => {
  const newPost = CommunityPost(req.body); //what does this post() do??
  //I see get the request, and make a new post object with data, and assign it to a variable
  try {
    console.log("let's post");
    const savedPost = await newPost.save();
    //this will save newPost in the post dataBase.
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    //find a post that has the userID. what if the user has multile?
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been posted");
    } else {
      res.status(403).json("userID mis match.you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post
router.delete("/:id/:id2", async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    //find a post that has the userID. what if the user has multile?
    if (post.userId === req.params.id2) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("userID mis match.you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    //find a post that has the userID. what if the user has multile?
    if (!post.likes.includes(req.body.userId)) {
      //if body user hasn't liked it yet,
      await post.updateOne({ $push: { likes: req.body.userId } }); //push
      //the post now has the user in like list.
      res.status(200).json("the post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } }); //pull
      res.status(403).json("the post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
// // get all the post of the user
// router.get("/timeline/:userId", async (req, res) => {
//   try {
//     console.log("hey ii /timeline/:userId");
//     console.log(" hey this is reqparamuserID" + req.params.userId);
//     const currentUser = await User.findById(req.params.userId);
//     console.log("currentUser is liket this", currentUser);
//     //this thing is throwing err. why??
//     console.log("hey2");

//     const userPosts = await communityPost.find({ userId: currentUser._id });
//     const friendPosts = await Promise.all(
//       currentUser.followings.map((friendId) => {
//         return communityPost.find({ userId: friendId });
//       })
//     );
//     res.json(userPosts.concat(...friendPosts));
//   } catch (err) {
//     res.status(500).json(err);
//     console.log(err);
//     console.log("are?");
//   }
// });

//get user's all posts
router.get("/community/:communityName", async (req, res) => {
  try {
    console.log("now /community/:communityName");
    const community = await Community.findOne({
      communityName: req.params.communityName,
    });
    console.log("hey in communityPost.js. community is this", community);
    const posts = await CommunityPost.find({ communityId: community._id });
    console.log("hey in communityPost.js. posts is this", posts);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
    console.log("are?");
  }
});
module.exports = router;
