const fs = require('fs');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

//db name
const dbName = 'soccerAiDB';
const mongoUrl = "mongodb://localhost:27017/soccerAiDB";


MongoClient.connect(mongoUrl, function(err, client) {
    assert.equal(null, err);
    console.log("Successfully connected to server.");

    const db = client.db(dbName);

    getData(db, function() {
        client.close();
    });
});

const getData = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('matchResults');
    // Insert some documents
    collection.find({}).toArray(function(err, data) {
        assert.equal(err, null);
        console.log("Found the following data: ");
        console.log(data);
        callback(data);
    });
}