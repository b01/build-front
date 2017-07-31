const
    assert = require("assert"),
    lessToCss = require(__dirname + "/../src/lessToCss"),
    FIXTURES_DIR = __dirname + "/fixtures",
    TMP_DIR =  __dirname + "/tmp",
    fs = require("fs");

describe("lessToCss",() => {
    let outDir, srcDir;

    outDir = TMP_DIR + "/less";
    srcDir = FIXTURES_DIR + "/less";

    it("Should compile .less to .css", (done) => {
        lessToCss(
            "**/*.less",
            srcDir,
            outDir,
            {}
        ).catch((pErr) => {
            assert.fail(pErr);
            done();
        }).then(() => {
            $acutal = fs.existsSync(outDir + "/file-1.css");
            assert.equal($acutal , true);
            done();
        });
    });
});