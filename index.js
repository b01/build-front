const SRC_DIR = __dirname + "/src";

exports.jsToES5 = require(SRC_DIR + "/transform-js");
exports.lessToCss = require(SRC_DIR + "/lessToCss");
exports.removeDirs = require(SRC_DIR + "/clean");