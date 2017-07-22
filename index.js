"use strict";

const Less = require(__dirname + "/src/Less").Less;
const transformJs = require(__dirname + "/src/transform-js").transformJs;
const Clean = require(__dirname + "/src/Clean").Clean;

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
exports.transformJs = transformJs;
exports.cleanDirs = clean;