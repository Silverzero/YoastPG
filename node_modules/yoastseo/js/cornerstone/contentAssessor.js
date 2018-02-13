"use strict";

var Assessor = require("../assessor.js");
var ContentAssessor = require("../contentAssessor");
var fleschReadingEase = require("../assessments/readability/fleschReadingEaseAssessment.js");
var paragraphTooLong = require("../assessments/readability/paragraphTooLongAssessment.js");
var SentenceLengthInText = require("../assessments/readability/sentenceLengthInTextAssessment.js");
var SubheadingDistributionTooLong = require("../assessments/readability/subheadingDistributionTooLongAssessment.js");
var transitionWords = require("../assessments/readability/transitionWordsAssessment.js");
var passiveVoice = require("../assessments/readability/passiveVoiceAssessment.js");
var sentenceBeginnings = require("../assessments/readability/sentenceBeginningsAssessment.js");
var textPresence = require("../assessments/readability/textPresenceAssessment.js");
var contentConfiguration = require("./../config/content/combinedConfig.js");
/*
 Temporarily disabled:

 var wordComplexity = require( "./assessments/readability/wordComplexityAssessment.js" );
 var sentenceLengthInDescription = require( "./assessments/readability/sentenceLengthInDescriptionAssessment.js" );
 */
/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 * @param {string} options.locale The locale.
 *
 * @constructor
 */
var CornerStoneContentAssessor = function CornerStoneContentAssessor(i18n) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    Assessor.call(this, i18n, options);
    var locale = options.hasOwnProperty("locale") ? options.locale : "en_US";
    this._assessments = [fleschReadingEase, new SubheadingDistributionTooLong({
        slightlyTooMany: 250,
        farTooMany: 300,
        recommendedMaximumWordCount: 250
    }), paragraphTooLong, new SentenceLengthInText({
        recommendedWordCount: contentConfiguration(locale).sentenceLength.recommendedWordCount,
        slightlyTooMany: 20,
        farTooMany: 25
    }), transitionWords, passiveVoice, textPresence, sentenceBeginnings];
};
require("util").inherits(CornerStoneContentAssessor, ContentAssessor);
module.exports = CornerStoneContentAssessor;
//# sourceMappingURL=contentAssessor.js.map
//# sourceMappingURL=contentAssessor.js.map
