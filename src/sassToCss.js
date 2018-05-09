/**
 * Build CSS files.
 *
 * Compile all *.scss files to *.css in web-ui/css.
 */
const
    glob = require("glob"),
    PS = require("path").sep,
    sass = require("node-sass"),
    tools = require(__dirname + "/tools");

const print = tools.print;

/**
 * Convert SCSS files to CSS using SASS.
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
    let allPromises, file, files, globConfig, primrose;

    globConfig = pConfig.glob || {};
    globConfig.cwd = pSrcDir;

    // Find files from the source directory.
    files = glob.sync(pGlobPattern, globConfig);

    if (files.length < 1) {
        let errMsg = "Unable to find any files with pattern "
            + pGlobPattern
            + " in directory "
            + pSrcDir;

        throw new Error(errMsg);
    }

    allPromises = [];

    // Loop through each file, converting each to CSS.
    for (file of files) {
        primrose = compileFile(file, pSrcDir, pOutDir, pConfig);
        allPromises.push(primrose);
    }

    return Promise.all(allPromises);
};

/**
 *
 * @param {string} name
 * @param {string} pSrcDir
 * @param {string} pOutDir
 * @param {object} pConfig
 */
let compileFile = (name, pSrcDir, pOutDir, pConfig) => {
    let sourceFile, cssFile, sassConfig, fileExt, verbose;

    verbose = pConfig.hasOwnProperty("verbose") && pConfig.verbose === true;
    sourceFile = pSrcDir + PS + name;
    sassConfig = pConfig.sass || {};
    sassConfig.file = sourceFile;
    fileExt = sassConfig.outputStyle === "compressed" ? ".min.css" : ".css";
    cssFile = pOutDir + "/" + name.replace(".scss", fileExt);

    if (verbose) {
        print(`Processing ${sourceFile}`);
    }

    return new Promise((pFulfill, pReject) => {
        // Compile to CSS and compress as directed.
        sass.render(sassConfig, (error, output) => {
            if (error !== null) {
                pReject(error);
            } else {
                // Write a new file or overwrite if exists.
                tools.saveFile(cssFile, output.css.toString())
                    .then(
                        () => {
                            if (verbose) {
                                print("saved " + cssFile);
                            }

                            pFulfill();
                        },
                        (pErr) => {
                            pReject(pErr);
                        });
            }
        });
    });
};

module.exports = sassToCss;