const
    assert = require("assert"),
    Less = require(__dirname + "/../src/Less").Less,
    FIXTURES_DIR = __dirname + "/fixtures",
    TMP_DIR =  __dirname + "/tmp";

describe("Less", function () {
    describe("compileFile", function () {
        it("", function () {
            // console.log("Less", Less);
            let less = new Less(FIXTURES_DIR, TMP_DIR, false);
            less.compileFile({"name": "file-1.less"})
        })
    });
});