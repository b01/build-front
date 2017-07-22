"use strict";

const Less = require(__dirname + "/src/Less").Less;
const Min = require(__dirname + "/src/Min").Min;
const Clean = require(__dirname + "/src/Clean").Clean;
console.log(Clean);

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
 *
 * @param pSrcDir
 * @param pOutDir
 * @param pIsProd
 */
function js(pSrcDir, pOutDir, pIsProd)
{
    return new Min(pSrcDir, pOutDir, pIsProd);
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
exports.js = js;
exports.cleanDirs = clean;