"use strict";

var getWords = require("../stringProcessing/getWords.js");
var getSentences = require("../stringProcessing/getSentences.js");
var WordCombination = require("../values/WordCombination.js");
var normalizeQuotes = require("../stringProcessing/quotes.js").normalize;
var germanFunctionWords = require("../researches/german/functionWords.js");
var englishFunctionWords = require("../researches/english/functionWords.js");
var dutchFunctionWords = require("../researches/dutch/functionWords.js");
var spanishFunctionWords = require("../researches/spanish/functionWords.js");
var italianFunctionWords = require("../researches/italian/functionWords.js");
var frenchFunctionWords = require("../researches/french/functionWords.js");
var getLanguage = require("../helpers/getLanguage.js");
var filter = require("lodash/filter");
var map = require("lodash/map");
var forEach = require("lodash/forEach");
var has = require("lodash/has");
var flatMap = require("lodash/flatMap");
var values = require("lodash/values");
var take = require("lodash/take");
var includes = require("lodash/includes");
var intersection = require("lodash/intersection");
var isEmpty = require("lodash/isEmpty");
var densityLowerLimit = 0;
var densityUpperLimit = 0.03;
var relevantWordLimit = 100;
var wordCountLowerLimit = 200;
// First four characters: en dash, em dash, hyphen-minus, and copyright sign.
var specialCharacters = ["–", "—", "-", "\xA9", "#", "%", "/", "\\", "$", "€", "£", "*", "•", "|", "→", "←", "}", "{", "//", "||", "\u200B"];
/**
 * Returns the word combinations for the given text based on the combination size.
 *
 * @param {string} text The text to retrieve combinations for.
 * @param {number} combinationSize The size of the combinations to retrieve.
 * @param {Function} functionWords The function containing the lists of function words.
 * @returns {WordCombination[]} All word combinations for the given text.
 */
function getWordCombinations(text, combinationSize, functionWords) {
    var sentences = getSentences(text);
    var words = void 0,
        combination = void 0;
    return flatMap(sentences, function (sentence) {
        sentence = sentence.toLocaleLowerCase();
        sentence = normalizeQuotes(sentence);
        words = getWords(sentence);
        return filter(map(words, function (word, i) {
            // If there are still enough words in the sentence to slice of.
            if (i + combinationSize - 1 < words.length) {
                combination = words.slice(i, i + combinationSize);
                return new WordCombination(combination, 0, functionWords);
            }
            return false;
        }));
    });
}
/**
 * Calculates occurrences for a list of word combinations.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to calculate occurrences for.
 * @returns {WordCombination[]} Word combinations with their respective occurrences.
 */
function calculateOccurrences(wordCombinations) {
    var occurrences = {};
    forEach(wordCombinations, function (wordCombination) {
        var combination = wordCombination.getCombination();
        if (!has(occurrences, combination)) {
            occurrences[combination] = wordCombination;
        }
        occurrences[combination].incrementOccurrences();
    });
    return values(occurrences);
}
/**
 * Returns only the relevant combinations from a list of word combinations. Assumes
 * occurrences have already been calculated.
 *
 * @param {WordCombination[]} wordCombinations A list of word combinations.
 * @returns {WordCombination[]} Only relevant word combinations.
 */
function getRelevantCombinations(wordCombinations) {
    wordCombinations = wordCombinations.filter(function (combination) {
        return combination.getOccurrences() !== 1 && combination.getRelevance() !== 0;
    });
    return wordCombinations;
}
/**
 * Sorts combinations based on their relevance and length.
 *
 * @param {WordCombination[]} wordCombinations The combinations to sort.
 * @returns {void}
 */
function sortCombinations(wordCombinations) {
    wordCombinations.sort(function (combinationA, combinationB) {
        var difference = combinationB.getRelevance() - combinationA.getRelevance();
        // The combination with the highest relevance comes first.
        if (difference !== 0) {
            return difference;
        }
        // In case of a tie on relevance, the longest combination comes first.
        return combinationB.getLength() - combinationA.getLength();
    });
}
/**
 * Filters word combinations that consist of a single one-character word.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterOneCharacterWordCombinations(wordCombinations) {
    return wordCombinations.filter(function (combination) {
        return !(combination.getLength() === 1 && combination.getWords()[0].length <= 1);
    });
}
/**
 * Filters word combinations containing certain function words at any position.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAnywhere(wordCombinations, functionWords) {
    return wordCombinations.filter(function (combination) {
        return isEmpty(intersection(functionWords, combination.getWords()));
    });
}
/**
 * Filters word combinations beginning with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtBeginning(wordCombinations, functionWords) {
    return wordCombinations.filter(function (combination) {
        return !includes(functionWords, combination.getWords()[0]);
    });
}
/**
 * Filters word combinations ending with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtEnding(wordCombinations, functionWords) {
    return wordCombinations.filter(function (combination) {
        var words = combination.getWords();
        var lastWordIndex = words.length - 1;
        return !includes(functionWords, words[lastWordIndex]);
    });
}
/**
 * Filters word combinations beginning and ending with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {Array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtBeginningAndEnding(wordCombinations, functionWords) {
    wordCombinations = filterFunctionWordsAtBeginning(wordCombinations, functionWords);
    wordCombinations = filterFunctionWordsAtEnding(wordCombinations, functionWords);
    return wordCombinations;
}
/**
 * Filters word combinations based on keyword density if the word count is 200 or over.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {number} wordCount The number of words in the total text.
 * @param {number} densityLowerLimit The lower limit of keyword density.
 * @param {number} densityUpperLimit The upper limit of keyword density.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterOnDensity(wordCombinations, wordCount, densityLowerLimit, densityUpperLimit) {
    return wordCombinations.filter(function (combination) {
        return combination.getDensity(wordCount) >= densityLowerLimit && combination.getDensity(wordCount) < densityUpperLimit;
    });
}
/**
 * Filters the list of word combination objects based on the language-specific function word filters.
 * Word combinations with specific parts of speech are removed.
 *
 * @param {Array} combinations The list of word combination objects.
 * @param {Function} functionWords The function containing the lists of function words.
 * @returns {Array} The filtered list of word combination objects.
 */
