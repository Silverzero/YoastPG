"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var merge = require("lodash/merge");
/**
 * Represents the assessment that will look if the images have alt-tags and checks if the keyword is present in one of them.
 */

var TextImagesAssessment = function (_Assessment) {
    _inherits(TextImagesAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function TextImagesAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, TextImagesAssessment);

        var _this = _possibleConstructorReturn(this, (TextImagesAssessment.__proto__ || Object.getPrototypeOf(TextImagesAssessment)).call(this));

        var defaultConfig = {
            scores: {
                noImages: 3,
                withAltKeyword: 9,
                withAltNonKeyword: 6,
                withAlt: 6,
                noAlt: 6
            }
        };
        _this.identifier = "textImages";
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


    _createClass(TextImagesAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var assessmentResult = new AssessmentResult();
            var imageCount = researcher.getResearch("imageCount");
            var altProperties = researcher.getResearch("altTagCount");
            assessmentResult.setScore(this.calculateScore(imageCount, altProperties));
            assessmentResult.setText(this.translateScore(imageCount, altProperties, i18n));
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
         * Calculate the score based on the current image count and current image alt-tag count.
         *
         * @param {number} imageCount The amount of images to be checked against.
         * @param {object} altProperties An object containing the various alt-tags.
         *
         * @returns {number} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(imageCount, altProperties) {
            if (imageCount === 0) {
                return this._config.scores.noImages;
            }
            // Has alt-tag and keywords
            if (altProperties.withAltKeyword > 0) {
                return this._config.scores.withAltKeyword;
            }
            // Has alt-tag, but no keywords and it's not okay
            if (altProperties.withAltNonKeyword > 0) {
                return this._config.scores.withAltNonKeyword;
            }
            // Has alt-tag, but no keyword is set
            if (altProperties.withAlt > 0) {
                return this._config.scores.withAlt;
            }
            // Has no alt-tag
            if (altProperties.noAlt > 0) {
                return this._config.scores.noAlt;
            }
            return null;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {number} imageCount The amount of images to be checked against.
         * @param {object} altProperties An object containing the various alt-tags.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(imageCount, altProperties, i18n) {
            if (imageCount === 0) {
                return i18n.dgettext("js-text-analysis", "No images appear in this page, consider adding some as appropriate.");
            }
            // Has alt-tag and keywords
            if (altProperties.withAltKeyword > 0) {
                return i18n.dgettext("js-text-analysis", "The images on this page contain alt attributes with the focus keyword.");
            }
            // Has alt-tag, but no keywords and it's not okay
            if (altProperties.withAltNonKeyword > 0) {
                return i18n.dgettext("js-text-analysis", "The images on this page do not have alt attributes containing the focus keyword.");
            }
            // Has alt-tag, but no keyword is set
            if (altProperties.withAlt > 0) {
                return i18n.dgettext("js-text-analysis", "The images on this page contain alt attributes.");
            }
            // Has no alt-tag
            if (altProperties.noAlt > 0) {
                return i18n.dgettext("js-text-analysis", "The images on this page are missing alt attributes.");
            }
            return "";
        }
    }]);

    return TextImagesAssessment;
}(Assessment);

module.exports = TextImagesAssessment;
//# sourceMappingURL=textImagesAssessment.js.map
//# sourceMappingURL=textImagesAssessment.js.map
