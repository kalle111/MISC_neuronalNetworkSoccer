const fs = require('fs');
const cheerio = require('cheerio'); 
const request = require('request-promise');
const path = require('path');
const dt = new Date();

const teams = [];
let domains = [];
let year = 5
while(year < 20) {
    let tempDomain = {
        dmain: "",
        yr: ""
    };
    if(year < 10) {
        tempDomain.dmain = `https://www.fifaindex.com/de/teams/fifa0${year}/?league=19`;
    } else {
        tempDomain.dmain = `https://www.fifaindex.com/de/teams/fifa${year}/?league=19`;
    }
    tempDomain.yr = year;
    domains.push(tempDomain);
    year++;
}
   
if(domains.length > 0 && !outputFileExists()) {
    // request Domains okay and outputfile does not exist thus far. 
    domains.forEach(function(element) {
        var options = {
            uri: element.dmain,
            transform: function(body) {
                return cheerio.load(body);
            }
        }
        console.log("reqData: Requesting BuLi year: " + element.yr);
        request(options)
            .then(function ($) { 
                const table = $('.col-lg-8').find('tbody').find('tr').each((i, el) => {
                    let team = {
                        name: "",
                        year: element.yr,
                        off: 0,
                        mid: 0,
                        def: 0,
                        overall: 0
                    }
                    const item = $(el).find('td').each((j, ele) => {
                        //each team attr
                        //console.log($(ele).text());
                        let html_attr = $(ele).data('title');
                        let html_text = $(ele).text();
                        switch(html_attr) {
                            case "Name":
                                team.name = html_text;
                                break;
                            case "ANG":
                                team.off = html_text;
                                break;
                            case "MIT":
                                team.mid = html_text;
                                break;
                            case "DEF":
                                team.def = html_text;
                                break;
                            case "GES":
                                team.overall = html_text;
                                break;
                        }
                        //console.log("team: " + team.name + team.year);
                        //console.log(j+ ". Verein: " + $(ele).data('title'));
                    });
                    //let data = JSON.stringify(team);
                    //fs.writeFile("/scraperOutput/teams.json", team);
                    //console.log(team);
                    teams.push(team);
                })
                let mainFolerDir = path.dirname(__dirname); 
                let scraperOutputDir = mainFolerDir.concat('\\scraperOutput\\');
                let fileName = (dt.getDate().toString() + "-"  + dt.getMonth().toString() + "-" + dt.getFullYear().toString() + "_fifaRatings.json");
                fs.writeFileSync(scraperOutputDir + fileName, JSON.stringify(teams));
            })
            .catch(function(err) {
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
    let fileName = (dt.getDate().toString() + "-"  + dt.getMonth().toString() + "-" + dt.getFullYear().toString() + "_fifaRatings.json");

    try {
        if(fs.existsSync(scraperOutputDir + fileName)) {
            return true;
        }
    }catch(err) {
        console.error(err);
    }
    return false;
}