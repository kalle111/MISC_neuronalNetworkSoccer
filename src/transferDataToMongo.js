const fs = require('fs');
//const mongoose = require('mongoose');
const MongoClient = require('mongodb');
const assert = require('assert');
const path = require('path');
//db name
const dbName = 'soccerAiDB';
const mongoUrl = "mongodb://localhost:27017/soccerAiDB";


//executes Main-Funktion
//Insert Data from Output-folder
//main(0);
//Delete All from MongoDB
main(0);


async function main(operation_desc) {
    // ### Persist scraped JSON files in Mongo DB
    let waitForInput = false;

    let operation = operation_desc;
    // // operation = operationSelector();
    // // if (operation === 1 || operation === 0) {
    // //     waitForInput = false;
    // // }



    var scrapeFolder = path.dirname(__dirname).concat('\\scraperOutput\\');
    var matchResultFile = fs.readdirSync(scrapeFolder).filter(function (fn) {
        return fn.endsWith('matchResults.json');
    });
    var fifaRatingFile = fs.readdirSync(scrapeFolder).filter(function (fn) {
        return fn.endsWith('fifaRatings.json');
    });

    var fifaRatings = JSON.parse(fs.readFileSync(scrapeFolder + fifaRatingFile, 'utf-8'));
    var matchResults1 = JSON.parse(fs.readFileSync(scrapeFolder + matchResultFile, 'utf-8'));
    //Check if all years in base data
    //
    // let years = [];
    // matchResults.forEach(function (match) {
    //     let dt = new Date(match.MatchDateTime);
    //     if (!years.includes(dt.getFullYear())) {
    //         years.push(dt.getFullYear());
    //     }
    // });
    // console.log(years);
    let releventResults = [];
    let matchId = 1;
    let relevantRatings = [];
    fifaRatings.forEach(function (rating) {
        //adjusting naming dirscrepancies
        switch (rating.name) {
            case "Dortmund":
                rating.name = "Borussia Dortmund";
                break;
            case "Bayern Munich":
                rating.name = "FC Bayern";
            case "FC Bayern München":
                rating.name = "FC Bayern";
                break;
            case "Bayern München":
                rating.name = "FC Bayern";
            case "Hertha BSC Berlin":
                rating.name = "Hertha BSC"
                break;
            case "SV Werder Bremen":
                rating.name = "Werder Bremen";
                break;
            case "FSV Mainz 05":
                rating.name = "1. FSV Mainz 05";
                break;
            case "Mainz":
                rating.name = "1. FSV Mainz 05";
                break;
            case "1.FC Nürnberg":
                rating.name = "1. FC Nürnberg"
                break;
            case "Bor. M'Gladbach":
                rating.name = "Borussia Mönchengladbach";
                break;
            case "FC Energie Cottbus":
                rating.name = "Energie Cottbus";
                break;
            case "Bremen":
                rating.name = "Werder Bremen";
                break;
            case "Hamburger Sport Verein":
                rating.name = "Hamburger SV";
                break;
            case "Hamburg SV":
                rating.name = "Hamburger SV";
                break;
            case "Schalke":
                rating.name = "FC Schalke 04";
                break;
            case "Schalke 04":
                rating.name = "FC Schalke 04";
                break;
            case "Frankfurt":
                rating.name = "Eintracht Frankfurt";
                break;
            case "Eint. Frankfurt":
                rating.name = "Eintracht Frankfurt";
                break;
            case "1899 Hoffenheim":
                rating.name = "TSG 1899 Hoffenheim";
                break;
            case "TSG Hoffenheim":
                rating.name = "TSG 1899 Hoffenheim";
                break;
            case "Greuther Fürth":
                rating.name = "SpVgg Greuther Fürth";
                break;
            case "Düsseldorf":
                rating.name = "Fortuna Düsseldorf";
                break;
            case "F. Düsseldorf":
                rating.name = "Fortuna Düsseldorf";
                break;
            case "Braunschweig":
                rating.name = "Eintracht Braunschweig";
                break;
            case "Darmstadt":
                rating.name = "SV Darmstadt 98";
                break;
            case "FC Ingolstadt":
                rating.name = "FC Ingolstadt 04";
                break;

        }
        relevantRatings.push(rating);

    });

    insertManyTeams('teamFifaRatings', relevantRatings);
    //deleteAllEntries('teamFifaRatings');


    /// ##########results##############
    let teamNameResults = [];
    matchResults1.forEach(function (match) {
        // Loop continues with next element, if Match was not finished under regular conditions.
        if (match.MatchIsFinished === false) {
            return;
        }
        if (!teamNameResults.includes(match.Team1.TeamName)) {
            teamNameResults.push(match.Team1.TeamName);
        }
        //teamnamefinder

        //collecting relevant data in variables
        let seasonInfo;
        seasonInfo = match.LeagueName.slice(-9);
        let dt = new Date(match.MatchDateTime);
        let matchResult;

        let diff = match.MatchResults[0].PointsTeam1 - match.MatchResults[0].PointsTeam2;
        switch (true) {
            case diff > 0:
                matchResult = {
                    win: 1,
                    draw: 0,
                    loss: 0
                }
                break;
            case diff == 0:
                matchResult = {
                    win: 0,
                    draw: 1,
                    loss: 0
                }
                break;
            case (diff < 0):
                matchResult = {
                    win: 0,
                    draw: 0,
                    loss: 1
                }
                break;
        }

        switch (match.Team1.TeamName) {
            case "FC Bayern München":
                match.Team1.TeamName = "FC Bayern";
                break;
        }

        switch (match.Team2.TeamName) {
            case "FC Bayern München":
                match.Team2.TeamName = "FC Bayern";
                break;
        }


        let relData = {
            matchId: matchId++,
            matchYear: dt.getFullYear(),
            league: "Bundesliga",
            season: seasonInfo,
            spieltag: match.Group.GroupName,
            homeTeamLong: match.Team1.TeamName,
            homeTeamShort: match.Team1.ShortName,
            homeTeamStrength: {
                OFF: 0,
                DEFF: 0,
                OVR: 0
            },
            awayTeamLong: match.Team2.TeamName,
            awayTeamShort: match.Team2.ShortName,
            awayTeamStrength: {
                OFF: 0,
                DEFF: 0,
                OVR: 0
            },
            homeTeamGoals: match.MatchResults[0].PointsTeam1,
            awayTeamgoals: match.MatchResults[0].PointsTeam2,
            goalDifference: diff,
            matchResult: matchResult
        }

        releventResults.push(relData);

    });

    console.log(teamNameResults);

    if (operation === 1) {
        deleteAllEntries('matchResults');
    } else {
        insertManyTeams('matchResults', releventResults);
    }

}


