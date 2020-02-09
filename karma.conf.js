// Karma config
// https://karma-runner.github.io/0.12/config/configuration-file.html
// https://jstools.dev/karma-config/

"use strict";
const { karmaConfig } = require("karma-config");
let exclude = [];

if (process.env.WINDOWS && process.env.CI) {
    exclude.push(

    );
}

module.exports = karmaConfig({
    sourceDir: "src",
    fixtures: "test/fixtures/**/*.js",
    browsers: {
        chrome: true,
    },
    config: {
        exclude,
    }
});
