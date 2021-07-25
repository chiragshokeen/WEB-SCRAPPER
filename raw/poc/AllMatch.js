let req = require("request" ) ; 
let ch = require('cheerio') ; 
const fs = require("fs") ; 
let path = require("path") ; 
//const { request } = require("http");
let match = require("./match.js")

let url = 'http://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results' 
req(url , cb) ;
function cb(error , response , data){

    if(response.statusCode == 404 ){
        console.log("Page not found" ) ;
    }else if(response.statusCode == 200 ){
        //console.log(data) ;
        parseHTML(data) ; 

    }else{
        console.log(err) ; 
    }

}
function parseHTML(data){
    let fTool = ch.load(data) ; 
    let AllScorecardEle = fTool('a[data-hover="Scorecard"]' ) ; 
    //console.log(AllScorecardEle.length) ; 

    for(let i = 0 ; i < AllScorecardEle.length ; i++ ){
        let url = fTool( AllScorecardEle[i]).attr("href") ; //this wont give full url, starting ka missing hoga 
        // like this /series/ipl-2021-1249214/mumbai-indians-vs-royal-challengers-bangalore-1st-match-1254058/full-scorecard
        let fullUrl = "https://www.espncricinfo.com"+ url ;
        match.processMatch(fullUrl) ; 
    }

}