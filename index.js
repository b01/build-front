const SRC_DIR = __dirname + "/src";
const Clean = require(SRC_DIR + "/Clean").Clean;

/**
 * @param {array} pPaths
 */
function clean(pPaths)
{
    let clean = new Clean();

    return clean.dirs(pPaths);
}

exports.lessToCss = require(SRC_DIR + "/lessToCss").lessToCss;
exports.jsToES5 = require(SRC_DIR + "/transform-js").jsToES5;
exports.cleanDirs = clean;