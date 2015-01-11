var League = (function () {

    "use strict";


    var Team = Object.create(null, {
        Name: {
            value: "",
            configurable: false,
            enumerable:   true,
            writable:     true
        },
        Owner: {
            value: "",
            configurable: false,
            enumerable:   true,
            writable:     true
        },
        Wins: {
            value: 0,
            configurable: false,
            enumerable:   true,
            writable:     true
        },
        Losses: {
            value: 0,
            configurable: false,
            enumerable:   true,
            writable:     true
        },
        Ties: {
            value: 0,
            configurable: false,
            enumerable:   true,
            writable:     true
        },
        Record: {
            enumerable:   true,
            get: function () {
            
                var Record = this.Wins + "-" + this.Losses;
                
                if (this.Ties > 0) {
                    Record = Record + "-" + this.Ties;
                }
                
                return (this.Wins.toString() + "-" + this.Losses.toString());
            },
            set: function (Record) {
            
                if ((typeof Record) === "string") {
                
                    var WinLoss = Record.split(/[^0-9]+/);                  
                    this.Wins   = parseInt(WinLoss[0],10);
                    this.Losses = parseInt(WinLoss[1],10);
                    
                    if (WinLoss.length > 2) {
                        this.Ties = parseInt(WinLoss[2],10);
                    }

                }
            }
        }
    });
    Object.seal(Team);
    

    
    
    

    /*
        Begin League object creation
    */
    var League = Object.create(null);


    // Associative array to hold all teams
    League.team = Object.create(null); 



    // *Private* function for creating sort methods
    var makeTeamNameSort = function (property) {
        return function (Ascending) {

            if (Ascending === undefined || Ascending === true) {
                var flip = 1;
            } else {
                var flip = -1;
            }
            
            var sortArray = Object.keys(League.team).map(function (teamName) {
                return {
                    name: teamName,
                    sortProperty: League.team[teamName][property]
                };
            });
            
            sortArray.sort(function(a,b){
                
                // Main Comparison
                if (a.sortProperty > b.sortProperty) {
                    return -flip;
                }
                if (a.sortProperty < b.sortProperty) {
                    return flip;
                }
                
                // Alphabetic Comparison
                if (a.name > b.name){
                    return 1;
                }
                if (a.name < b.name){
                    return -1;
                }
                
                return 0;
            });
            
            return sortArray.map(function(e){return e.name});
        };
    };
    
    
    // Concrete sort methods: return team names in a sorted array
    League.sortedByWins   = makeTeamNameSort("Wins");
    League.sortedByLosses = makeTeamNameSort("Losses");
    League.sortedByTies   = makeTeamNameSort("Ties");
    
    // Names are different
    League.sortedByName = function (Ascending) {
        if (Ascending === undefined || Ascending === true) {
            return Object.keys(League.team).sort();
        } else {
            return Object.keys(League.team).sort().reverse();
        }
    };
    
    
    League.addTeam = function (Name /*,Owner,Wins,Losses,Ties*/) {
    
        // Populate new Team instance
        var newTeam    = Object.create(Team);
        newTeam.Name   = Name;
    

        var ArgumentOrder = ["Owner","Wins","Losses","Ties"];
        for (var k = 1; k < arguments.length; k++) {
            if ( arguments[k] !== undefined ) {
                newTeam[ArgumentOrder[k-1]] = arguments[k];
            }
        }
        
        // Push team to needed places
        League.team[Name] = newTeam;
        
        return true;
        
    };

    return League;

}());