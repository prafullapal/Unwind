const mongoose = require("mongoose");

const db = {};
db.user = require("./user");
db.role = require("./role");
db.post = require("./post");
db.profile = require("./profile");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
