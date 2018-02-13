"use strict";

var firstWordExceptionsEnglish = require("../researches/english/firstWordExceptions.js");
var firstWordExceptionsGerman = require("../researches/german/firstWordExceptions.js");
var firstWordExceptionsSpanish = require("../researches/spanish/firstWordExceptions.js");
var firstWordExceptionsFrench = require("../researches/french/firstWordExceptions.js");
var firstWordExceptionsDutch = require("../researches/dutch/firstWordExceptions.js");
var firstWordExceptionsItalian = require("../researches/italian/firstWordExceptions.js");
var getLanguage = require("./getLanguage.js");
module.exports = function (locale) {
    switch (getLanguage(locale)) {
        case "de":
            return firstWordExceptionsGerman;
        case "fr":
            return firstWordExceptionsFrench;
        case "es":
            return firstWordExceptionsSpanish;
        case "nl":
            return firstWordExceptionsDutch;
        case "it":
            return firstWordExceptionsItalian;
        default:
        case "en":
            return firstWordExceptionsEnglish;
    }
};
//# sourceMappingURL=getFirstWordExceptions.js.map
//# sourceMappingURL=getFirstWordExceptions.js.map
