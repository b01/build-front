const SRC_DIR = __dirname + "/src";

exports.lessToCss = require(SRC_DIR + "/lessToCss").lessToCss;
exports.jsToES5 = require(SRC_DIR + "/transform-js").jsToES5;
exports.removeDirs = require(SRC_DIR + "/remove-dirs").removeDirs;