"use strict";

var defaultsDeep = require("lodash/defaultsDeep");
var getLanguage = require("./../../helpers/getLanguage");
var defaultConfig = require("./default");
var it = require("./it");
var configurations = {
    it: it
};
module.exports = function (locale) {
    var language = getLanguage(locale);
    if (configurations.hasOwnProperty(language)) {
        return defaultsDeep(configurations[language], defaultConfig);
    }
    return defaultConfig;
};
//# sourceMappingURL=combinedConfig.js.map
//# sourceMappingURL=combinedConfig.js.map
