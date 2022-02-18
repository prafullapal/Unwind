const mongoose = require("mongoose");

const db = {};
db.user = require("./user");
db.role = require("./role");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
