const
    SRC_DIR = __dirname + "/../src",
    FIXTURES_DIR = __dirname + "/fixtures",
    TMP_DIR = __dirname + "/tmp";

const jsToES5 = require(SRC_DIR + "/transform-js");
const fs = require("fs");
const assert = require('assert');

describe("Transform JS", () => {
    let outDir, srcDir;

    outDir = TMP_DIR + "/js";
    srcDir = FIXTURES_DIR + "/js";

    describe("jsToES5", () => {
        it("should make a new file", () => {
            jsToES5("**/*.js", srcDir, outDir, {}).then(() => {
                let actual;
                actual = fs.existsSync(outDir = "/test-1..min.js");

                assert.equal(actual, true);
            });

        });
    });
});