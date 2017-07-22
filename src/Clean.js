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
 * @param {string} pPlatform
 * @constructor
 */
class Clean
{
    constructor(pPlatform) {
        this.platform = pPlatform || os.platform();
    }

    /**
     *
     * @param {string} pGlobExp
     * @param {object} pGlobOptions
     */
    compile(pGlobExp, pGlobOptions) {
        let sourceFiles, file, i;

        // Load files from the source directory.
        sourceFiles = glob.sync(pGlobExp, pGlobOptions);

        // Loop through each file, converting each to CSS.
        for (i in sourceFiles) {
            file = sourceFiles[i];
            this.removeDirContents(file);
        }
    }

    /**
     * Delete directories and the files in them recursively.
     *
     * @param pDirs
     */
    dirs(pDirs) {
        let i;

        for (i = 0; i < pDirs.length; i++) {
            this.compile(pDirs[i]);
        }
    }

    /**
     * Remove a directory.
     *
     * @param {string} pPath Directory path.
     */
    removeDirContents(pPath) {
        let removeDirCmd, isWindows;

        isWindows = this.platform === 'win32';
        removeDirCmd = isWindows ? "rmdir /s /q " : "rm -rf ";

        if (fs.existsSync(pPath)) {
            console.log("removing the", pPath, "directory.");

            execSync(removeDirCmd + '"' + pPath + '"', function (err) {
                console.log(err);
            });
        }
    }
}

exports.Clean = Clean;