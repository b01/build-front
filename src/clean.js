/**
 * Performs front-end cleanup.
 */
const
    exec = require("child_process").exec,
    fs = require("fs"),
    glob = require("glob"),
    os = require("os");

/**
 * Delete directories and the files in them recursively.
 *
 * @param {array} pDirs
 * @param {string} pPlatform
 */
let removeDirs = (pDirs, pPlatform) => {
    let platform, allPromises, primrose;

    platform = pPlatform || os.platform();
    allPromises = [];

    for (aPath of pDirs) {
        primrose = removeDirContents(aPath, platform);
        allPromises.push(primrose);
    }

    return Promise.all(allPromises);
};

/**
 * Remove a directory.
 *
 * @param {string} pPath Directory path.
 * @param {string} pPlatform
 */
let removeDirContents = (pPath, pPlatform) => {
    let removeDirCmd, isWindows, strCmd;

    isWindows = pPlatform === 'win32';
    removeDirCmd = isWindows ? "rmdir /s /q " : "rm -rf ";
    strCmd = removeDirCmd + '"' + pPath + '"';

    console.log("removing the", pPath, "directory.");

    return new Promise((pFulfill, pReject) => {
        exec(strCmd, (pError, pStdout, pStderr) => {
            if (pError) {
                console.log("Error removing dir:", pError);
                pReject(pError);
            } else {
                console.log("pStdout", pStdout);
                console.log("pStderr", pStderr);
                pFulfill();
            }
        });
    });
};

module.exports = removeDirs;