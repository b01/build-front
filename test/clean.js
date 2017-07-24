const
    assert = require("assert"),
    removeDirs = require(__dirname + "/../src/clean").removeDirs,
    tools = require(__dirname + "/../src/tools").tools,
    TMP_DIR =  __dirname + "/tmp",
    fs = require("fs");

describe("clean",() => {
    let srcDir;

    srcDir = TMP_DIR + "/clean";

    it("Should remove directory.", () => {
        let fixture1, fixture2;

        fixture1 = srcDir + "/dir-1";
        fixture2 = srcDir + "/dir-2";

        if (!fs.existsSync(srcDir)) {
            fs.mkdirSync(srcDir);
        }

        if (!fs.existsSync(fixture1)) {
            fs.mkdirSync(fixture1);
        }

        if (!fs.existsSync(fixture2)) {
            fs.mkdirSync(fixture2);
        }

        removeDirs([fixture1, fixture2]).then(() => {
            $acutal = !fs.existsSync(fixture2) && !fs.existsSync(fixture2);

            assert.equal($acutal , true);
        });
    });
});