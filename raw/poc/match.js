//request module in npm so install that in poc
let req = require("request" ) ; 
let ch = require('cheerio') ; 
const fs = require("fs") ; 
let path = require("path") ; 
let xlsx = require("xlsx") ; 



//req('https://www.espncricinfo.com/series/ipl-2021-1249214/delhi-capitals-vs-kolkata-knight-riders-25th-match-1254082/full-scorecard' , cb ) ; 

function processMatch(url){
  req(url , cb) ; 
}

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
        teamName = stringArr[0].trim() ; 
      //  console.log("Team " ,i+1," " , teamName) ; 

      let playerRows = InningElement.find(".table.batsman tbody tr") ;
      //console.log(playerRows.length ) ;
      //player ka loop hai 
        for(let j = 0 ; j < playerRows.length ; j++ ){

            // let colLength = fTool(playerRows[j]).find("td").length ; 
            // if( colLength > 1){  // to rmeove commentary wali extra lines
            //   //in this way one extra line of EXTRAS is coming which is not equired
            //     console.log(fTool(playerRows[j] ).text() ) ; 
            // }

            let cols = fTool(playerRows[j] ).find("td") ;
            let isAllowed = fTool(cols[0]).hasClass("batsman-cell") ;
            if(isAllowed){
              //console.log(fTool(playerRows[j]).text() ) ;
              let playerName = fTool(cols[0]).text().trim() ; 
              let runs = fTool(cols[2]).text().trim() ; 
              let balls =fTool(cols[3]).text().trim() ; 
              let fours = fTool(cols[5]).text().trim() ; 
              let sixes = fTool(cols[6]).text().trim() ;
              let strikerate = fTool(cols[7]).text().trim() ;   
             // console.log(` ${playerName} runs scored ${runs} in ${balls} ` ) ; new wat to print using backticks
             //this function appends the data in the required folder of the player in the required file
              processPlayer(playerName,runs,balls,fours,sixes,strikerate,teamName) ; 
            }

        }
        console.log("--------------------------------")

    }
  //  fs.writeFileSync("table.html" , fullPageHTML ) ; 
}

function processPlayer(playerName , runs,balls,fours,sixes , strikerate,teamName){

  playerObject={
    playerName:playerName,
    runs : runs,
    balls:balls,
    fours:fours,
    sixes:sixes,
    strikerate:strikerate,
    teamName:teamName
  }

  //create path first
  // if folder not present create folder create file append data
  //if folder present, chck for file, if file not present make file and append data
  //if file present folder present , just append data
  let dirExist = checkExistence(teamName) ;
  if(dirExist ){

  }else{
    createFolder(teamName) ; 
  }

  // file check
  let playerFileName = path.join( __dirname , teamName ,playerName +".xlsx");
  let fileExist = checkExistence(playerFileName);
  let playerEntries=[] ;
  if(fileExist ){
   
    //let binarydata = fs.readFileSync(playerFileName);
    //convert binarydata to array of objects by json parse
    let JSONdata = excelReader(playerFileName , playerName) ; 
    //playerEntries = JSON.parse(binarydata);
    playerEntries = JSONdata ; 
    playerEntries.push(playerObject) ; 
    //now this data comes in ram 
    //fs.writeFileSync(playerFileName,JSON.stringify(playerEntries));
    excelWriter(playerFileName , playerEntries , playerName) ; 

  }else{
    //create file and add data
    playerEntries.push( playerObject) ; 
   // fs.writeFileSync(playerFileName,JSON.stringify(playerEntries)); 
   excelWriter(playerFileName , playerEntries , playerName) ; 
    //if file exists then override other
    //wise creates a file and put the data
    //after this sabki ek ek entry aajyegi iss match ki in a file in json format

  }

}
function checkExistence(teamName){
  return fs.existsSync(teamName) ; 

}

function createFolder(teamName){
  fs.mkdirSync(teamName) ; 

}
function checkFile(playerFileName){
  // same as checkexistence so no need to write again call check existence

}

function excelReader(filePath, name) {
  if (!fs.existsSync(filePath)) {
      return null;
  }
  // workbook 
  let wt = xlsx.readFile(filePath);
  let excelData = wt.Sheets[name];
  let ans = xlsx.utils.sheet_to_json(excelData);
  return ans;
}

function excelWriter(filePath, json, name) {
  // console.log(xlsx.readFile(filePath));
  var newWB = xlsx.utils.book_new();
  // console.log(json);
  var newWS = xlsx.utils.json_to_sheet(json)
  xlsx.utils.book_append_sheet(newWB, newWS, name)//workbook name as param
  xlsx.writeFile(newWB, filePath);
}

module.exports = {
  processMatch : processMatch 
}