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
      return res.status(500).json({ message: err });
    }
    if (post) {
      console.log(post);
      return res
        .status(200)
        .send([post, { message: "Article posted Successfully!" }]);
    }
  });
});

router.get("/myPosts", [authJwt.verifyToken], (req, res) => {
  Post.find({ author: req.userId }).then((posts) => {
    console.log(posts);
    return res.status(200).json(posts);
  });
});

router
  .route("/myPosts/:postId")
  .get([authJwt.verifyToken], (req, res, next) => {
    Post.findById(req.params.postId)
      .then(
        (post) => {
          return res.status(200).json(post);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put([authJwt.verifyToken], (req, res, next) => {
    Post.findByIdAndUpdate(req.params.postId, { $set: req.body }, { new: true })
      .then(
        (post) => {
          console.log(post);
          return res
            .status(200)
            .send([post, { message: "Updated Successfully!" }]);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete([authJwt.verifyToken], (req, res, next) => {
    Post.findByIdAndRemove(req.params.postId)
      .then(
        (post) => {
          return res
            .status(200)
            .send([post, { message: "Deleted Successfully!" }]);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

router
  .route("/myPosts/:postId/like")
  .get([authJwt.verifyToken], (req, res, next) => {
    const author = req.userId;
    Post.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null) {
            post.likes.push(author);
            post.save().then(
              (post) => {
                res.status(200).json(post);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Post" + req.params.postId + " not Found.");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete([authJwt.verifyToken], (req, res, next) => {
    const author = req.userId;
    Post.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null) {
            post.likes.splice(post.likes.indexOf(author), 1);
            post.save().then(
              (post) => {
                res.status(200).json(post);
              },
              (err) => next(err)
            );
          } else if (post == null) {
            err = new Error("Post" + req.params.postId + " not Found.");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment" + req.params.commentId + " not Found.");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

router
  .route("/myPosts/:postId/comments")
  .get([authJwt.verifyToken], (req, res, next) => {
    Post.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null) {
            return res.status(200).json(post.comments);
          } else {
            err = new Error("Post" + req.params.postId + " not Found.");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post([authJwt.verifyToken], (req, res, next) => {
    Post.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null) {
            console.log(post);
            const comments = {
              comment: req.body.comment,
              author: req.userId 
            }
            post.comments.push(comments);
            post.save().then(
              (post) => {
                res.status(200).json(post);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Post" + req.params.postId + " not Found.");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete([authJwt.verifyToken], (req, res, next) => {
    Post.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null) {
            for (var i = post.comments.length - 1; i >= 0; i--) {
              post.comments.id(post.comments[i]._id).deleteMany();
            }
            post.save().then(
              (post) => {
                res.status(200).json(post);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Post" + req.params.postId + " not Found.");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

router
  .route("/myPosts/:postId/comments/:commentId")
  .get([authJwt.verifyToken], (req, res, next) => {
    Post.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null && post.comments.id(req.params.commentId) != null) {
            res.status(200).json(post.comments.id(req.params.commentId));
          } else if (post == null) {
            err = new Error("Post" + req.params.postId + " not Found.");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment" + req.params.commentId + " not Found.");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put([authJwt.verifyToken], (req, res, next) => {
    Post.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null && post.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
              post.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
              post.comments.id(req.params.commentId).comment = req.body.comment;
            }
            post.save().then(
              (post) => {
                res.status(200).json(post);
              },
              (err) => next(err)
            );
          } else if (post == null) {
            err = new Error("Post" + req.params.postId + " not Found.");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment" + req.params.commentId + " not Found.");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete([authJwt.verifyToken], (req, res, next) => {
    Post.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null && post.comments.id(req.params.commentId) != null) {
            post.comments.id(req.params.commentId).deleteMany();
            post.save().then(
              (post) => {
                res.status(200).json(post);
              },
              (err) => next(err)
            );
          } else if (post == null) {
            err = new Error("Post" + req.params.postId + " not Found.");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment" + req.params.commentId + " not Found.");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

router
  .route("/myPosts/:postId/comments/:commentId/like")
  .get([authJwt.verifyToken], (req, res, next) => {
    const author = req.userId;
    Post.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null && post.comments.id(req.params.commentId) != null) {
            post.comments.id(req.params.commentId).likes.push(author);
            post.save().then(
              (post) => {
                res.status(200).json(post.comments.id(req.params.commentId));
              },
              (err) => next(err)
            );
          } else if (post == null) {
            err = new Error("Post" + req.params.postId + " not Found.");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment" + req.params.commentId + " not Found.");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete([authJwt.verifyToken], (req, res, next) => {
    const author = req.userId;
    Post.findById(req.params.postId)
      .then(
        (post) => {
          if (post != null && post.comments.id(req.params.commentId) != null) {
            post.comments
              .id(req.params.commentId)
              .likes.splice(
                post.comments.id(req.params.commentId).likes.indexOf(author),
                1
              );
            post.save().then(
              (post) => {
                res.status(200).json(post.comments.id(req.params.commentId));
              },
              (err) => next(err)
            );
          } else if (post == null) {
            err = new Error("Post" + req.params.postId + " not Found.");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment" + req.params.commentId + " not Found.");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = router;
