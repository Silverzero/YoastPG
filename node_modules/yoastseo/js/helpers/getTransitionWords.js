"use strict";

var transitionWordsEnglish = require("../researches/english/transitionWords.js")().allWords;
var twoPartTransitionWordsEnglish = require("../researches/english/twoPartTransitionWords.js");
var transitionWordsGerman = require("../researches/german/transitionWords.js")().allWords;
var twoPartTransitionWordsGerman = require("../researches/german/twoPartTransitionWords.js");
var transitionWordsFrench = require("../researches/french/transitionWords.js")().allWords;
var twoPartTransitionWordsFrench = require("../researches/french/twoPartTransitionWords.js");
var transitionWordsSpanish = require("../researches/spanish/transitionWords.js")().allWords;
var twoPartTransitionWordsSpanish = require("../researches/spanish/twoPartTransitionWords.js");
var transitionWordsDutch = require("../researches/dutch/transitionWords.js")().allWords;
var twoPartTransitionWordsDutch = require("../researches/dutch/twoPartTransitionWords.js");
var transitionWordsItalian = require("../researches/italian/transitionWords.js")().allWords;
var twoPartTransitionWordsItalian = require("../researches/italian/twoPartTransitionWords.js");
var getLanguage = require("./getLanguage.js");
module.exports = function (locale) {
    switch (getLanguage(locale)) {
        case "de":
            return {
                transitionWords: transitionWordsGerman,
                twoPartTransitionWords: twoPartTransitionWordsGerman
            };
        case "es":
            return {
                transitionWords: transitionWordsSpanish,
                twoPartTransitionWords: twoPartTransitionWordsSpanish
            };
        case "fr":
            return {
                transitionWords: transitionWordsFrench,
                twoPartTransitionWords: twoPartTransitionWordsFrench
            };
        case "nl":
            return {
                transitionWords: transitionWordsDutch,
                twoPartTransitionWords: twoPartTransitionWordsDutch
            };
        case "it":
            return {
                transitionWords: transitionWordsItalian,
                twoPartTransitionWords: twoPartTransitionWordsItalian
            };
        default:
        case "en":
            return {
                transitionWords: transitionWordsEnglish,
                twoPartTransitionWords: twoPartTransitionWordsEnglish
            };
    }
};
//# sourceMappingURL=getTransitionWords.js.map
//# sourceMappingURL=getTransitionWords.js.map
