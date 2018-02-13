var express = require('express'),
    app = express(),
    striptags = require("striptags"),
    Researcher = require( "yoastseo" ).Researcher,
    Paper = require( "yoastseo" ).Paper;

app.get('/performance', function (request, response) {

    var text = request.query.text;

    if(text == null){
        response.json({
            success:false,
            info: 'params @text, @locale, @keyword[s], @description, @title, @url, @permaLink'
        });
    }
    else {
        var keyword = request.query.keyword.split(','),
            description = request.query.description,
            title = request.query.title,
            titleWidth = request.query.titleWidth,
            url = request.query.url,
            permalink = request.query.permalink,
            locale = request.query.locale,
            paper = new Paper(text, {
                locale: locale,
                description: description,
                title: title,
                titleWidth: titleWidth,
                url: url,
                permalink: permalink
            }),
            researcher = new Researcher(paper),
            result = {
                success:true,
                info:{
                    url_quality:processURL(researcher,keyword),
                    meta_description : processMetaDescription(researcher,keyword),
                    words_in_text:researcher.getResearch("wordCountInText"),
                    calculateFleschReading:researcher.getResearch("calculateFleschReading"),
                    getLinks:researcher.getResearch("getLinks"),
                    getLinkStatistics:researcher.getResearch("getLinkStatistics" ),
                    imageAltTags:researcher.getResearch("altTagCount"),
                    candidate_keywords:processKeywords(researcher),
                    keywords : []
                }
            };

        keyword.forEach(function (key) {
            researcher.setKeyword(key);
            var info_element = {
                keyword:key,
                keyword_density:researcher.getResearch("getKeywordDensity"),
                keyword_in_title:researcher.getResearch("findKeywordInPageTitle"),
                keyword_in_url:researcher.getResearch("keywordCountInUrl"),
                metaDescriptionKeyword:researcher.getResearch("metaDescriptionKeyword"),
                keyphraseLength:researcher.getResearch("keyphraseLength")
            };
            result.info.keywords.push(info_element);
        });

    }
    response.setHeader('Content-Type', 'application/json');
    response.json(result);

});

function processURL(researcher,keywords){

    if(!researcher.getResearch("urlLength")){
        return "La URL es demasiado larga";
    }else{
        var i = 0,
            stop = false;
        while(i < keywords.length && !stop){

            researcher.setKeyword(keywords[i]);
            if(researcher.getResearch("keywordCountInUrl") > 0){
               stop = true;
            }
            else i++;
        }
        if(i < keywords.length){
            var preposiciones = ['-a-','-ante-','-bajo-','-cabe-','-con-','-contra-','-de-','-desde-','-en-','-entre-','-hacia-','-hasta-','-para-','-por-','-segun-','-sin-','-so-','-sobre-','-tras-','-durante-','-mediante-','-excepto-','-salvo-','-incluso-','-mas-','-menos-','-eso-','-esa-','-esos-','-esas-','-esto-','-esta-','-estos-','-estas-','-aquello-','-aquella-','-aquellos-','-aquellas-','-el-','-la-','-los-','-las-'];
                j = 0,
                stop2 = false;
            while(j < preposiciones.length && !stop2){
                if(researcher.getPaper().getUrl().indexOf(preposiciones[j]) != -1){
                    stop2 = true;
                }
                else j++;
            }
            if(j < preposiciones.length){
                return "Hay preposiciones o determinantes en la URL";
            }
            else{
                return "La URL parece cumplir los patrones SEO";
            }
        }
        else{
            return "La URL no contiene ninguna Keyword";
        }
    }
};

function processMetaDescription(researcher,keywords){
    if(researcher.getResearch("metaDescriptionLength") > 156){
        return "Meta descripcion muy larga";
    }
    else{

        var count = 0;
        for(var i = 0 ; i < keywords.length; i++){
            researcher.setKeyword(keywords[i]);
            if(researcher.getResearch("metaDescriptionKeyword") > 0){
                count += 1;
            }
        }
        return count + " de " + keywords.length + " aparecen en la meta descripcion";
    }
}
;

function processKeywords(researcher){
    return researcher.getResearch("relevantWords")[0]._relevantWords;
};


app.listen(8080);

/*
sentences:researcher.getResearch("sentences"),
url:researcher.getResearch("urlLength"),
getWordComplexity:researcher.getResearch("wordComplexity"),
countLinks:researcher.getResearch("linkCount"),
countSentencesFromDescription:researcher.getResearch("countSentencesFromDescription"),
sentences_in_text:researcher.getResearch( "countSentencesFromText"),
imageCountInText:researcher.getResearch("imageCount"),
getPassiveVoice:researcher.getResearch("passiveVoice"),
getParagraphLength:researcher.getResearch("getParagraphLength"),
getSentenceBeginnings:researcher.getResearch("getSentenceBeginnings"),
getSubheadingTextLengths:researcher.getResearch("getSubheadingTextLengths"),
findTransitionWords:researcher.getResearch("findTransitionWords"),


Keyword_InFirstParagraph:researcher.getResearch("findKeywordInFirstParagraph"),
* */