var buster = require("buster");
var proxyquire = require("proxyquire");
var assert = buster.referee.assert;

buster.testCase("Multi-glob", {
    "setUp": function () {
        this.nodeGlobStub = this.stub();
        this.multiGlob = proxyquire("../lib/multi-glob.js", {
            glob: this.nodeGlobStub
        });
    },

    "calls glob with pattern": function () {
        this.multiGlob.glob("lib/buster.js");

        assert.calledOnceWith(this.nodeGlobStub, "lib/buster.js");
    },

    "calls glob with provided options": function () {
        var args = { silent: true };
        this.multiGlob.glob("lib/buster.js", args);

        assert.calledOnceWith(this.nodeGlobStub, "lib/buster.js", args);
    },

    "calls glob with empty options when none are provided": function () {
        this.multiGlob.glob("lib/buster.js");

        assert.equals(this.nodeGlobStub.args[0].length, 3);
        assert.isFunction(this.nodeGlobStub.args[0][2]);
    },

    "calls glob once with each pattern": function () {
        this.multiGlob.glob(["lib/buster.js", "src/buster.js"]);

        assert.calledTwice(this.nodeGlobStub);
        assert.calledWith(this.nodeGlobStub, "lib/buster.js");
        assert.calledWith(this.nodeGlobStub, "src/buster.js");
    },

    "calls callback with result from glob": function (done) {
        var callback = this.spy();
        this.nodeGlobStub.yields(null, ["lib/buster.js"]);

        this.multiGlob.glob("lib/buster.js", function (err, res) {
            assert.isNull(err);
            assert.equals(res, ["lib/buster.js"]);
            done();
        });
    },

    "calls callback with combined results from glob": function (done) {
        this.nodeGlobStub.withArgs("lib/buster.js").yields(null, ["lib/buster.js"]);
        var files = ["src/buster.js", "src/stuff.js"];
        this.nodeGlobStub.withArgs("src/*.js").yields(null, files);

        this.multiGlob.glob(["lib/buster.js", "src/*.js"], function (err, res) {
            assert.isNull(err);
            assert.equals(res, ["lib/buster.js", "src/buster.js", "src/stuff.js"]);
            done();
        });
    },

    "calls callback once with glob error": function (done) {
        this.nodeGlobStub.withArgs("lib/buster.js").yields({ message: "Oh no" });
        var files = ["src/buster.js", "src/stuff.js"];
        this.nodeGlobStub.withArgs("src/*.js").yields(null, files);

        this.multiGlob.glob(["lib/buster.js", "src/*.js"], function (err) {
            assert.equals(err, { message: "Oh no" });
            done();
        });
    },

    "ignore duplicated items from glob": function (done) {
        this.nodeGlobStub.withArgs("src/foo.js").yields(null, ["src/foo.js"]);
        var files = ["src/foo.js", "src/bar.js"];
        this.nodeGlobStub.withArgs("src/*.js").yields(null, files);

        this.multiGlob.glob(["src/foo.js", "src/*.js"], function (err, res) {
            assert.isNull(err);
            assert.equals(res, ["src/foo.js", "src/bar.js"]);
            done();
        });
    },

    "strict": {
        "fails on glob that matches no patterns": function (done) {
            this.nodeGlobStub.withArgs("src/foo.js").yields(null, []);

            this.multiGlob.glob(["src/foo.js"], { strict: true }, function (err) {
                assert.match(err, {
                    message: "'src/foo.js' matched no files"
                });
                done()
            });
        }
    }
});
