const Tag = require("../models/Tag");

const router = require("express").Router();

router.get("/feed2", async (req, res) => {
  console.log("feed2 here letxs go working");
});

router.get("/suggest", async (req, res) => {
  try {
    const userInput = req.query.search; // e.g., 'h'

    if (!userInput) {
      // nice, always add this kind of extra error check
      return res.status(400).json({ message: "Input is required" });
    }

    const matchingTags = await Tag.find({
      name: { $regex: `^${userInput}`, $options: "i" }, // Case-insensitive prefix search
    }).limit(10); // Limit the results to 10 suggestions for performance
    //regex provides regular expression capabilities for pattern matching strings in queries.
    // option i means case insensitive
    //limit to 10 to improve performance

    res.json(matchingTags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
