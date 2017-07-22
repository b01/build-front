"use strict";
/**
 * Transform JS files.
 *
 * Transform all *.js files in directory and save them to a designated directory.
 */

const
    babel = require('babel-core'),
    glob = require("glob"),
    fs = require("fs"),
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

    console.log(`Compressing ${srcFile} -> ${minFile}`);

    // Do compression on each source file.
    babel.transformFile(srcFile, pTransformOptions, (error, result) => {
        if (typeof error === "string" && error.length > 0) {
            console.log(error);
        } else if (typeof result === "undefined") {// usually a bad srcFile.
            console.log("Could not transform", srcFile);
        } else {
            // Write the file, and overwrite if exists.
            tools.saveFile(minFile, result.code);
        }
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
let transformJs = (pGlobPattern, pSourceDir, pOutDir, pOptions) => {
    let globOptions, transformOptions;

    // Will use the source dir as the current working directory when no options
    // specified.
    globOptions = pOptions.glob || {"cwd": pSourceDir};
    transformOptions = pOptions.transform || {};

    // Loop through each file, converting each.
    glob(pGlobPattern, globOptions, (pErr, pFiles) => {
        let i;

        if (pErr === null) {//TODO: check the docs about comparing null like this.
            console.log(pErr);
        } else if (pFiles.length > 0) {
            for (i in pFiles) {
                if (!pFiles.hasOwnProperty(i)) {
                    continue;
                }

                transformFile(pFiles[i], pSourceDir, pOutDir, transformOptions)
            }
        }
    });
};

exports.transformJs = transformJs;