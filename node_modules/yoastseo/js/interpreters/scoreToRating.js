"use strict";
/**
 * Interpreters a score and gives it a particular rating.
 *
 * @param {Number} score The score to interpreter.
 * @returns {string} The rating, given based on the score.
 */

var ScoreToRating = function ScoreToRating(score) {
    if (score === -1) {
        return "error";
    }
    if (score === 0) {
        return "feedback";
    }
    if (score <= 4) {
        return "bad";
    }
    if (score > 4 && score <= 7) {
        return "ok";
    }
    if (score > 7) {
        return "good";
    }
    return "";
};
module.exports = ScoreToRating;
//# sourceMappingURL=scoreToRating.js.map
//# sourceMappingURL=scoreToRating.js.map
