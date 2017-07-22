"use strict";
/**
 * Compress JS files.
 *
 * Compile all *.js files in the js directory and save them as
 * *.min.js in web-ui/js.
 */

const
    babel = require('babel-cli'),
    glob = require("glob"),
    fs = require("fs");

/**
 *
 * @param {string} pSrcDir
 * @param {string} pOutDir
 * @param {boolean} pIsProd
 * @constructor
 */
function Min(pSrcDir, pOutDir, pTransformOptions)
{
    this.srcDir = pSrcDir;
    this.outDir = pOutDir;
    this.transformOptions = pTransformOptions;
}

/**
 *
 * @param {string} pGlobExp
 * @param {object} pGlobOptions
 */
Min.prototype.minify = function (pGlobExp, pGlobOptions) {
    var sourceFiles;

    // Load files from the source directory.
    sourceFiles = glob.read(pGlobExp, pGlobOptions);

    // For each source file...
    sourceFiles.on('file', minifyFile.bind(this));
};

/**
 *
 * @param {object} file
 */
function minifyFile(file)
{
    var name = file.name,
        srcFile = this.srcDir + '/' + name,
        minFile = this.outDir + "/" + name.replace(".js", ".min.js");

    console.log("Compressing " + srcFile);

    // Do compression on each source file.
    babel.tranformFile(srcFile, this.transformOptions, (error, result) => {
        if (typeof error === "string" && error.length > 0) {
            console.log(error);
        } else {
            // Write the file, and overwrite if exists.
            fs.writeFile(minFile, result.code);
        }
    });
}

exports.Min = Min;