function operationSelector() {
    console.log('Which operation do you want to perform? (0 => Insert Data to MongoDB, 1 => Delete Data from MongoDB');
    var n = 0;
    var m = 0;
    var state = 0;
    process.stdin.on('data', function (input) {
        if (input === 0) {
            return 0;
        }
        if (input === 1) {
            return 1;
        }
        if (input != 1 && input != 0) {
            console.log("Not a valid operation!");
        }
    });
}
//func decl.
async function grabData() {
    await MongoClient.connect(mongoUrl, async function (err, db) {
        assert.equal(null, err);
        console.log("Successfully connected to server.");
        var matchResCol = db.db('soccerAiDB').collection('matchResults').find({});
        var matchResultsJson = await matchResCol.toArray();

        var fifaRatingsCol = db.db('soccerAiDB').collection('teamFifaRatings').find({})
        var fifaRatingsJson = await fifaRatingsCol.toArray();
        resultArr1.push(matchResultsJson);
        resultArr2.push(fifaRatingsJson);

        console.log("fifaratings:");
        console.log(resultArr2);
        console.log("matchResults:");
        console.log(resultArr1);
        db.close();
        /*var collection = db.db('soccerAiDB').collection('matchResults').find({}).toArray(function(err, data) {
            assert.equal(err, null);
            resultArr.push(data);
            db.close();
        });*/

        //console.log(resultArr);
        /*
        console.log("resArr: "+resultArr);
        console.log(collection);
        db.close();
        */
        /*collection.forEach(function(doc, err){
            assert(null, err);
            resultArr.push(doc);
        }, function() {
            //after pushing results, close connection.
            db.close();
        });*/
        /*const db = client.db(dbName);
         
        getData(db, function(data) {
            console.log(data);
        });
        closeClient(client);*/

    });
    console.log(resultArr1);
}

function insertTeam(colName, team) {
    return MongoClient.connect(mongoUrl).then(function (db) {
        db.db('soccerAiDB').collection(colName).insertOne(team);
        return db;
    }).then(function (db) {
        db.close();
        return "inserted...";
    });
}

function insertManyTeams(colName, teamArray) {
    return MongoClient.connect(mongoUrl).then(function (db) {
        db.db('soccerAiDB').collection(colName).insertMany(teamArray);
        return db;
    }).then(function (db) {
        db.close();
        return "inserted...";
    });
}

function deleteAllEntries(colName) {
    return MongoClient.connect(mongoUrl).then(function (db) {
        db.db('soccerAiDB').collection(colName).deleteMany({});
        return db;
    }).then(function (db) {
        db.close();
    });
}

function dataInCol(colName) {
    return MongoClient.connect(mongoUrl).then(function (db) {
        var collection = db.db('soccerAiDB').collection(colName);
        //db.close();
        return {
            a: collection.find().toArray(),
            b: db
        };
    }).then(function ({
        a,
        b
    }) {
        b.close();
        return a;
    });
};



const closeClient = function (client) {
    client.close();
}

const getData = async function (db, callback) {
    // Get the documents collection

    const collection = db.collection('matchResults');
    var a; // Insert some documents
    a = await collection.find({}).toArray(function (err, data) {
        assert.equal(err, null);
        console.log("Found the following data: ");
        //console.log(data);
        return data;
    });

    console.log(a);
    callback(a);
}

module.exports = {
    main: main
}