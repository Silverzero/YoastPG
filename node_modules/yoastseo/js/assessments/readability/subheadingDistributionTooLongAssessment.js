"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var isTextTooLong = require("../../helpers/isValueTooLong");
var filter = require("lodash/filter");
var map = require("lodash/map");
var merge = require("lodash/merge");
var Mark = require("../../values/Mark.js");
var marker = require("../../markers/addMark.js");
var inRange = require("../../helpers/inRange.js").inRangeEndInclusive;
/**
 * Represents the assessment for calculating the text after each subheading.
 */

var SubheadingsDistributionTooLong = function (_Assessment) {
    _inherits(SubheadingsDistributionTooLong, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     * @returns {void}
     */
    function SubheadingsDistributionTooLong() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, SubheadingsDistributionTooLong);

        var _this = _possibleConstructorReturn(this, (SubheadingsDistributionTooLong.__proto__ || Object.getPrototypeOf(SubheadingsDistributionTooLong)).call(this));

        var defaultConfig = {
            // The maximum recommended value of the subheading text.
            recommendedMaximumWordCount: 300,
            slightlyTooMany: 300,
            farTooMany: 350
        };
        _this.identifier = "subheadingsTooLong";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Runs the getSubheadingTextLength research and checks scores based on length.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     * @param {object} i18n The object used for translations.
     *
     * @returns {AssessmentResult} The assessment result.
     */


    _createClass(SubheadingsDistributionTooLong, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var subheadingTextsLength = researcher.getResearch("getSubheadingTextLengths");
            subheadingTextsLength = subheadingTextsLength.sort(function (a, b) {
                return b.wordCount - a.wordCount;
            });
            var tooLongTexts = this.getTooLongSubheadingTexts(subheadingTextsLength).length;
            var score = this.calculateScore(subheadingTextsLength);
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(score);
            assessmentResult.setText(this.translateScore(score, tooLongTexts, i18n));
            assessmentResult.setHasMarks(score > 2 && score < 7);
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
         * Creates a marker for each text following a subheading that is too long.
         * @param {Paper} paper The paper to use for the assessment.
         * @param {object} researcher The researcher used for calling research.
         * @returns {Array} All markers for the current text.
         */

    }, {
        key: "getMarks",
        value: function getMarks(paper, researcher) {
            var subheadingTextsLength = researcher.getResearch("getSubheadingTextLengths");
            var tooLongTexts = this.getTooLongSubheadingTexts(subheadingTextsLength);
            return map(tooLongTexts, function (tooLongText) {
                var marked = marker(tooLongText.text);
                return new Mark({
                    original: tooLongText.text,
                    marked: marked
                });
            });
        }
        /**
         * Counts the number of subheading texts that are too long.
         *
         * @param {Array} subheadingTextsLength Array with subheading text lengths.
         * @returns {number} The number of subheading texts that are too long.
         */

    }, {
        key: "getTooLongSubheadingTexts",
        value: function getTooLongSubheadingTexts(subheadingTextsLength) {
            return filter(subheadingTextsLength, function (subheading) {
                return isTextTooLong(this._config.recommendedMaximumWordCount, subheading.wordCount);
            }.bind(this));
        }
        /**
         * Calculates the score based on the subheading texts length.
         *
         * @param {Array} subheadingTextsLength Array with subheading text lengths.
         * @returns {number} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(subheadingTextsLength) {
            var score = void 0;
            if (subheadingTextsLength.length === 0) {
                // Red indicator, use '2' so we can differentiate in external analysis.
                return 2;
            }
            var longestSubheadingTextLength = subheadingTextsLength[0].wordCount;
            // Green indicator.
            if (longestSubheadingTextLength <= this._config.slightlyTooMany) {
                score = 9;
            }
            // Orange indicator.
            if (inRange(longestSubheadingTextLength, this._config.slightlyTooMany, this._config.farTooMany)) {
                score = 6;
            }
            // Red indicator.
            if (longestSubheadingTextLength > this._config.farTooMany) {
                score = 3;
            }
            return score;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {number} score The score.
         * @param {number} tooLongTexts The amount of too long texts.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} A string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(score, tooLongTexts, i18n) {
            if (score === 2) {
                // Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag.
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "The text does not contain any %1$ssubheadings%2$s. Add at least one subheading."), "<a href='https://yoa.st/headings' target='_blank'>", "</a>");
            }
            if (score >= 7) {
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "The amount of words following each of the subheadings doesn't exceed the recommended maximum of %1$d words, which is great."), this._config.recommendedMaximumWordCount);
            }
            // Translators: %1$d expands to the number of subheadings, %2$d expands to the recommended value
            return i18n.sprintf(i18n.dngettext("js-text-analysis", "%1$d subheading is followed by more than the recommended maximum of %2$d words. Try to insert another subheading.", "%1$d of the subheadings are followed by more than the recommended maximum of %2$d words. Try to insert additional subheadings.", tooLongTexts), tooLongTexts, this._config.recommendedMaximumWordCount);
        }
    }]);

    return SubheadingsDistributionTooLong;
}(Assessment);

module.exports = SubheadingsDistributionTooLong;
//# sourceMappingURL=subheadingDistributionTooLongAssessment.js.map
//# sourceMappingURL=subheadingDistributionTooLongAssessment.js.map
