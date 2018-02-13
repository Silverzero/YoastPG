"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var merge = require("lodash/merge");
/**
 * Assessment for calculating the length of the meta description.
 */

var MetaDescriptionLengthAssessment = function (_Assessment) {
    _inherits(MetaDescriptionLengthAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function MetaDescriptionLengthAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, MetaDescriptionLengthAssessment);

        var _this = _possibleConstructorReturn(this, (MetaDescriptionLengthAssessment.__proto__ || Object.getPrototypeOf(MetaDescriptionLengthAssessment)).call(this));

        var defaultConfig = {
            recommendedMaximumLength: 120,
            maximumLength: 320,
            scores: {
                noMetaDescription: 1,
                tooLong: 6,
                tooShort: 6,
                correctLength: 9
            }
        };
        _this.identifier = "metaDescriptionLength";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     * @param {object} i18n The object used for translations
     *
     * @returns {AssessmentResult} The assessment result.
     */


    _createClass(MetaDescriptionLengthAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var descriptionLength = researcher.getResearch("metaDescriptionLength");
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(this.calculateScore(descriptionLength));
            assessmentResult.setText(this.translateScore(descriptionLength, i18n));
            return assessmentResult;
        }
        /**
         * Returns the score for the descriptionLength.
         *
         * @param {number} descriptionLength The length of the metadescription.
         *
         * @returns {number} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(descriptionLength) {
            if (descriptionLength === 0) {
                return this._config.scores.noMetaDescription;
            }
            if (descriptionLength <= this._config.recommendedMaximumLength) {
                return this._config.scores.tooShort;
            }
            if (descriptionLength > this._config.maximumLength) {
                return this._config.scores.tooLong;
            }
            if (descriptionLength >= this._config.recommendedMaximumLength && descriptionLength <= this._config.maximumLength) {
                return this._config.scores.correctLength;
            }
            return 0;
        }
        /**
         * Translates the descriptionLength to a message the user can understand.
         *
         * @param {number} descriptionLength The length of the metadescription.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(descriptionLength, i18n) {
            if (descriptionLength === 0) {
                return i18n.dgettext("js-text-analysis", "No meta description has been specified. " + "Search engines will display copy from the page instead.");
            }
            if (descriptionLength <= this._config.recommendedMaximumLength) {
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "The meta description is under %1$d characters long. " + "However, up to %2$d characters are available."), this._config.recommendedMaximumLength, this._config.maximumLength);
            }
            if (descriptionLength > this._config.maximumLength) {
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "The meta description is over %1$d characters. " + "Reducing the length will ensure the entire description will be visible."), this._config.maximumLength);
            }
            if (descriptionLength >= this._config.recommendedMaximumLength && descriptionLength <= this._config.maximumLength) {
                return i18n.dgettext("js-text-analysis", "The meta description has a nice length.");
            }
        }
    }]);

    return MetaDescriptionLengthAssessment;
}(Assessment);

module.exports = MetaDescriptionLengthAssessment;
//# sourceMappingURL=metaDescriptionLengthAssessment.js.map
//# sourceMappingURL=metaDescriptionLengthAssessment.js.map
