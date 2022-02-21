const express = require("express");
const { authJwt } = require("../middlewares");
var router = express.Router();
const db = require("../models");
const Post = db.post;

router.post("/myPosts/create", [authJwt.verifyToken], (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    author: req.userId,
  });
  post.save((err, post) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (post) {
      console.log(post);
      return res.status(200).send({ message: "Article posted Successfully!" });
    }
  });
});

router.get("/myPosts/:postId", [authJwt.verifyToken], (req, res) => {
  Post.findById(req.params.postId).then((post) => {
    return res.status(200).json(post);
  });
});

router.put("/myPosts/:postId", [authJwt.verifyToken], (req, res) => {
  Post.findByIdAndUpdate(
    req.params.postId,
    { $set: req.body },
    { new: true }
  ).then((post) => {
    console.log(post);
    return res.status(200).json(post);
  });
});

router.delete("/myPosts/:postId", [authJwt.verifyToken], (req, res) => {
  Post.findByIdAndRemove(req.params.postId).then((post) => {
    return res.status(200).json(post);
  });
});

router.get("/myPosts", [authJwt.verifyToken], (req, res) => {
  Post.find({ author: req.userId }).then((posts) => {
    console.log(posts);
    return res.status(200).json(posts);
  });
});
module.exports = router;
