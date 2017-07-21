"use strict";

const Less = require(__dirname + "/src/Less").Less;
const Min = require(__dirname + "/src/Min").Min;

/**
 * Performs front-end cleanup.
 */
const
    execSync = require("child_process").execSync,
    fs = require("fs"),
    os = require("os");

/**
 * Remove a directory.
 *
 * @param {string} pDir Directory path.
 * @param {string} pPlatform Value from os.platform().
 */
function removeDir(pDir, pPlatform) {
    var removeDirCmd, isWindows, platform;

    platform = pPlatform || os.platform();
    isWindows = platform === 'win32';
    removeDirCmd = isWindows ? "rmdir /s /q " : "rm -rf ";

    if (fs.existsSync(pDir)) {
        console.log("removing the", pDir, "directory.");

        execSync(removeDirCmd + '"' + pDir + '"', function (err) {
            console.log(err);
        });
    }
}

/**
 * Delete directories and the files in them recursively.
 *
 * @param pDirs
 * @param pPlatform
 */
function removeDirs(pDirs, pPlatform) {
    var i;

    for (i = 0; i < pDirs.length; i++) {
        buildFront.removeDir(pDirs[i], pPlatform);
    }
}

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

exports.removeDir = removeDir;
exports.removeDirs = removeDirs;
exports.less = less;
exports.js = js;