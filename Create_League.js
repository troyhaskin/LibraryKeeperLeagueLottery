var League = (function () {

    "use strict";

    
    // Start the League object
    var League = Object.create(null, {
        team: {
            value: {},
            writable: true,
            configurable: false,
            enumerable: true
        },
        teams: {
            enumerable: true,
            get: function () {
                return Object.keys(this.team);
            }
        }
    });

    

    // Function for creating sort methods
    League.makeTeamNameSort = function (property) {
        return function (Ascending) {

            if (Ascending === undefined || Ascending === true) {
                var flip = 1;
            } else {
                var flip = -1;
            }
            
            var sortArray = Object.keys(this.team).map(function (teamName) {
                return {
                    name: teamName,
                    sortProperty: this.team[teamName][property]
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
    
    
    //  Concrete sort methods: return team names in a sorted array
    League.teamsByWins   = League.makeTeamNameSort("Wins");
    League.teamsByLosses = League.makeTeamNameSort("Losses");
    League.teamsByTies   = League.makeTeamNameSort("Ties");
    
    // Name sorting is different
    League.teamsByName = function (Ascending) {
        if (Ascending === undefined || Ascending === true) {
            return Object.keys(this.team).sort();
        } else {
            return Object.keys(this.team).sort().reverse();
        }
    };
    
    
    League.addTeam = function (Name /*,Owner,Wins,Losses,Ties*/) {
    
        // Populate new Team instance
        var newTeam = Object.create(Team);
    

        var ArgumentOrder = ["Owner","Wins","Losses","Ties"];
        for (var k = 1; k < arguments.length; k++) {
            if ( arguments[k] !== undefined ) {
                newTeam[ArgumentOrder[k-1]] = arguments[k];
            }
        }
        
        League.team[Name] = newTeam;
        
        return true;
        
    };

    return League;

}());