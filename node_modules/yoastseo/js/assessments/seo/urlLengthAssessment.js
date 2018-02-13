"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var merge = require("lodash/merge");
/**
 * Assessment that checks if the url is long enough.
 */

var UrlLengthAssessment = function (_Assessment) {
    _inherits(UrlLengthAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function UrlLengthAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, UrlLengthAssessment);

        var _this = _possibleConstructorReturn(this, (UrlLengthAssessment.__proto__ || Object.getPrototypeOf(UrlLengthAssessment)).call(this));

        var defaultConfig = {
            scores: {
                tooLong: 6
            }
        };
        _this.identifier = "urlLength";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Checks the length of the url.
     *
     * @param {Paper} paper The paper to run this assessment on.
     * @param {Researcher} researcher The researcher used for the assessment.
     * @param {object} i18n The i18n-object used for parsing translations.
     *
     * @returns {AssessmentResult} an AssessmentResult with the score and the formatted text.
     */


    _createClass(UrlLengthAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var urlIsTooLong = researcher.getResearch("urlLength");
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(this.calculateScore(urlIsTooLong));
            assessmentResult.setText(this.translateScore(urlIsTooLong, i18n));
            return assessmentResult;
        }
        /**
         * Checks whether the paper has a url.
         *
         * @param {Paper} paper The paper to use for the assessment.
         *
         * @returns {boolean} True when there is text.
         */

    }, {
        key: "isApplicable",
        value: function isApplicable(paper) {
            return paper.hasUrl();
        }
        /**
         * Calculates the score based on the url length.
         *
         * @param {boolean} urlIsTooLong True when the URL is too long.
         *
         * @returns {number|null} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(urlIsTooLong) {
            if (urlIsTooLong) {
                return this._config.scores.tooLong;
            }
            return null;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {boolean} urlIsTooLong True when the URL is too long.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(urlIsTooLong, i18n) {
            if (urlIsTooLong) {
                return i18n.dgettext("js-text-analysis", "The slug for this page is a bit long, consider shortening it.");
            }
            return "";
        }
    }]);

    return UrlLengthAssessment;
}(Assessment);

module.exports = UrlLengthAssessment;
//# sourceMappingURL=urlLengthAssessment.js.map
//# sourceMappingURL=urlLengthAssessment.js.map
