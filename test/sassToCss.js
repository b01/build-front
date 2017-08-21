const
    assert = require("assert"),
    sassToCss = require(__dirname + "/../src/sassToCss"),
    FIXTURES_DIR = __dirname + "/fixtures",
    TMP_DIR =  __dirname + "/tmp",
    fs = require("fs");

describe("sassToCss", (done) => {
    let outDir, srcDir;

    outDir = TMP_DIR + "/scss";
    srcDir = FIXTURES_DIR + "/scss";

    // it("Should compile .sass to .css", () => {
    it("Should compile .scss to .css", () => {
        sassToCss(
            "**/*.scss",
            srcDir,
            outDir,
            {}
        // ).catch(() => {
        ).catch(function (pErr) {
            // console.log(pErr);
            assert.ok(false);
            done();
        }).then(() => {
            $acutal = fs.existsSync(outDir + "/file-1.css");
            assert.ok($acutal);
            done();
            // $acutal = fs.existsSync(outDir + "/file-1.css");
            // console.log('$acutal:', $acutal);
            // assert.equal($acutal , true);
        });
    });
});