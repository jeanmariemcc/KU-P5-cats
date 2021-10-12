const static = require("./static-files.js");
const homeHandler = require("./home.js");
const cats = require("./cats.js");
module.exports = [static, homeHandler, cats];
