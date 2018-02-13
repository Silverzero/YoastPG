"use strict";
/** @module config/syllables */

var getLanguage = require("../helpers/getLanguage.js");
var isUndefined = require("lodash/isUndefined");
var de = require("./syllables/de.json");
var en = require('./syllables/en.json');
var nl = require('./syllables/nl.json');
var it = require('./syllables/it.json');
var languages = { de: de, nl: nl, en: en, it: it };
module.exports = function () {
    var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en_US";

    var language = getLanguage(locale);
    if (languages.hasOwnProperty(language)) {
        return languages[language];
    }
    // If an unknown locale is used, default to English.
    return languages["en"];
};
//# sourceMappingURL=syllables.js.map
//# sourceMappingURL=syllables.js.map
