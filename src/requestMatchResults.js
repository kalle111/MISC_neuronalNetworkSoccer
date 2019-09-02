//required libs
const request = require('request-promise');
const fs = require('fs');
const path = require('path');

//used variables/constants
const dt = new Date();
let requestUri = [];

//Creates all API URIs
for (i = 5; i < 20; i++) {
    let tempDomain = "https://www.openligadb.de/api/getmatchdata/bl1/"
    if (i >= 10) {
        tempDomain = tempDomain.concat("20").concat(i).concat("/");
    } else {
        tempDomain = tempDomain.concat("200").concat(i).concat("/");
    }
    requestUri.push(tempDomain);
}
//console.log(requestUri);


//checks existence of URIs and if there's an existing set of data in the output folder
if (requestUri.length > 0 && (!outputFileExists())) {
    // URIs ok, fileName doesn't exist thus far
    var data = [];
    var dataPromises = [];
    requestUri.forEach((ele) => {
        let reqOptions = {
            uri: ele,
            json: true
        }
        //returnData creates HTTP-Request-Promise with reqOptions as parameter => pushed in Promise-Array
        // dataPromises.push(returnData(reqOptions).then(function (returnedData) {
        //     return returnedData;
        // }));

        dataPromises.push(
            request(reqOptions)
        );
    })
    Promise.all(dataPromises).then(function () {
        //When all promises are resolved:
        dataPromises.forEach(function (prom) {
            //Check whether Request was successfull or not
            if (prom.responseContent.statusCode === 200) {
                prom.responseContent.body.forEach(function (matchInResponse) {
                    //push each  match to data final data arrray 
                    data.push(matchInResponse);
                });
            }
        });

        //When data array is filled:
        //Get output directory and write to file synchronously
        let mainFolerDir = path.dirname(__dirname);
        let scraperOutputDir = mainFolerDir.concat('\\scraperOutput\\');
        let fileName = (dt.getDate().toString() + "-" + dt.getMonth().toString() + "-" + dt.getFullYear().toString() + "_matchResults.json");
        try {
            fs.writeFileSync(scraperOutputDir + fileName, JSON.stringify(data));
        } catch (err) {
            console.error(err);
        }
    });



} else {
    //Either output file already exists or the array of domains is faulty. 
    console.log(">> No actions were taken. Either output file already exists or the array of domains is faulty.");
}

function returnData(reqOptions) {
    return request(reqOptions)
        .then(function (response) {
            //returns json format
            //further handling
            console.log(reqOptions.uri + " successfully requested with GET-Request.");
            return JSON.stringify(response);
        })
        .catch(function (err) {
            console.log("Error: " + err);
            return JSON.stringify(err);
        })
}

function outputFileExists() {
    let mainFolerDir = path.dirname(__dirname);
    let scraperOutputDir = mainFolerDir.concat('\\scraperOutput\\');
    let fileName = (dt.getDate().toString() + "-" + dt.getMonth().toString() + "-" + dt.getFullYear().toString() + "_matchResults.json");

    try {
        if (fs.existsSync(scraperOutputDir + fileName)) {
            return true;
        }
    } catch (err) {
        console.error(err);
    }
    return false;
}