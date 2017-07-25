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
 * @param {string} pSrcDir
 * @param {string} pOutDir
 * @param {object} pTransformConfig
 */
let transformFile = (pFilename, pSrcDir, pOutDir, pTransformConfig) => {
    let minFile, srcFile;

    srcFile = pSrcDir + "/" + pFilename;
    minFile = pOutDir + "/" + pFilename.replace(".js", ".min.js");

    console.log(`Transforming ${srcFile}`);

    // Do compression on each source file.
    return new Promise((pFulfill, pReject) => {
        babel.transformFile(srcFile, pTransformConfig, (error, result) => {
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
 * @param {string} pSrcDir
 * @param {string} pOutDir
 * @param {object} pConfig
 */
let jsToES5 = (pGlobPattern, pSrcDir, pOutDir, pConfig) => {
    let globConfig, transformConfig;

    // Will use the source dir as the current working directory when no options
    // specified.
    globConfig = pConfig.glob || {};
    globConfig.cwd = pSrcDir;
    transformConfig = pConfig.transform || {};

    // Loop through each file, converting each.
    return new Promise((pFulfill, pReject) => {
        glob(pGlobPattern, globConfig, (pErr, pFiles) => {
            let i, allPromises, fileSave;

            if (pErr !== null) {// TODO: check the docs about comparing null like this.
                console.log(pErr);
            } else if (pFiles.length > 0) {
                allPromises = [];
                for (i in pFiles) {
                    if (!pFiles.hasOwnProperty(i)) {
                        continue;
                    }

                    fileSave = transformFile(pFiles[i], pSrcDir, pOutDir, transformConfig);
                    allPromises.push(fileSave);
                }
            }

            Promise.all(allPromises).catch(pReject).then(pFulfill);
        });
    });
};

module.exports = jsToES5;