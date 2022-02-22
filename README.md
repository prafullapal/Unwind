# Unwind
 
### Setup:
To run this project, install it locally using npm:
```
$ npm install
$ npm start
```

### EndPoints:

* /api/auth/signup [POST]
* /api/auth/signin [POST]

* /api/users/public [GET]
* /api/users/mod [GET]
* /api/users/user [GET]
* /api/users/admin [GET]

* /user/posts/myPosts [GET]
* /user/posts/myPosts/create [POST]
* /user/posts/myPosts/:postId [GET, PUT, DELETE]
* /user/posts/myPosts/:postId/like [GET, DELETE]
* /user/posts/myPosts/:postId/comments [GET, POST, DELETE*]
* /user/posts/myPosts/:postId/comments/:commentId [GET, PUT, DELETE*]
* /user/posts/myPosts/:postId/comments/:commentId/like [GET, DELETE]

* /user/profile [GET, POST]
* /user/profile/followers [GET]
* /user/profile/following [GET]
* /user/profile/:profileId/follow [GET, DELETE]