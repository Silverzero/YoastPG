"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var inRange = require("../../helpers/inRange").inRangeEndInclusive;
var merge = require("lodash/merge");
/**
 * Represents the assessmenth that will calculate if the width of the page title is correct.
 */

var PageTitleWidthAssesment = function (_Assessment) {
    _inherits(PageTitleWidthAssesment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function PageTitleWidthAssesment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, PageTitleWidthAssesment);

        var _this = _possibleConstructorReturn(this, (PageTitleWidthAssesment.__proto__ || Object.getPrototypeOf(PageTitleWidthAssesment)).call(this));

        var defaultConfig = {
            minLength: 400,
            maxLength: 600,
            scores: {
                noTitle: 1,
                widthTooShort: 6,
                widthTooLong: 6,
                widthCorrect: 9
            }
        };
        _this.identifier = "titleWidth";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Runs the pageTitleWidth module, based on this returns an assessment result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     * @param {object} i18n The object used for translations
     *
     * @returns {AssessmentResult} The assessment result.
     */


    _createClass(PageTitleWidthAssesment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var pageTitleWidth = researcher.getResearch("pageTitleWidth");
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(this.calculateScore(pageTitleWidth));
            assessmentResult.setText(this.translateScore(pageTitleWidth, i18n));
            return assessmentResult;
        }
        /**
         * Returns the score for the pageTitleWidth
         *
         * @param {number} pageTitleWidth The width of the pageTitle.
         *
         * @returns {number} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(pageTitleWidth) {
            if (inRange(pageTitleWidth, 1, 400)) {
                return this._config.scores.widthTooShort;
            }
            if (inRange(pageTitleWidth, this._config.minLength, this._config.maxLength)) {
                return this._config.scores.widthCorrect;
            }
            if (pageTitleWidth > this._config.maxLength) {
                return this._config.scores.widthTooLong;
            }
            return this._config.scores.noTitle;
        }
        /**
         * Translates the pageTitleWidth score to a message the user can understand.
         *
         * @param {number} pageTitleWidth The width of the pageTitle.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(pageTitleWidth, i18n) {
            if (inRange(pageTitleWidth, 1, 400)) {
                return i18n.dgettext("js-text-analysis", "The SEO title is too short. Use the space to add keyword variations or create compelling call-to-action copy.");
            }
            if (inRange(pageTitleWidth, this._config.minLength, this._config.maxLength)) {
                return i18n.dgettext("js-text-analysis", "The SEO title has a nice length.");
            }
            if (pageTitleWidth > this._config.maxLength) {
                return i18n.dgettext("js-text-analysis", "The SEO title is wider than the viewable limit.");
            }
            return i18n.dgettext("js-text-analysis", "Please create an SEO title.");
        }
    }]);

    return PageTitleWidthAssesment;
}(Assessment);

module.exports = PageTitleWidthAssesment;
//# sourceMappingURL=pageTitleWidthAssessment.js.map
//# sourceMappingURL=pageTitleWidthAssessment.js.map
