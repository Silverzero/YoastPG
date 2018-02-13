"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var inRange = require("lodash/inRange");
var merge = require("lodash/merge");
/**
 * Assessment that will test if the text is long enough.
 */

var TextLengthAssessment = function (_Assessment) {
    _inherits(TextLengthAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function TextLengthAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, TextLengthAssessment);

        var _this = _possibleConstructorReturn(this, (TextLengthAssessment.__proto__ || Object.getPrototypeOf(TextLengthAssessment)).call(this));

        var defaultConfig = {
            recommendedMinimum: 300,
            slightlyBelowMinimum: 250,
            belowMinimum: 200,
            veryFarBelowMinimum: 100,
            scores: {
                recommendedMinimum: 9,
                slightlyBelowMinimum: 6,
                belowMinimum: 3,
                farBelowMinimum: -10,
                veryFarBelowMinimum: -20
            }
        };
        _this.identifier = "textLength";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Execute the Assessment and return a result.
     *
     * @param {Paper} paper The Paper object to assess.
     * @param {Researcher} researcher The Researcher object containing all available researches.
     * @param {object} i18n The locale object.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */


    _createClass(TextLengthAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var wordCount = researcher.getResearch("wordCountInText");
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(this.calculateScore(wordCount));
            assessmentResult.setText(i18n.sprintf(this.translateScore(assessmentResult.getScore(), wordCount, i18n), wordCount, this._config.recommendedMinimum));
            return assessmentResult;
        }
        /**
         * Calculates the score based on the current word count.
         *
         * @param {number} wordCount The amount of words to be checked against.
          * @returns {number|null} The score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(wordCount) {
            if (wordCount >= this._config.recommendedMinimum) {
                return this._config.scores.recommendedMinimum;
            }
            if (inRange(wordCount, this._config.slightlyBelowMinimum, this._config.recommendedMinimum)) {
                return this._config.scores.slightlyBelowMinimum;
            }
            if (inRange(wordCount, this._config.belowMinimum, this._config.slightlyBelowMinimum)) {
                return this._config.scores.belowMinimum;
            }
            if (inRange(wordCount, this._config.veryFarBelowMinimum, this._config.belowMinimum)) {
                return this._config.scores.farBelowMinimum;
            }
            if (inRange(wordCount, 0, this._config.veryFarBelowMinimum)) {
                return this._config.scores.veryFarBelowMinimum;
            }
            return null;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {number} score The amount of words to be checked against.
         * @param {number} wordCount The amount of words.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(score, wordCount, i18n) {
            if (score === this._config.scores.recommendedMinimum) {
                return i18n.dngettext("js-text-analysis",
                /* Translators: %1$d expands to the number of words in the text */
                "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
                /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
                "This is more than or equal to the recommended minimum of %2$d word.", "This is more than or equal to the recommended minimum of %2$d words.", this._config.recommendedMinimum);
            }
            if (score === this._config.scores.slightlyBelowMinimum) {
                return i18n.dngettext("js-text-analysis",
                /* Translators: %1$d expands to the number of words in the text */
                "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
                /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
                "This is slightly below the recommended minimum of %2$d word. Add a bit more copy.", "This is slightly below the recommended minimum of %2$d words. Add a bit more copy.", this._config.recommendedMinimum);
            }
            if (score === this._config.scores.belowMinimum) {
                return i18n.dngettext("js-text-analysis",
                /* Translators: %1$d expands to the number of words in the text */
                "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
                /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
                "This is below the recommended minimum of %2$d word. Add more content that is relevant for the topic.", "This is below the recommended minimum of %2$d words. Add more content that is relevant for the topic.", this._config.recommendedMinimum);
            }
            if (score === this._config.scores.farBelowMinimum || score === this._config.scores.veryFarBelowMinimum) {
                return i18n.dngettext("js-text-analysis",
                /* Translators: %1$d expands to the number of words in the text */
                "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
                /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
                "This is far below the recommended minimum of %2$d word. Add more content that is relevant for the topic.", "This is far below the recommended minimum of %2$d words. Add more content that is relevant for the topic.", this._config.recommendedMinimum);
            }
            return "";
        }
    }]);

    return TextLengthAssessment;
}(Assessment);

module.exports = TextLengthAssessment;
//# sourceMappingURL=textLengthAssessment.js.map
//# sourceMappingURL=textLengthAssessment.js.map
