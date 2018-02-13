"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var countTooLongSentences = require("../../assessmentHelpers/checkForTooLongSentences.js");
var formatNumber = require("../../helpers/formatNumber.js");
var inRange = require("../../helpers/inRange.js").inRangeEndInclusive;
var stripTags = require("../../stringProcessing/stripHTMLTags").stripIncompleteTags;
var Mark = require("../../values/Mark.js");
var addMark = require("../../markers/addMark.js");
var map = require("lodash/map");
var merge = require("lodash/merge");
/**
 * Represents the assessment that will calculate the length of sentences in the text.
 */

var SentenceLengthInTextAssessment = function (_Assessment) {
    _inherits(SentenceLengthInTextAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     * @returns {void}
     */
    function SentenceLengthInTextAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, SentenceLengthInTextAssessment);

        var _this = _possibleConstructorReturn(this, (SentenceLengthInTextAssessment.__proto__ || Object.getPrototypeOf(SentenceLengthInTextAssessment)).call(this));

        var defaultConfig = {
            recommendedWordCount: 20,
            slightlyTooMany: 25,
            farTooMany: 30
        };
        _this.identifier = "textSentenceLength";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Scores the percentage of sentences including more than the recommended number of words.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     * @param {object} i18n The object used for translations.
     * @returns {AssessmentResult} The Assessment result.
     */


    _createClass(SentenceLengthInTextAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var sentences = researcher.getResearch("countSentencesFromText");
            var percentage = this.calculatePercentage(sentences);
            var score = this.calculateScore(percentage);
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(score);
            assessmentResult.setText(this.translateScore(score, percentage, i18n));
            assessmentResult.setHasMarks(percentage > 0);
            return assessmentResult;
        }
        /**
         * Checks whether the paper has text.
         *
         * @param {Paper} paper The paper to use for the assessment.
         *
         * @returns {boolean} True when there is text.
         */

    }, {
        key: "isApplicable",
        value: function isApplicable(paper) {
            return paper.hasText();
        }
        /**
         * Mark the sentences.
         *
         * @param {Paper} paper The paper to use for the marking.
         * @param {Researcher} researcher The researcher to use.
         *
         * @returns {Array} Array with all the marked sentences.
         */

    }, {
        key: "getMarks",
        value: function getMarks(paper, researcher) {
            var sentenceCount = researcher.getResearch("countSentencesFromText");
            var sentenceObjects = this.getTooLongSentences(sentenceCount);
            return map(sentenceObjects, function (sentenceObject) {
                var sentence = stripTags(sentenceObject.sentence);
                return new Mark({
                    original: sentence,
                    marked: addMark(sentence)
                });
            });
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {number} score The score.
         * @param {number} percentage The percentage.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} A string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(score, percentage, i18n) {
            var sentenceLengthURL = "<a href='https://yoa.st/short-sentences' target='_blank'>";
            if (score >= 7) {
                return i18n.sprintf(i18n.dgettext("js-text-analysis",
                // Translators: %1$d expands to percentage of sentences, %2$s expands to a link on yoast.com,
                // %3$s expands to the recommended maximum sentence length, %4$s expands to the anchor end tag,
                // %5$s expands to the recommended maximum percentage.
                "%1$s of the sentences contain %2$smore than %3$s words%4$s, which is less than or equal to the recommended maximum of %5$s."), percentage + "%", sentenceLengthURL, this._config.recommendedWordCount, "</a>", this._config.slightlyTooMany + "%");
            }
            return i18n.sprintf(i18n.dgettext("js-text-analysis",
            // Translators: %1$d expands to percentage of sentences, %2$s expands to a link on yoast.com,
            // %3$s expands to the recommended maximum sentence length, %4$s expands to the anchor end tag,
            // %5$s expands to the recommended maximum percentage.
            "%1$s of the sentences contain %2$smore than %3$s words%4$s, which is more than the recommended maximum of %5$s. " + "Try to shorten the sentences."), percentage + "%", sentenceLengthURL, this._config.recommendedWordCount, "</a>", this._config.slightlyTooMany + "%");
        }
        /**
         * Calculates the percentage of sentences that are too long.
         *
         * @param {Array} sentences The sentences to calculate the percentage for.
         * @returns {number} The calculates percentage of too long sentences.
         */

    }, {
        key: "calculatePercentage",
        value: function calculatePercentage(sentences) {
            var percentage = 0;
            if (sentences.length !== 0) {
                var tooLongTotal = this.countTooLongSentences(sentences);
                percentage = formatNumber(tooLongTotal / sentences.length * 100);
            }
            return percentage;
        }
        /**
         * Calculates the score for the given percentage.
         *
         * @param {number} percentage The percentage to calculate the score for.
         * @returns {number} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(percentage) {
            var score = void 0;
            // Green indicator.
            if (percentage <= this._config.slightlyTooMany) {
                score = 9;
            }
            // Orange indicator.
            if (inRange(percentage, this._config.slightlyTooMany, this._config.farTooMany)) {
                score = 6;
            }
            // Red indicator.
            if (percentage > this._config.farTooMany) {
                score = 3;
            }
            return score;
        }
        /**
         * Gets the sentences that are qualified as being too long.
         *
         * @param {array} sentences The sentences to filter through.
         * @returns {array} Array with all the sentences considered to be too long.
         */

    }, {
        key: "getTooLongSentences",
        value: function getTooLongSentences(sentences) {
            return countTooLongSentences(sentences, this._config.recommendedWordCount);
        }
        /**
         * Get the total amount of sentences that are qualified as being too long.
         *
         * @param {Array} sentences The sentences to filter through.
         * @returns {Number} The amount of sentences that are considered too long.
         */

    }, {
        key: "countTooLongSentences",
        value: function countTooLongSentences(sentences) {
            return this.getTooLongSentences(sentences).length;
        }
    }]);

    return SentenceLengthInTextAssessment;
}(Assessment);

module.exports = SentenceLengthInTextAssessment;
//# sourceMappingURL=sentenceLengthInTextAssessment.js.map
//# sourceMappingURL=sentenceLengthInTextAssessment.js.map
