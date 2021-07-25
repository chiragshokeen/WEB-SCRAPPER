//request module in npm so install that in poc
let req = require("request" ) ; 
let ch = require('cheerio') ; 
const fs = require("fs") ; 


req('https://www.espncricinfo.com/series/ipl-2021-1249214/delhi-capitals-vs-kolkata-knight-riders-25th-match-1254082/full-scorecard' , cb ) ; 
function cb(error, response , data){

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
   // let venueElem =  fTool(".match-info.match-info-MATCH .description" ) ; 
    // console.log("venue" , venueElem.text() ) ; 
    // fs.writeFileSync("file.html" , data) ; 
    // console.log("file saved") ;
  
    let elems = fTool(".Collapsible") ;
  //  console.log(elems.length ) ; 
    let fullPageHTML = "" 
    //innings ka loop hai
    for(let i = 0 ; i < elems.length ; i++ ){
        // let html = fTool(elems[i]).html() ;
        // console.log(html)
        // fullPageHTML+= html+ "</br>" 
        let InningElement = fTool(elems[i] ) ;
        let teamName = InningElement.find("h5").text() ;
        let stringArr = teamName.split("INNING") ; 
        teamName = stringArr[0] ; 
      //  console.log("Team " ,i+1," " , teamName) ; 

      let playerRows = InningElement.find(".table.batsman tbody tr") ;
      //console.log(playerRows.length ) ;
      //player ka loop hai 
        for(let j = 0 ; j < playerRows.length ; j++ ){

            let colLength = fTool(playerRows[j]).find("td").length ; 
            if( colLength > 1){  // to rmeove commentary wali extra lines
                console.log(fTool(playerRows[j] ).text() ) ; 
            }

        }
        console.log("--------------------------------")

    }
  //  fs.writeFileSync("table.html" , fullPageHTML ) ; 
}