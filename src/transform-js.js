/**
 * Transform JS files.
 *
 * Transform all *.js files in directory and save them to a designated directory.
 */

const
    babel = require('babel-core'),
    glob = require("glob"),
    tools = require(__dirname + "/tools");

/**
 *
 * @param {string} pFilename
 * @param {string} pSourceDir
 * @param {string} pOutDir
 * @param {object} pTransformOptions
 */
let transformFile = (pFilename, pSourceDir, pOutDir, pTransformOptions) => {
    let minFile, srcFile;

    srcFile = pSourceDir + "/" + pFilename;
    minFile = pOutDir + "/" + pFilename.replace(".js", ".min.js");

    console.log(`Transforming ${srcFile}`);

    // Do compression on each source file.
    return new Promise((pFulfill, pReject) => {
        babel.transformFile(srcFile, pTransformOptions, (error, result) => {
            if (error !== null) {
                pReject(error);
            } else if (typeof result === "undefined") {// usually a bad srcFile.
                console.log("Could not transform", srcFile);
                pReject(error);
            } else {
                // Write the file, and overwrite if exists.
                tools.saveFile(minFile, result.code)
                    .catch(pReject)
                    .then(function () {
                        console.log("saved", minFile);
                        pFulfill();
                    });
            }
        });
    });
};

/**
 * Transform newer JS to ES5.
 *
 * @param {string} pGlobPattern
 * @param {string} pSourceDir
 * @param {string} pOutDir
 * @param {object} pOptions
 */
let jsToES5 = (pGlobPattern, pSourceDir, pOutDir, pOptions) => {
    let globOptions, transformOptions;

    // Will use the source dir as the current working directory when no options
    // specified.
    globOptions = pOptions.glob || {"cwd": pSourceDir};
    transformOptions = pOptions.transform || {};

    // Loop through each file, converting each.
    return new Promise((pFulfill, pReject) => {
        glob(pGlobPattern, globOptions, (pErr, pFiles) => {
            let i, allPromises, fileSave;

            if (pErr !== null) {// TODO: check the docs about comparing null like this.
                console.log(pErr);
            } else if (pFiles.length > 0) {
                allPromises = [];
                for (i in pFiles) {
                    if (!pFiles.hasOwnProperty(i)) {
                        continue;
                    }

                    fileSave = transformFile(pFiles[i], pSourceDir, pOutDir, transformOptions)
                    allPromises.push(fileSave);
                }
            }

            Promise.all(allPromises).then(pFulfill).catch(pReject);
        });
    });
};

exports.jsToES5 = jsToES5;