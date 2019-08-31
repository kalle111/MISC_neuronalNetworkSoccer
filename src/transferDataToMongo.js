const fs = require('fs');
//const mongoose = require('mongoose');
const MongoClient = require('mongodb');
const assert = require('assert');

//db name
const dbName = 'soccerAiDB';
const mongoUrl = "mongodb://localhost:27017/soccerAiDB";

var resultArr1 = [];
var resultArr2 = [];
async function grabData() {
    await MongoClient.connect(mongoUrl, async function(err, db) {
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
async function main() {
    var teamRatings = await dataInCol("teamFifaRatings");
    var matchResults = await dataInCol("matchResults");
    //console.log("endResult: ");
    console.log(matchResults);
    console.log(teamRatings);
    //console.log(resultArr)
}

function dataInCol(colName) {
    return MongoClient.connect(mongoUrl).then(function(db) {
        var collection = db.db('soccerAiDB').collection(colName);
        //db.close();
        return {a: collection.find().toArray(), b: db};
    }).then(function({a,b}) {
        b.close();
        return a;
    });
};

main();
//console.log(resultArr);
const closeClient = function(client) {
    client.close();
}

const getData = async function(db, callback) {
    // Get the documents collection
    
    const collection = db.collection('matchResults');
    var a;// Insert some documents
    a = await collection.find({}).toArray(function(err, data) {
        assert.equal(err, null);
        console.log("Found the following data: ");
        //console.log(data);
        return data;
    });

    console.log(a);
    callback(a);
}