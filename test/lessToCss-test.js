/*global describe it */

const
    assert = require("assert"),
    chai = require("chai"),
    spies = require("chai-spies"),
    fs = require("fs"),
    less = require("less"),
    lessToCss = require(__dirname + "/../src/lessToCss"),
    tools = require(__dirname + "/../src/tools"),
    PS = require("path").sep,
    FIXTURES_DIR = __dirname + PS + "fixtures",
    TMP_DIR = __dirname + PS + "tmp";

chai.use(spies);

describe("lessToCss should",() => {
    const lessSandbox = chai.spy.sandbox(),
        expect = chai.expect;

    let outDir, srcDir;

    outDir = TMP_DIR + PS + "less";
    srcDir = FIXTURES_DIR + PS + "less";

    it("convert a LESS file to a CSS file", (done) => {
        let fixtureName;

        fixtureName = "file-1";

        lessToCss(fixtureName + ".less", srcDir, outDir, {}).then(
            () => {
                let actual;

                actual = fs.existsSync(outDir + PS + fixtureName + ".css");
                assert.equal(actual , true);
                done();
            },
            (pErr) => {
                done(pErr);
            }
        );
    });

    it("catch and reject file read error", (done) => {
        let fixtureName;

        fixtureName = "file-2";

        lessSandbox.on(fs, ["readFile"], (pArg1, pArg2, pArg3) => {
            pArg3("forced read error");
        });

        lessToCss(fixtureName + ".less", srcDir, outDir, {}).then(
            () => {
                done(new Error("test failed"));
            },
            (pErr) => {
                expect(pErr).to.eq("forced read error");
                done();
                lessSandbox.restore();
            }
        );
    });

    it("catch and reject less render error", (done) => {
        let fixtureName;

        fixtureName = "file-2";

        lessSandbox.on(less, ["render"], (pArg1, pArg2, pArg3) => {
            pArg3("forced render error");
        });

        lessToCss(fixtureName + ".less", srcDir, outDir, {}).then(
            () => {
                done(new Error("test failed"));
            },
            (pErr) => {
                expect(pErr).to.eq("forced render error");
                done();
                lessSandbox.restore();
            }
        );
    });

    it("catch and reject less render error", (done) => {
        let fixtureName;

        fixtureName = "file-2";

        lessSandbox.on(less, ["render"], (pArg1, pArg2, pArg3) => {
            pArg3("forced render error");
        });

        lessToCss(fixtureName + ".less", srcDir, outDir, {}).then(
            () => {
                done(new Error("test failed"));
            },
            (pErr) => {
                expect(pErr).to.eq("forced render error");
                done();
                lessSandbox.restore();
            }
        );
    });

    it("catch and reject save css file error", (done) => {
        let fixtureName;

        fixtureName = "file-2";

        lessSandbox.on(tools, ["saveFile"], () => {
            return new Promise((pResolve, pReject) => {
                pReject("forced save error");
            });
        });

        lessToCss(fixtureName + ".less", srcDir, outDir, {}).then(
            () => {
                done(new Error("test failed"));
            },
            (pErr) => {
                expect(pErr).to.eq("forced save error");
                done();
                lessSandbox.restore();
            }
        );
    });

    it("throw an error when no files to process", (done) => {
        let fixtureName, throwErrorFn;

        fixtureName = "file-3";

        throwErrorFn = lessToCss.bind(null, fixtureName + ".less", srcDir, outDir, {});

        expect(throwErrorFn).to.throw(/^Unable to find any files/);

        done();
    });

    it("copy folder structure of source directory", (done) => {
        lessToCss("**/*.less", srcDir + PS + "assets", outDir, {})
            .then(() => {
                expect(fs.existsSync(outDir + PS + "page.css")).to.eq(true);
                expect(fs.existsSync(outDir + PS + "page" + PS + "page-specific.css")).to.eq(true);
                expect(fs.existsSync(outDir + PS + "page" + PS + "group" + PS + "group.css")).to.eq(true);
                done();
            });

    });
});