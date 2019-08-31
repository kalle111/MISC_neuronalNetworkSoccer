const fs = require('fs');
const cheerio = require('cheerio'); 
const request = require('request');
const brain = require('brain.js');

const n_network = new brain.NeuralNetwork();
const n = a;
//first easy attempt of training the ai with random samples
//placeholder to be expanded with real data
let t_info = n_network.train([
    { input: {homeStr: 95, awayStr: 80}, output: {homeTeam: 1, awayTeam: 0, draw: 0}},
    { input: {homeStr: 95, awayStr: 99}, output: {homeTeam: 0, awayTeam: 0, draw: 1}},
    { input: {homeStr: 25, awayStr: 99}, output: {homeTeam: 1, awayTeam: 1, draw: 0}},
    { input: {homeStr: 80, awayStr: 66}, output: {homeTeam: 1, awayTeam: 0, draw: 0}},
    { input: {homeStr: 30, awayStr: 10}, output: {homeTeam: 1, awayTeam: 0, draw: 0}},
    { input: {homeStr: 75, awayStr: 70}, output: {homeTeam: 0, awayTeam: 0, draw: 1}}
]);

const test_result = n_network.run([{homeStr: 5, awayStr: 99}]);
console.log(t_info);
console.log(`test_result = ${test_result}`);
console.log(test_result);