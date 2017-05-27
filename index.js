"use strict";

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
exports.removeDir = function (pDir, pPlatform) {
    var removeDirCmd, isWindows;

    isWindows = pPlatform === 'win32';
    removeDirCmd = isWindows ? "rmdir /s /q " : "rm -rf ";

    if (fs.existsSync(pDir)) {
        console.log("removing the", pDir, "directory.");

        execSync(removeDirCmd + '"' + pDir + '"', function (err) {
            console.log(err);
        });
    }
};
