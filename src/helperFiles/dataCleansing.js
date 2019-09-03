//export functions
module.exports = {
    nameCleansingRatings: nameCleansingRatings,
    nameCleansingResults: nameCleansingResults
}

function nameCleansingRatings(clubName) {
    switch (clubName) {
        case "Dortmund":
            clubName = "Borussia Dortmund";
            break;
        case "Bayern Munich":
            clubName = "FC Bayern";
        case "FC Bayern München":
            clubName = "FC Bayern";
            break;
        case "Bayern München":
            clubName = "FC Bayern";
        case "Hertha BSC Berlin":
            clubName = "Hertha BSC"
            break;
        case "SV Werder Bremen":
            clubName = "Werder Bremen";
            break;
        case "FSV Mainz 05":
            clubName = "1. FSV Mainz 05";
            break;
        case "Mainz":
            clubName = "1. FSV Mainz 05";
            break;
        case "1.FC Nürnberg":
            clubName = "1. FC Nürnberg"
            break;
        case "Bor. M'Gladbach":
            clubName = "Borussia Mönchengladbach";
            break;
        case "FC Energie Cottbus":
            clubName = "Energie Cottbus";
            break;
        case "Bremen":
            clubName = "Werder Bremen";
            break;
        case "Hamburger Sport Verein":
            clubName = "Hamburger SV";
            break;
        case "Hamburg SV":
            clubName = "Hamburger SV";
            break;
        case "Schalke":
            clubName = "FC Schalke 04";
            break;
        case "Schalke 04":
            clubName = "FC Schalke 04";
            break;
        case "Frankfurt":
            clubName = "Eintracht Frankfurt";
            break;
        case "Eint. Frankfurt":
            clubName = "Eintracht Frankfurt";
            break;
        case "1899 Hoffenheim":
            clubName = "TSG 1899 Hoffenheim";
            break;
        case "TSG Hoffenheim":
            clubName = "TSG 1899 Hoffenheim";
            break;
        case "Greuther Fürth":
            clubName = "SpVgg Greuther Fürth";
            break;
        case "Düsseldorf":
            clubName = "Fortuna Düsseldorf";
            break;
        case "F. Düsseldorf":
            clubName = "Fortuna Düsseldorf";
            break;
        case "Braunschweig":
            clubName = "Eintracht Braunschweig";
            break;
        case "Darmstadt":
            clubName = "SV Darmstadt 98";
            break;
        case "FC Ingolstadt":
            clubName = "FC Ingolstadt 04";
            break;
    }
    return clubName;
}

function nameCleansingResults(clubName) {
    switch (clubName) {
        case "FC Bayern München":
            clubName = "FC Bayern";
            break;
    }
    switch (clubName) {
        case "FC Bayern München":
            clubName = "FC Bayern";
            break;
    }
    return clubName;
}