"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var merge = require("lodash/merge");
/**
 * Represents the URL keyword assessments. This assessments will check if the keyword is present in the url.
 */

var UrlKeywordAssessment = function (_Assessment) {
    _inherits(UrlKeywordAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function UrlKeywordAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, UrlKeywordAssessment);

        var _this = _possibleConstructorReturn(this, (UrlKeywordAssessment.__proto__ || Object.getPrototypeOf(UrlKeywordAssessment)).call(this));

        var defaultConfig = {
            scores: {
                noKeywordInUrl: 6
            }
        };
        _this.identifier = "urlKeyword";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Executes the Assessment and returns a result.
     *
     * @param {Paper} paper The Paper object to assess.
     * @param {Researcher} researcher The Researcher object containing all available researches.
     * @param {object} i18n The locale object.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */


    _createClass(UrlKeywordAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var totalKeywords = researcher.getResearch("keywordCountInUrl");
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(this.calculateScore(totalKeywords));
            assessmentResult.setText(this.translateScore(totalKeywords, i18n));
            return assessmentResult;
        }
        /**
         * Checks whether the paper has a keyword and a url.
         *
         * @param {Paper} paper The paper to use for the assessment.
         *
         * @returns {boolean} True when there is a keyword and an url.
         */

    }, {
        key: "isApplicable",
        value: function isApplicable(paper) {
            return paper.hasKeyword() && paper.hasUrl();
        }
        /**
         * Calculates the score based on whether or not there's a keyword in the url.
         *
         * @param {number} totalKeywords The amount of keywords to be checked against.
         *
         * @returns {number} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(totalKeywords) {
            if (totalKeywords === 0) {
                return this._config.scores.noKeywordInUrl;
            }
            return 9;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {number} totalKeywords The amount of keywords to be checked against.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(totalKeywords, i18n) {
            if (totalKeywords === 0) {
                return i18n.dgettext("js-text-analysis", "The focus keyword does not appear in the URL for this page. " + "If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!");
            }
            return i18n.dgettext("js-text-analysis", "The focus keyword appears in the URL for this page.");
        }
    }]);

    return UrlKeywordAssessment;
}(Assessment);

module.exports = UrlKeywordAssessment;
//# sourceMappingURL=urlKeywordAssessment.js.map
//# sourceMappingURL=urlKeywordAssessment.js.map
