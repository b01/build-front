/*global describe it*/
const
    assert = require("assert"),
    chai = require("chai"),
    spies = require("chai-spies"),
    fs = require("fs"),
    PS = require("path").sep,
    tools = require(__dirname + PS + ".." + PS + "src" + PS + "tools");

const TMP_DIR = __dirname + PS + "tmp";

chai.use(spies);

describe("tools",() => {
    const toolsSandbox = chai.spy.sandbox(),
        expect = chai.expect;

    it("removeDir should remove an empty directory", (done) => {
        let actual, fixture1;

        fixture1 = TMP_DIR + PS + "dir-empty";

        if (!fs.existsSync(TMP_DIR)) {
            fs.mkdirSync(TMP_DIR);
        }

        if (!fs.existsSync(fixture1)) {
            fs.mkdirSync(fixture1);
        }

        tools.removeDir(fixture1).then(
            () => {
                actual = !fs.existsSync(fixture1);

                assert.ok(actual);
                done();
            },
            (pErr) => {
                done(pErr);
            }
        );
    });

    it("removeDir can remove a directory with files", (done) => {
        let actual, fixture1, saveProm;

        fixture1 = TMP_DIR + PS + "dir-with-file";

        if (!fs.existsSync(TMP_DIR)) {
            fs.mkdirSync(TMP_DIR);
        }

        if (!fs.existsSync(fixture1)) {
            fs.mkdirSync(fixture1);
        }

        saveProm = tools.saveFile(`${fixture1 + PS}test.txt`, "1234", true);

        // Assert
        saveProm.catch(() => { // fail the test in case of error.
            assert.ok(false);
            done();
        });

        saveProm.then(() => {
            tools.removeDir(fixture1).then(
                () => {
                    actual = !fs.existsSync(fixture1);
                    assert.ok(actual);
                    done();
                },
                (pErr) => {
                    done(pErr);
                }
            );
        });

    });

    it("throw an error when cannot access a directory", (done) => {
        toolsSandbox.on(fs, ["accessSync"], () => {
            let err;
            err = new Error("bad dir error");
            err.code = "ENOENT";
            throw err;
        });

        tools.removeDir("bad dir").then(
            () => {
                done(new Error("test failed"));
                toolsSandbox.restore();
            },
            (pErr) => {
                expect(pErr.toString()).to.eq("Error: bad dir is not a directory.");
                done();
                toolsSandbox.restore();
            }
        );
    });

    it("throw an error when a directory is not writable", (done) => {
        toolsSandbox.on(fs, ["accessSync"], () => {
            let err;
            err = new Error("bad dir error");
            err.code = "NA";
            throw err;
        });

        tools.removeDir("bad dir").then(
            () => {
                done(new Error("test failed"));
                toolsSandbox.restore();
            },
            (pErr) => {
                expect(pErr.toString()).to.eq("Error: bad dir is not writable.");
                done();
                toolsSandbox.restore();
            }
        );
    });

    it("delete nested directories", (done) => {
        let fixtureDir, saveProm;

        fixtureDir = TMP_DIR + PS + "nested-dirs";
        if (!fs.existsSync(fixtureDir)) {
            fs.mkdirSync(fixtureDir, "0777");
        }
        if (!fs.existsSync(fixtureDir + PS + "dir1")) {
            fs.mkdirSync(fixtureDir + PS + "dir1");
        }
        if (!fs.existsSync(fixtureDir + PS + "dir1" + PS + "dir2")) {
            fs.mkdirSync(fixtureDir + PS + "dir1" + PS + "dir2");
        }

        saveProm = tools.saveFile(
            fixtureDir + PS + "dir1" + PS + "dir2" + PS + "test-1.txt",
            "some text"
        );

        saveProm.then(() => {
            tools.removeDir(fixtureDir).then(
                () => {
                    expect(fs.existsSync(fixtureDir)).to.eq(false);
                    done();
                },
                (pErr) => {
                    done(pErr);
                }
            );
        });
    });

    it("catch error when delete nested directories", (done) => {
        let fixtureDir;

        fixtureDir = TMP_DIR + PS + "nested-error-dirs";

        if (!fs.existsSync(fixtureDir)) {
            fs.mkdirSync(fixtureDir, "0777");
        }
        if (!fs.existsSync(fixtureDir + PS + "dir1")) {
            fs.mkdirSync(fixtureDir + PS + "dir1");
        }
        if (!fs.existsSync(fixtureDir + PS + "dir1" + PS + "dir2")) {
            fs.mkdirSync(fixtureDir + PS + "dir1" + PS + "dir2");
        }

        toolsSandbox.on(fs, ["accessSync"], (pArg1) => {
            if (pArg1 === fixtureDir + PS + "dir1" + PS + "dir2") {
                throw new Error("forced access error");
            }
        });

        tools.removeDir(fixtureDir).then(
            () => {
                done(new Error("test failed"));
                toolsSandbox.restore();
            },
            (pErr) => {
                expect(pErr.toString()).to.contains("dir2 is not writable");
                done();
                toolsSandbox.restore();
                tools.removeDir(fixtureDir);
            }
        );
    });

    it("catch error when delete nested directories", (done) => {
        let fixtureDir;

        fixtureDir = TMP_DIR + PS + "nested-exists-dirs";

        if (!fs.existsSync(fixtureDir)) {
            fs.mkdirSync(fixtureDir, "0777");
        }
        if (!fs.existsSync(fixtureDir + PS + "dir1")) {
            fs.mkdirSync(fixtureDir + PS + "dir1");
        }

        toolsSandbox.on(fs, ["existsSync"], () => {
            return true;
        });

        tools.removeDir(fixtureDir).then(
            () => {
                done(new Error("test failed"));
                toolsSandbox.restore();
            },
            (pErr) => {
                expect(pErr.toString()).to.contains("Failed to remove");
                done();
                toolsSandbox.restore();
                tools.removeDir(fixtureDir);
            }
        );
    });

    describe("removeDirs should", () => {
        it("remove multiple directories", (done) => {
            let fixtureDir, fixtureDirs;

            fixtureDirs = [];
            fixtureDir = TMP_DIR + PS + "multiple-dirs";

            if (!fs.existsSync(fixtureDir)) {
                fs.mkdirSync(fixtureDir, "0777");
                fixtureDirs.push(fixtureDir);
            }
            if (!fs.existsSync(fixtureDir + "1")) {
                fs.mkdirSync(fixtureDir + "1");
                fixtureDirs.push(fixtureDir + "1");
            }
            if (!fs.existsSync(fixtureDir + "2")) {
                fs.mkdirSync(fixtureDir + "2");
                fixtureDirs.push(fixtureDir + "2");
            }

            tools.removeDirs(fixtureDirs).then(
                () => {
                    done();
                },
                (pErr) => {
                    done(pErr);
                }
            );
        });
    });

    describe("saveFile should", () => {
        it("make file parent directory when it does not exists", (done) => {
            let fixture, fixtureDir;

            fixtureDir = TMP_DIR + PS + "save-dir";
            fixture = fixtureDir + PS + "saved.txt";

            tools.saveFile(fixture, "1", true).then(
                () => {
                    expect(fs.existsSync(fixture)).to.eq(true);
                    done();
                    tools.removeDir(fixtureDir);
                },
                (pErr) => {
                    done(pErr);
                }
            );
        });

        it("catch write error", (done) => {
            let fixture, fixtureDir;

            fixtureDir = TMP_DIR + PS + "save-dir";
            fixture = fixtureDir + PS + "write-error.txt";

            toolsSandbox.on(fs, ["writeFile"], (pArg1, pArg2, pArg3) => {
                pArg3("forced write error");
            });

            tools.saveFile(fixture, "1", true).then(
                () => {
                    done(new Error("test failed"));
                },
                (pErr) => {
                    expect(pErr.toString()).to.eq("forced write error");
                    done();
                }
            );
        });
    });

    describe("mkdir should", () => {
        it("make file parent directory when it does not exists", (done) => {
            let fixtureDir;

            fixtureDir = TMP_DIR + PS + "mkdDir" + PS + "dir1" + PS + "dir2";

            tools.makeDir(fixtureDir).then(
                () => {
                    assert.ok(true);
                    tools.removeDir(TMP_DIR + PS + "mkdDir");
                    done();
                }
            );
        });

        it("catch error when failing to make directory", (done) => {
            let fixtureDir;

            fixtureDir = TMP_DIR + PS + "sr-388";

            toolsSandbox.on(fs, ["existsSync"], (pArg1) => {
                return fixtureDir !== pArg1;
            });

            toolsSandbox.on(fs, ["mkdirSync"], () => {
                // do nothing.
            });

            tools.makeDir(fixtureDir).then(
                () => {},
                (pErr) => {
                    expect(pErr.toString()).to.contains("Could not make directory");
                    done();
                    toolsSandbox.restore();
                }
            );
        });
    });
});