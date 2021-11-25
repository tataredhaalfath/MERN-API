const express = require("express");
const app = express();
const blogController = require("../controllers/blog");
const { body } = require("express-validator");

//[POST] : /v1/blog/post
app
  .route("/posts")
  .get(blogController.index)
  .post(
    [
      body("title")
        .isLength({ min: 5 })
        .withMessage("input title min 5 karakter"),
      body("body")
        .isLength({ min: 5 })
        .withMessage("input body minimal 5 karakter"),
    ],
    blogController.create
  );
app
  .route("/posts/:id")
  .get(blogController.getById)
  .put(
    [
      body("title")
        .isLength({ min: 5 })
        .withMessage("input title min 5 karakter"),
      body("body")
        .isLength({ min: 5 })
        .withMessage("input body minimal 5 karakter"),
    ],
    blogController.update
  )
  .delete(blogController.delete);
module.exports = app;