function filterFunctionWords(combinations, functionWords) {
    combinations = filterFunctionWordsAnywhere(combinations, functionWords().filteredAnywhere);
    combinations = filterFunctionWordsAtBeginningAndEnding(combinations, functionWords().filteredAtBeginningAndEnding);
    combinations = filterFunctionWordsAtEnding(combinations, functionWords().filteredAtEnding);
    combinations = filterFunctionWordsAtBeginning(combinations, functionWords().filteredAtBeginning);
    return combinations;
}
/**
 * Filters the list of word combination objects based on function word filters, a special character filter and
 * a one-character filter.
 *
 * @param {Array} combinations The list of word combination objects.
 * @param {Function} functionWords The function containing the lists of function words.
 * @returns {Array} The filtered list of word combination objects.
 */
function filterCombinations(combinations, functionWords) {
    combinations = filterFunctionWordsAnywhere(combinations, specialCharacters);
    combinations = filterOneCharacterWordCombinations(combinations);
    combinations = filterFunctionWords(combinations, functionWords);
    return combinations;
}
/**
 * Returns the relevant words in a given text.
 *
 * @param {string} text The text to retrieve the relevant words of.
 * @param {string} locale The paper's locale.
 * @returns {WordCombination[]} All relevant words sorted and filtered for this text.
 */
function getRelevantWords(text, locale) {
    var functionWords = void 0;
    switch (getLanguage(locale)) {
        case "de":
            functionWords = germanFunctionWords;
            break;
        case "nl":
            functionWords = dutchFunctionWords;
            break;
        case "fr":
            functionWords = frenchFunctionWords;
            break;
        case "es":
            functionWords = spanishFunctionWords;
            break;
        case "it":
            functionWords = italianFunctionWords;
            break;
        default:
        case "en":
            functionWords = englishFunctionWords;
            break;
    }
    var words = getWordCombinations(text, 1, functionWords().all);
    var wordCount = words.length;
    var oneWordCombinations = getRelevantCombinations(calculateOccurrences(words));
    sortCombinations(oneWordCombinations);
    oneWordCombinations = take(oneWordCombinations, 100);
    var oneWordRelevanceMap = {};
    forEach(oneWordCombinations, function (combination) {
        oneWordRelevanceMap[combination.getCombination()] = combination.getRelevance(functionWords);
    });
    var twoWordCombinations = calculateOccurrences(getWordCombinations(text, 2, functionWords().all));
    var threeWordCombinations = calculateOccurrences(getWordCombinations(text, 3, functionWords().all));
    var fourWordCombinations = calculateOccurrences(getWordCombinations(text, 4, functionWords().all));
    var fiveWordCombinations = calculateOccurrences(getWordCombinations(text, 5, functionWords().all));
    var combinations = oneWordCombinations.concat(twoWordCombinations, threeWordCombinations, fourWordCombinations, fiveWordCombinations);
    combinations = filterCombinations(combinations, functionWords);
    forEach(combinations, function (combination) {
        combination.setRelevantWords(oneWordRelevanceMap);
    });
    combinations = getRelevantCombinations(combinations, wordCount);
    sortCombinations(combinations);
    if (wordCount >= wordCountLowerLimit) {
        combinations = filterOnDensity(combinations, wordCount, densityLowerLimit, densityUpperLimit);
    }
    return take(combinations, relevantWordLimit);
}
module.exports = {
    getWordCombinations: getWordCombinations,
    getRelevantWords: getRelevantWords,
    calculateOccurrences: calculateOccurrences,
    getRelevantCombinations: getRelevantCombinations,
    sortCombinations: sortCombinations,
    filterFunctionWordsAtEnding: filterFunctionWordsAtEnding,
    filterFunctionWordsAtBeginning: filterFunctionWordsAtBeginning,
    filterFunctionWords: filterFunctionWordsAtBeginningAndEnding,
    filterFunctionWordsAnywhere: filterFunctionWordsAnywhere,
    filterOnDensity: filterOnDensity,
    filterOneCharacterWordCombinations: filterOneCharacterWordCombinations
};
//# sourceMappingURL=relevantWords.js.map
//# sourceMappingURL=relevantWords.js.map
