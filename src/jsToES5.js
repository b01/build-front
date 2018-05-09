/**
 * Transform JS files.
 *
 * Transform all *.js files in directory and save them to a designated directory.
 */

//TODO: Rename to jsToBrowser.js
const
    babel = require("babel-core"),
    glob = require("glob"),
    PS = require("path").sep,
    tools = require(__dirname + "/tools"),
    print = tools.print;

/**
 * Convert and/or min-ify JS files to compatible browser JS.
 *
 * @param {string} pSrcFile Full path to a JS file.
 * @param {string} pOutFile Full path to output the converted file.
 * @param {object} pBabelTransformConfig Babel transform options.
 */
let transformFile = (pSrcFile, pOutFile, pBabelTransformConfig, pVerbose) => {
    let minFile, verbose;

    verbose = pVerbose === true;

    //TODO add check to determine if ".min" should be inserted.
    //TODO Base on babelTransform options set.
    // if (pBabelTransformConfig.hasOwnProperty("") && pBabelTransformConfig. === true) {
    minFile = pOutFile.replace(".js", ".min.js");
    // }
    if (verbose) {
        print(`Transforming ${pSrcFile}`);
    }

    // Do JS transformation on each source file a-sync.
    return new Promise((pFulfill, pReject) => {
        babel.transformFile(pSrcFile, pBabelTransformConfig, (error, result) => {
            if (error !== null) {
                pReject(error);
            } else if (typeof result === "undefined") {// could be a bad srcFile.
                pReject(new Error("Could not transform " + pSrcFile));
            } else {
                // Write the file, overwriting if exists.
                tools.saveFile(minFile, result.code)
                    .catch(pReject)
                    .then(function () {
                        if (verbose) {
                            print("saved " + minFile);
                        }

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
 * @param {object} pConfig This takes glob and babel transform options in the form: {"glob": {...}, "transform": {...}, }
 */
let jsToES5 = (pGlobPattern, pSrcDir, pOutDir, pConfig) => {
    let allPromises, fileSave, globConfig,
        srcFile, srcFiles, transformConfig, verbose;

    verbose = pConfig.hasOwnProperty("verbose") && pConfig.verbose === true;

    globConfig = pConfig.glob || {};
    transformConfig = pConfig.transform || {};

    // Set source as the current working directory when not specified.
    if (!globConfig.hasOwnProperty("cwd")) {
        globConfig.cwd = pSrcDir;
    }

    allPromises = [];
    srcFiles = glob.sync(pGlobPattern, globConfig);

    // Convert each source JS file.
    for (srcFile of srcFiles) {
        fileSave = transformFile(
            pSrcDir + PS + srcFile,
            pOutDir + PS + srcFile,
            transformConfig,
            verbose
        );

        allPromises.push(fileSave);
    }

    return Promise.all(allPromises);
};

module.exports = jsToES5;