"use strict";

/**
 * Performs front-end cleanup.
 */
const
    execSync = require("child_process").execSync,
    fs = require("fs"),
    glob = require("glob"),
    os = require("os");

/**
 * Delete directories and the files in them recursively.
 *
 * @param pDirs
 */
let removeDirs = (pDirs, pPlatform) => {
    let platform, aPath;

    platform = pPlatform || os.platform();

    for (aPath of pDirs) {
        removeDirContents(aPath, platform);
    }
};

/**
 * Delete all fils in the directory, but not the directory itself.
 *
 * @param {array} pDirs
 * @param {string} pGlobExp
 * @param {object} pGlobOptions
 */
let cleanDirs = (pDirs, pGlobConfig) => {
    let files;

    // Load files from the source directory.
    files = glob.sync(`${pDirs}/*` , pGlobConfig);

    // Delete each path found.
    for (filePath of files) {
        this.removeDirContents(filePath);
    }
};

/**
 * Remove a directory.
 *
 * @param {string} pPath Directory path.
 */
let removeDirContents = (pPath) => {
    let removeDirCmd, isWindows;

    isWindows = this.platform === 'win32';
    removeDirCmd = isWindows ? "rmdir /s /q " : "rm -rf ";

    if (fs.existsSync(pPath)) {
        console.log("removing the", pPath, "directory.");

        execSync(removeDirCmd + '"' + pPath + '"', (pError) => {
            console.log(err);
        });
    }
};

exports.removeDirs = removeDirs;