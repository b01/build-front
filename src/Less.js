const
    fs = require("fs"),
    glob = require("glob"),
    less = require("less"),
    tools = require(__dirname + "/tools");

/**
 * Convert LESS to CSS.
 *
 * Compile all *.less files in the less directory and save them as
 * *.css in web-ui/css.
 *
 * @param {string} pGlobPattern
 * @param {string} pSrcDir
 * @param {string} pOutDir
 * @param {object} pConfig
 */
let lessToCss = (pGlobPattern, pSrcDir, pOutDir, pConfig) => {
    let globConfig;

    globConfig = pConfig.glob || {};
    globConfig.cwd = pSrcDir;

    // Fine *.less files from the source directory.
    return new Promise((pFulfill, pReject) => {
        let allPromises;

        allPromises = [];

        glob(pGlobPattern, pConfig.glob, (pError, pFiles) => {
            if (pError !== null) {
                console.log(
                    "Unable to find any LESS files with pattern",
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
    let lessFile, cssFile, fileExt, lessConfig;

    lessFile = pSrcDir + "/" + name;
    lessConfig = pConfig.less || {};
    lessConfig.paths = [pSrcDir];
    fileExt = lessConfig.compress ? ".min.css" : ".css";
    cssFile = pOutDir + "/" + name.replace(".less", fileExt);

    console.log("Processing " + lessFile);

    return new Promise((pFulfill, pReject) => {
        fs.readFile(lessFile, "utf8", (error, content) => {
            if (error !== null) {
                console.log("compileFile:", error);
                pReject(error);
            }

            // Compile LESS to CSS and compress as well.
            less.render(content, lessConfig, (error, output) => {
                if (error !== null) {
                    console.log("compileFile less failed:", error);
                    pReject(error);
                }

                // Write the file, and overwrite if exists.
                tools.saveFile(cssFile, output.css)
                    .catch(pReject)
                    .then(function () {
                        console.log("saved", cssFile);
                        pFulfill();
                    });
                // fs.writeFile(cssFile, output.css, function (error) {
                //     if (error !== null) {
                //         pReject(error);
                //     } else {
                //         console.log("done with:", cssFile);
                //         pFulfill();
                //     }
                // });
            });
        });
    });
};

exports.lessToCss = lessToCss;