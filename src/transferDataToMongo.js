const fs = require('fs');
//const mongoose = require('mongoose');
const MongoClient = require('mongodb');
const assert = require('assert');
const path = require('path');
//db name
const dbName = 'soccerAiDB';
const mongoUrl = "mongodb://localhost:27017/soccerAiDB";


//executes Main-Funktion
main();

async function main() {
    // ### Persist scraped JSON files in Mongo DB
    let waitForInput = false;
    let operation = 0;
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

    matchResults1.forEach(function (match) {
        // Loop continues with next element, if Match was not finished under regular conditions.
        if (match.MatchIsFinished === false) {
            return;
        }
        //collecting relevant data in variables
        let seasonInfo;
        seasonInfo = match.LeagueName.slice(-9);
        let dt = new Date(match.MatchDateTime);
        let matchResult;

        let diff = match.MatchResults[0].PointsTeam1 - match.MatchResults[0].PointsTeam2;

        //console.log(match);
        //console.log(match.MatchResults);




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
        //console.log(relData.homeTeamGoals);
        releventResults.push(relData);
        //insertTeam('matchResults', relData);
    });

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
        db.db('soccerAiDB').collection("matchResults").deleteMany({});
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