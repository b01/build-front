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
 * @param {arra} pDirs
 * @param {string} pPlatform
 */
let removeDirs = (pDirs, pPlatform) => {
    let platform, aPath, allPromises, primrose;

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
    let removeDirCmd, isWindows;

    isWindows = pPlatform === 'win32';
    removeDirCmd = isWindows ? "rmdir /s /q " : "rm -rf ";

    console.log("removing the", pPath, "directory.");
    return new Promise((pFulfill, pReject) => {
        exec(removeDirCmd + '"' + pPath + '"', (pError, pStdout, pStderr) => {
            if (pError !== null) {
                pReject(pError);
            }

            if (pStderr !== null) {
                pReject(pStderr);
            }

            pFulfill();
        });
    });
};

module.exports = removeDirs;