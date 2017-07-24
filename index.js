const SRC_DIR = __dirname + "/src";
const Less = require(SRC_DIR + "/Less").Less;
const Clean = require(SRC_DIR + "/Clean").Clean;

/**
 *
 * @param pSrcDir
 * @param pOutDir
 * @param pIsProd
 */
function less(pSrcDir, pOutDir, pIsProd)
{
    return new Less(pSrcDir, pOutDir, pIsProd);
}

/**
 * @param {array} pPaths
 */
function clean(pPaths)
{
    let clean = new Clean();

    return clean.dirs(pPaths);
}

exports.less = less;
exports.jsToES5 = require(SRC_DIR + "/transform-js").jsToES5;
exports.cleanDirs = clean;