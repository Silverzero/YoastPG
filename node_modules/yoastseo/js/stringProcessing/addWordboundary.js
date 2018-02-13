"use strict";
/** @module stringProcessing/addWordboundary */
/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {string} matchString The string to generate a regex string for.
 * @param {boolean} [positiveLookAhead] Boolean indicating whether or not to include a positive look ahead
 * for the word boundaries at the end.
 * @param {string} [extraWordBoundary] Extra characters to match a word boundary on.
 * @returns {string} A regex string that matches the matchString with word boundaries.
 */

module.exports = function (matchString) {
    var positiveLookAhead = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var extraWordBoundary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

    var wordBoundary, wordBoundaryStart, wordBoundaryEnd;
    wordBoundary = "[ \\u00a0\xA0\\n\\r\\t.,'()\"+-;!?:/\xBB\xAB\u2039\u203A" + extraWordBoundary + "<>]";
    wordBoundaryStart = "(^|" + wordBoundary + ")";
    if (positiveLookAhead) {
        wordBoundary = "(?=" + wordBoundary + ")";
    }
    wordBoundaryEnd = "($|" + wordBoundary + ")";
    return wordBoundaryStart + matchString + wordBoundaryEnd;
};
//# sourceMappingURL=addWordboundary.js.map
//# sourceMappingURL=addWordboundary.js.map
