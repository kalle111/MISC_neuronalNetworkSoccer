const fs = require('fs');
const brain = require('brain.js');

const n_network = new brain.NeuralNetwork();
//first easy attempt of training the ai with random samples
//placeholder to be expanded with real data

//0 == Insert data in MongoDB
//transferDataToMongo.main(0);
//1 == delete
//transferDataToMongo.main(1);

// test training info
let t_info = n_network.train([{
        input: {
            homeStr: 95,
            awayStr: 80
        },
        output: {
            homeTeam: 1,
            awayTeam: 0,
            draw: 0
        }
    },
    {
        input: {
            homeStr: 95,
            awayStr: 99
        },
        output: {
            homeTeam: 0,
            awayTeam: 0,
            draw: 1
        }
    },
    {
        input: {
            homeStr: 25,
            awayStr: 99
        },
        output: {
            homeTeam: 1,
            awayTeam: 1,
            draw: 0
        }
    },
    {
        input: {
            homeStr: 80,
            awayStr: 66
        },
        output: {
            homeTeam: 1,
            awayTeam: 0,
            draw: 0
        }
    },
    {
        input: {
            homeStr: 30,
            awayStr: 10
        },
        output: {
            homeTeam: 1,
            awayTeam: 0,
            draw: 0
        }
    },
    {
        input: {
            homeStr: 75,
            awayStr: 70
        },
        output: {
            homeTeam: 0,
            awayTeam: 0,
            draw: 1
        }
    }
]);

// test results based on test dataset
const test_result = n_network.run([{
    homeStr: 5,
    awayStr: 99
}]);

//console output
console.log(t_info);
console.log(`test_result = ${test_result}`);
console.log(test_result);