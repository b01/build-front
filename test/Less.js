const
    assert = require("assert"),
    lessToCss = require(__dirname + "/../src/Less").lessToCss,
    FIXTURES_DIR = __dirname + "/fixtures",
    TMP_DIR =  __dirname + "/tmp",
    fs = require("fs");

describe("lessToCss",() => {
    let outDir, srcDir;

    outDir = TMP_DIR + "/less";
    srcDir = FIXTURES_DIR + "/less";

    it("Should compile .less to .css", () => {
        let fixture = "";
        lessToCss(
            "**/*.less",
            srcDir,
            outDir,
            false,
            {}
        );
        $acutal = fs.existsSync(outDir + "/file-1.css");
        assert.equal($acutal , true);
    });
});