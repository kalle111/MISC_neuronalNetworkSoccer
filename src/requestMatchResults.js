const request = require('request-promise');
const fs = require('fs');
const path = require('path');

const bundesligaResultsYear = [];
const dt = new Date();
let requestUri = [];

for(i = 5; i < 20; i++) {
    let tempDomain = "https://www.openligadb.de/api/getmatchdata/bl1/"
    if(i >= 10) {
        tempDomain = tempDomain.concat("20").concat(i).concat("/");
    } else {
        tempDomain = tempDomain.concat("200").concat(i).concat("/");
    }
    requestUri.push(tempDomain);
}

if(requestUri.length > 0 && (!outputFileExists())) {
    // request Domains okay and outputfile does not exist thus far. 
    requestUri.forEach((ele) => {
        //each year to be requested per request-promsie
        let reqOptions = {
            uri: ele,
            json: true
        }
        request(reqOptions)
            .then(function(response) {
                //returns json format
                //further handling
                console.log(ele+" successfully requested with GET-Request.");
                let mainFolerDir = path.dirname(__dirname);
                let scraperOutputDir = mainFolerDir.concat('\\scraperOutput\\');
                let fileName = (dt.getDate().toString() + "-"  + dt.getMonth().toString() + "-" + dt.getFullYear().toString() + "_matchResults.json");
                try {
                    fs.writeFileSync(scraperOutputDir + fileName, JSON.stringify(response));
                } catch (err) {
                    console.error(err);
                }
            })
            .catch(function (err) {
                console.log("Error: " + err);
            });
    });
} else {
    //Either output file already exists or the array of domains is faulty. 
    console.log(">> No actions were taken. Either output file already exists or the array of domains is faulty.");
}


function outputFileExists() {
    let mainFolerDir = path.dirname(__dirname);
    let scraperOutputDir = mainFolerDir.concat('\\scraperOutput\\');
    let fileName = (dt.getDate().toString() + "-"  + dt.getMonth().toString() + "-" + dt.getFullYear().toString() + "_matchResults.json");

    try {
        if(fs.existsSync(scraperOutputDir + fileName)) {
            return true;
        }
    }catch(err) {
        console.error(err);
    }
    return false;
}