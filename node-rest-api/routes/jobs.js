const Job = require("../models/Job");
const router = require("express").Router();
const { body, validationResult } = require("express-validator");

router.post(
  "/create",
  [
    body("employerId")
      .isString()
      .notEmpty()
      .withMessage("Employer ID is required."),
    body("title")
      .isString()
      .isLength({ max: 100 })
      .withMessage("Title must be less than 100 characters."),
    body("body")
      .isString()
      .isLength({ max: 500 })
      .withMessage("Body must be less than 500 characters."),
    body("salary")
      .optional()
      .isNumeric()
      .withMessage("Salary must be a number."),
    body("isOpen").isBoolean().withMessage("isOpen must be a boolean value."),
    body("tags").isArray().withMessage("Tags should be an array."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const job = Job(req.body);

      const savedJob = await job.save();

      res.json(savedJob);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

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

module.exports = router;
