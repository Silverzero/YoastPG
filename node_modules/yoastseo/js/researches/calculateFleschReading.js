"use strict";
/** @module analyses/calculateFleschReading */

var stripNumbers = require("../stringProcessing/stripNumbers.js");
var countSentences = require("../stringProcessing/countSentences.js");
var countWords = require("../stringProcessing/countWords.js");
var countSyllables = require("../stringProcessing/syllables/count.js");
var formatNumber = require("../helpers/formatNumber.js");
var getLanguage = require("../helpers/getLanguage.js");
/**
 * Calculates an average from a total and an amount
 *
 * @param {number} total The total.
 * @param {number} amount The amount.
 * @returns {number} The average from the total and the amount.
 */
var getAverage = function getAverage(total, amount) {
    return total / amount;
};
/**
 * This calculates the flesch reading score for a given text.
 *
 * @param {object} paper The paper containing the text
 * @returns {number} The score of the flesch reading test
 */
module.exports = function (paper) {
    var score = void 0;
    var text = paper.getText();
    var locale = paper.getLocale();
    var language = getLanguage(locale);
    if (text === "") {
        return 0;
    }
    text = stripNumbers(text);
    var numberOfSentences = countSentences(text);
    var numberOfWords = countWords(text);
    // Prevent division by zero errors.
    if (numberOfSentences === 0 || numberOfWords === 0) {
        return 0;
    }
    var numberOfSyllables = countSyllables(text, locale);
    var averageWordsPerSentence = getAverage(numberOfWords, numberOfSentences);
    var syllablesPer100Words = numberOfSyllables * (100 / numberOfWords);
    switch (language) {
        case "nl":
            score = 206.84 - 0.77 * syllablesPer100Words - 0.93 * averageWordsPerSentence;
            break;
        case "de":
            score = 180 - averageWordsPerSentence - 58.5 * numberOfSyllables / numberOfWords;
            break;
        case "it":
            score = 217 - 1.3 * averageWordsPerSentence - 0.6 * syllablesPer100Words;
            break;
        case "en":
        default:
            score = 206.835 - 1.015 * averageWordsPerSentence - 84.6 * (numberOfSyllables / numberOfWords);
            break;
    }
    return formatNumber(score);
};
//# sourceMappingURL=calculateFleschReading.js.map
//# sourceMappingURL=calculateFleschReading.js.map
