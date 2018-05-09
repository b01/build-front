/*global describe it */
const
    PS = require("path").sep,
    FIXTURES_DIR = __dirname + PS + "fixtures",
    TMP_DIR = __dirname + PS + "tmp";

const jsToES5 = require(__dirname + "/../src/jsToES5");
const fs = require("fs");
const assert = require("assert");
const chai = require("chai");
const spies = require("chai-spies");
const expect = chai.expect;
const babel = require("babel-core");

chai.use(spies);

const sandbox = chai.spy.sandbox();

global.describe("jsToES5 should", () => {
    let outDir, srcDir;

    outDir = TMP_DIR + PS + "js";
    srcDir = FIXTURES_DIR + PS + "js";

    describe("jsToES5", () => {
        it("make a new file in the output directory with .min.js extension", (done) => {
            let fixtureName;
            fixtureName = "test-1";

            jsToES5(fixtureName + ".js", srcDir, outDir, {})
                .then(() => {
                    let actual;

                    actual = fs.existsSync(outDir + PS + fixtureName + ".min.js");

                    assert.equal(actual, true);

                    done();
                });
        });

        it("pass babel the correct arguments", (done) => {
            let fixtureConfig, fixtureName;

            fixtureName = "test-2";

            sandbox.on(babel, ["transformFile"], (arg1, arg2, arg3) => {
                expect(arg1).to.eq(`${srcDir + PS + fixtureName}.js`);
                expect(arg2.test).to.eq(1234);
                arg3(null, {"code": "wilbur"});
            });

            fixtureConfig = { "transform": {"test": 1234} };
            jsToES5(fixtureName + ".js", srcDir, outDir, fixtureConfig)
                .then(() => {
                    fs.readFile(outDir + PS + fixtureName + ".min.js", "utf-8", (pErr, pData) => {
                        expect(pData).to.contains("wilbur");

                        sandbox.restore(); // restores original methods on `array`

                        done();
                    });
                }).catch((pErr) => {
                    done(pErr);
                });
        });

        it("should transform ES6 yo ES5 in a new file", (done) => {
            let fixtureName;

            fixtureName = "es6";

            sandbox
                .on(babel, ["transformFile"], (pArg1, pArg2, pArg3) => {
                    pArg3("force reject");
                });

            jsToES5(fixtureName + ".js", srcDir, outDir, {})
                .catch((pErr) => {
                    expect(pErr).to.eq("force reject");

                    sandbox.restore();

                    done();
                });
        });

        it("fails gracefully when babel transformFile fails", (done) => {
            let fixtureName;

            fixtureName = "test-3";

            sandbox.on(babel, "transformFile", (pFile, pSourceDir, pCb) => {
                pCb(null);
            });

            jsToES5(fixtureName + ".js", srcDir, outDir, {})
                .catch((pErr) => {
                    expect(pErr.toString()).to.eq(
                        "Error: Could not transform " + srcDir + PS + fixtureName + ".js"
                    );
                    sandbox.restore();
                    done();
                });

        });

        it("copy folder structure of source directory", (done) => {
            jsToES5("**/*.js", srcDir + PS + "assets", outDir, {})
                .then(() => {
                    expect(fs.existsSync(outDir + PS + "page.min.js")).to.eq(true);
                    expect(fs.existsSync(outDir + PS + "page" + PS + "page-specific.min.js")).to.eq(true);
                    expect(fs.existsSync(outDir + PS + "page" + PS + "group" + PS + "group.min.js")).to.eq(true);
                    done();
                });

        });
    });
});