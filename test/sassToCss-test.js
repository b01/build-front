/*global describe it */
const
    assert = require("assert"),
    chai = require("chai"),
    spies = require("chai-spies"),
    fs = require("fs"),
    PS = require("path").sep,
    sass = require("node-sass"),
    sassToCss = require(__dirname + "/../src/sassToCss"),
    tools = require(__dirname + "/../src/tools"),
    FIXTURES_DIR = __dirname + PS + "fixtures",
    TMP_DIR =  __dirname + PS + "tmp";

chai.use(spies);

describe("sassToCssTest should", () => {
    const sassSandbox = chai.spy.sandbox();
    const expect = chai.expect;

    let outDir, srcDir;

    outDir = TMP_DIR + PS + "scss";
    srcDir = FIXTURES_DIR + PS + "scss";

    it("convert an file .scss to .css", (done) => {
        let fixtureName;

        fixtureName = "file-1";

        sassToCss(fixtureName + ".scss", srcDir, outDir, {})
            .catch(function (pErr) {
                done(pErr);
            }).then(() => {
                let actual;

                actual = fs.existsSync(outDir + PS + "file-1.css");

                assert.ok(actual);

                done();
            });
    });

    it("pass along error when cannot save a file", (done) => {
        let fixtureName;

        fixtureName = "file-2";

        sassSandbox.on(tools, ["saveFile"], () => {
            return new Promise((pResolve, pReject) => {
                pReject("forced error");
            });
        });

        sassToCss(fixtureName + ".scss", srcDir, outDir, {}).catch(
            (pErr) => {
                expect(pErr.toString()).to.eq("forced error");
                done();
                sassSandbox.restore();
            });
    });

    it("catch sass render error", (done) => {
        let fixtureName;

        fixtureName = "file-2";

        sassSandbox.on(sass, ["render"], (pArg1, pArg2) => {
            pArg2("forced render error");
        });

        sassToCss(fixtureName + ".scss", srcDir, outDir, {}).catch(
            (pErr) => {
                expect(pErr.toString()).to.eq("forced render error");
                done();
                sassSandbox.restore();
            });
    });

    it("expect an error be thrown when no files can be found to convert", (done) => {
        let fixtureName;

        fixtureName = "file-3";

        expect(
            sassToCss.bind(null, fixtureName + ".scss", srcDir, outDir, {})
        ).to.throw(/Unable to find any files with pattern/);

        done();
    });

    it("copy folder structure of source directory", (done) => {
        sassToCss("**/*.scss", srcDir + PS + "assets", outDir, {})
            .then(() => {
                expect(fs.existsSync(outDir + PS + "page.css")).to.eq(true);
                expect(fs.existsSync(outDir + PS + "page" + PS + "page-specific.css")).to.eq(true);
                expect(fs.existsSync(outDir + PS + "page" + PS + "group" + PS + "group.css")).to.eq(true);
                done();
            });

    });
});