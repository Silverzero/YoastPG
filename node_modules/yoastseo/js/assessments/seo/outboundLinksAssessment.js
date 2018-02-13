"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var isEmpty = require("lodash/isEmpty");
var merge = require("lodash/merge");
/**
 * Assessment for calculating the outbound links in the text.
 */

var OutboundLinksAssessment = function (_Assessment) {
    _inherits(OutboundLinksAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function OutboundLinksAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, OutboundLinksAssessment);

        var _this = _possibleConstructorReturn(this, (OutboundLinksAssessment.__proto__ || Object.getPrototypeOf(OutboundLinksAssessment)).call(this));

        var defaultConfig = {
            scores: {
                noLinks: 6,
                allNofollowed: 7,
                moreNoFollowed: 8,
                allFollowed: 9
            }
        };
        _this.identifier = "externalLinks";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Runs the getLinkStatistics module, based on this returns an assessment result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     * @param {object} i18n The object used for translations
     *
     * @returns {AssessmentResult} The assessment result.
     */


    _createClass(OutboundLinksAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var linkStatistics = researcher.getResearch("getLinkStatistics");
            var assessmentResult = new AssessmentResult();
            if (!isEmpty(linkStatistics)) {
                assessmentResult.setScore(this.calculateScore(linkStatistics));
                assessmentResult.setText(this.translateScore(linkStatistics, i18n));
            }
            return assessmentResult;
        }
        /**
         * Checks whether paper has text.
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
         * Returns a score based on the linkStatistics object.
         *
         * @param {object} linkStatistics The object with all link statistics.
         *
         * @returns {number|null} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(linkStatistics) {
            if (linkStatistics.externalTotal === 0) {
                return this._config.scores.noLinks;
            }
            if (linkStatistics.externalNofollow === linkStatistics.total) {
                return this._config.scores.allNofollowed;
            }
            if (linkStatistics.externalNofollow < linkStatistics.externalTotal) {
                return this._config.scores.moreNoFollowed;
            }
            if (linkStatistics.externalDofollow === linkStatistics.total) {
                return this._config.scores.allFollowed;
            }
            return null;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {object} linkStatistics The object with all link statistics.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(linkStatistics, i18n) {
            if (linkStatistics.externalTotal === 0) {
                return i18n.dgettext("js-text-analysis", "No outbound links appear in this page, consider adding some as appropriate.");
            }
            if (linkStatistics.externalNofollow === linkStatistics.total) {
                /* Translators: %1$s expands the number of outbound links */
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s outbound link(s), all nofollowed."), linkStatistics.externalNofollow);
            }
            if (linkStatistics.externalNofollow < linkStatistics.externalTotal) {
                /* Translators: %1$s expands to the number of nofollow links, %2$s to the number of outbound links */
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s nofollowed outbound link(s) and %2$s normal outbound link(s)."), linkStatistics.externalNofollow, linkStatistics.externalDofollow);
            }
            if (linkStatistics.externalDofollow === linkStatistics.total) {
                /* Translators: %1$s expands to the number of outbound links */
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s outbound link(s)."), linkStatistics.externalTotal);
            }
            return "";
        }
    }]);

    return OutboundLinksAssessment;
}(Assessment);

module.exports = OutboundLinksAssessment;
//# sourceMappingURL=outboundLinksAssessment.js.map
//# sourceMappingURL=outboundLinksAssessment.js.map
