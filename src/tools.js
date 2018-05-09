const
    dirname = require("path").dirname,
    fs = require("fs"),
    PS = require("path").sep;

/**
 *
 * @param pPath Full paths only.
 * @returns {Promise<void>}
 */
let makeDir = async (pPath, pMode, pVerbose = false) => {
    let dirs, mode, path;

    mode = pMode || "0775";
    dirs = pPath.split(/\\|\//);
    path = "";

    for (dir of dirs) {
        path = path + dir + PS;

        if (!fs.existsSync(path) && dir.match(/:|\//) === null) {
            if (pVerbose === true) {
                print("attempting to make directory " + path);
            }

            fs.mkdirSync(path, mode);
        }
    }

    return new Promise((pResolve, pReject) => {
        if (fs.existsSync(pPath)) {
            pResolve();
        } else {
            pReject(new Error("Could not make directory " + pPath));
        }

        return;
    });
};

/**
 * Print to the terminal using stdout.
 *
 * @param chunk
 * @param cb
 * @returns {*}
 */
let print = (chunk, cb) => {
    return process.stdout.write(chunk + "\n", "utf8", cb);
};

/**
 * This will attempt to remove a directory and all of its contents (recursively).
 * @param {string} pDirectory
 * @returns {Promise<void>}
 */
let removeDir = async (pDirectory, pVerbose = false) => {
    let path, isFile, paths, fullPath, msg, removePromises, returnPromise;

    try {
        fs.accessSync(pDirectory, fs.F_OK | fs.W_OK);
    } catch (pErr) {
        msg = pErr.code === "ENOENT"
            ? "is not a directory"
            : "is not writable";

        return new Promise((pResole, pReject) => {
            pReject(new Error(`${pDirectory} ${msg}.`));
        });
    }

    paths = fs.readdirSync(pDirectory);
    removePromises = [];

    for (path of paths) {
        fullPath = pDirectory + PS + path;
        isFile = fs.lstatSync(fullPath).isFile();

        if (isFile) {
            if (pVerbose === true) {
                print("removing file " + fullPath);
            }

            fs.unlinkSync(fullPath);
            continue;
        }

        removePromises.push(
            removeDir(fullPath)
        );
    }

    return new Promise((pResolve, pReject) => {
        if (pVerbose === true) {
            print("removing directory" + pDirectory);
        }

        if (removePromises.length > 0) {
            Promise.all(removePromises).then(
                () => {
                    fs.rmdirSync(pDirectory);
                    pResolve();
                },
                (pErr) => {
                    pReject(pErr);
                });
        } else {
            fs.rmdirSync(pDirectory);

            if (fs.existsSync(pDirectory)) {
                pReject(new Error(`Failed to remove ${pDirectory}`));
            } else {
                pResolve();
            }
        }
    });
};

/**
 * Delete directories (recursively).
 *
 * @param {array} pDirs An array of directories.
 */
let removeDirs = (pDirs) => {
    let dir, allPromises;

    allPromises = [];

    for (dir of pDirs) {
        allPromises.push(
            removeDir(dir)
        );
    }

    return Promise.all(allPromises);
};

/**
 * Save some text to a file.
 *
 * @param {string} pFilename
 * @param {string} pContent
 * @param {boolean} pVerbose
 * @returns {Promise<any>}
 */
let saveFile = (pFilename, pContent, pVerbose = false) => {
    let dir = dirname(pFilename);

    // Make directory if not exists.
    if (!fs.existsSync(dir)) {
        if (pVerbose === true) {
            print(`making the directory "${dir}" directory.`);
        }

        makeDir(dir, "0775");
    }

    // Write the file, and overwrite if exists.
    return new Promise((pFulfill, pReject) => {
        fs.writeFile(pFilename, pContent, (pErr) => {
            if (pErr === null) {
                pFulfill();
            } else {
                pReject(pErr);
            }
        });
    });
};

module.exports = {
    "makeDir": makeDir,
    "print": print,
    "removeDir": removeDir,
    "removeDirs": removeDirs,
    "saveFile": saveFile,
};