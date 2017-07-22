"use strict";
const
    fs = require("fs"),
    glob = require("glob"),
    less = require("less");

/**
 * Build CSS files using LESS.
 *
 * Compile all *.less files in the less directory and save them as
 * *.css in web-ui/css.
 */
class Less {
    constructor(pSrcDir, pOutDir, pIsProd) {
        this.srcDir = pSrcDir;
        this.outDir = pOutDir;
        this.isProd = pIsProd;
    }

    /**
     * Convert LESS to CSS.
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
     * @param name
     */
    compileFile(name) {
        let lessFile, cssFile, srcDir, isProd, fileExt;

        srcDir = this.srcDir;
        isProd = this.isProd;
        lessFile = srcDir + "/" + name;
        fileExt = isProd ? ".min.css" : ".css";
        cssFile = this.outDir + "/" + name.replace(".less", fileExt);

        console.log("Processing " + lessFile);

        fs.readFile(lessFile, "utf8", function (error, content) {
            if (error !== null) {
                console.log(error);
            }
            // Compile LESS to CSS and compress as well.
            less.render(content, {paths: [srcDir], compress: isProd}, function (error, output) {
                if (error !== null) {
                    console.log(error);
                }

                fs.writeFile(cssFile, output.css, function (error) {
                    if (error !== null) {
                        console.log(error);
                    } else {
                        console.log("compiled " + cssFile);
                    }
                });
            });
        });
    }
}

exports.Less = Less;