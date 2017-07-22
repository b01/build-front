"use strict";
/**
 * Compress JS files.
 *
 * Compile all *.js files in the js directory and save them as
 * *.min.js in web-ui/js.
 */

const
    babel = require('babel-core'),
    glob = require("glob"),
    fs = require("fs");

/**
 *
 * @param {string} pSrcDir
 * @param {string} pOutDir
 * @param {boolean} pTransformOptions
 * @constructor
 */
class Min
{
    constructor(pSrcDir, pOutDir, pTransformOptions) {
        this.srcDir = pSrcDir;
        this.outDir = pOutDir;
        this.transformOptions = pTransformOptions;
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
            this.compileFile(file);
        }
    }

    /**
     *
     * @param {object} file
     */
    compileFile(name) {
        var srcFile = this.srcDir + '/' + name,
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
}

exports.Min = Min;