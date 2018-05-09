const
    fs = require("fs"),
    glob = require("glob"),
    less = require("less"),
    PS = require("path").sep,
    tools = require(__dirname + "/tools"),
    print = tools.print;

/**
 * Convert LESS to CSS.
 *
 * Compile all *.less files to *.css.
 *
 * @param {string} pGlobPattern
 * @param {string} pSrcDir
 * @param {string} pOutDir
 * @param {object} pConfig
 */
let lessToCss = (pGlobPattern, pSrcDir, pOutDir, pConfig) => {
    let allPromises, file, files, globConfig, primrose;

    globConfig = pConfig.glob || {};
    globConfig.cwd = pSrcDir;


    // Find files in the source directory.
    files = glob.sync(pGlobPattern, globConfig);

    if (files.length < 1) {
        throw new Error("Unable to find any files with pattern " + pGlobPattern);
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
    let lessFile, cssFile, fileExt, lessConfig, verbose;

    lessFile = pSrcDir + PS + name;
    lessConfig = pConfig.less || {};
    lessConfig.paths = [pSrcDir];
    fileExt = lessConfig.compress ? ".min.css" : ".css";
    cssFile = pOutDir + PS + name.replace(".less", fileExt);
    verbose = pConfig.hasOwnProperty("verbose") && pConfig.verbose === true;

    if (verbose) {
        print("Processing " + lessFile);
    }

    return new Promise((pFulfill, pReject) => {
        fs.readFile(lessFile, "utf8", (pErr, pContent) => {
            if (pErr !== null) {
                pReject(pErr);
            }

            // Compile to CSS and compress as directed.
            less.render(pContent, lessConfig, (error, output) => {
                if (error !== null) {
                    pReject(error);
                } else {
                    // Write the file, and overwrite if exists.
                    tools.saveFile(cssFile, output.css)
                        .then(
                            () => {
                                if (verbose) {
                                    print("saved " + cssFile);
                                }
                                pFulfill();
                            },
                            pReject
                        );
                }
            });
        });
    });
};

module.exports = lessToCss;