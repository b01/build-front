/**
 * Build CSS files.
 *
 * Compile all *.scss files to *.css in web-ui/css.
 */
const
    fs = require("fs"),
    glob = require("glob"),
    sass = require("node-sass"),
    tools = require(__dirname + "/tools");

/**
 * Convert SCSS to CSS using SASS.
 *
 * Compile all *.scss files in the scss directory and save them as
 * *.css in web-ui/css.
 *
 * @param {string} pGlobPattern
 * @param {string} pSrcDir
 * @param {string} pOutDir
 * @param {object} pConfig
 */
let sassToCss = (pGlobPattern, pSrcDir, pOutDir, pConfig) => {
    let globConfig;

    globConfig = pConfig.glob || {};
    globConfig.cwd = pSrcDir;

    // Fine *.scss files from the source directory.
    return new Promise((pFulfill, pReject) => {
        let allPromises;

        allPromises = [];

        glob(pGlobPattern, globConfig, (pError, pFiles) => {
            if (pError !== null) {
                console.log(
                    "Unable to find any files with pattern",
                    pGlobPattern
                );
                pReject(pError);
            }

            // Loop through each file, converting each to CSS.
            for (file of pFiles) {
                primrose = compileFile(file, pSrcDir, pOutDir, pConfig);
                allPromises.push(primrose);
            }

            Promise.all(allPromises).catch(pReject).then(pFulfill);
        });
    });
};

/**
 *
 * @param {string} name
 * @param {string} pSrcDir
 * @param {string} pOutDir
 * @param {object} pConfig
 */
let compileFile = (name, pSrcDir, pOutDir, pConfig) => {
    let sourceFile, cssFile, sassConfig, fileExt, srcConfig;

    sourceFile = pSrcDir + "/" + name;
    sassConfig = pConfig.sass || {};
    sassConfig.file = sourceFile;
    fileExt = sassConfig.outputStyle === 'compressed' ? ".min.css" : ".css";
    cssFile = pOutDir + "/" + name.replace(".scss", fileExt);

    srcConfig.includePaths = [pSrcDir];
    srcConfig.file = srcFile;

    console.log(`Processing ${sourceFile}`);

    return new Promise((pFulfill, pReject) => {
        // Compile to CSS and compress as directed.
        sass.render(sassConfig, (error, output) => {
            if (error !== null) {
                console.log("Compiling to css caused error:", error);
                pReject(error);
            }

            // Write the file, or overwrite if exists.
            tools.saveFile(cssFile, output.css.toString())
                .catch((error) => {
                    if (error !== null) {
                        console.log("Saving file error:", error);
                        pReject(error);
                    }
                })
                .then(function () {
                    console.log("saved", cssFile);
                    pFulfill();
                });
        });
    });
};

module.exports = sassToCss;