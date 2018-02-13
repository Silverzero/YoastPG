"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var merge = require("lodash/merge");
/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */

var SubHeadingsKeywordAssessment = function (_Assessment) {
    _inherits(SubHeadingsKeywordAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function SubHeadingsKeywordAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, SubHeadingsKeywordAssessment);

        var _this = _possibleConstructorReturn(this, (SubHeadingsKeywordAssessment.__proto__ || Object.getPrototypeOf(SubHeadingsKeywordAssessment)).call(this));

        var defaultConfig = {
            scores: {
                noMatches: 6,
                oneMatch: 9,
                multipleMatches: 9
            }
        };
        _this.identifier = "subheadingsKeyword";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Runs the match keyword in subheadings module, based on this returns an assessment result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     * @param {object} i18n The object used for translations.
     *
     * @returns {AssessmentResult} The assessment result.
     */


    _createClass(SubHeadingsKeywordAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var subHeadings = researcher.getResearch("matchKeywordInSubheadings");
            var assessmentResult = new AssessmentResult();
            var score = this.calculateScore(subHeadings);
            assessmentResult.setScore(score);
            assessmentResult.setText(this.translateScore(score, subHeadings, i18n));
            return assessmentResult;
        }
        /**
         * Checks whether the paper has a text and a keyword.
         *
         * @param {Paper} paper The paper to use for the assessment.
         *
         * @returns {boolean} True when there is text and a keyword.
         */

    }, {
        key: "isApplicable",
        value: function isApplicable(paper) {
            return paper.hasText() && paper.hasKeyword();
        }
        /**
         * Returns the score for the subheadings.
         *
         * @param {object} subHeadings The object with all subHeadings matches.
         *
         * @returns {number|null} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(subHeadings) {
            if (subHeadings.matches === 0) {
                return this._config.scores.noMatches;
            }
            if (subHeadings.matches === 1) {
                return this._config.scores.oneMatch;
            }
            if (subHeadings.matches > 1) {
                return this._config.scores.multipleMatches;
            }
            return null;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {number} score The score for this assessment.
         * @param {object} subHeadings The object with all subHeadings matches.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(score, subHeadings, i18n) {
            if (score === this._config.scores.multipleMatches || score === this._config.scores.oneMatch) {
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "The focus keyword appears in %2$d (out of %1$d) subheadings in your copy."), subHeadings.count, subHeadings.matches);
            }
            if (score === this._config.scores.noMatches) {
                return i18n.dgettext("js-text-analysis", "You have not used the focus keyword in any subheading (such as an H2) in your copy.");
            }
            return "";
        }
    }]);

    return SubHeadingsKeywordAssessment;
}(Assessment);

module.exports = SubHeadingsKeywordAssessment;
//# sourceMappingURL=subheadingsKeywordAssessment.js.map
//# sourceMappingURL=subheadingsKeywordAssessment.js.map
