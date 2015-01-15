function League() {

    "use strict";

    
    // Start the League object
    var league = Object.create(null, {
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
    league.makeTeamNameSort = function (property,comparator) {
        
        var that = this;
        var flip = 0;
    
        return function (Ascending) {
            if (Ascending === undefined || Ascending === true) {
                flip =  comparator || 1;
            } else {
                flip = -comparator || -1;
            }
            
            var sortArray = Object.keys(that.team).map(function (teamName) {
                var prop;

                if (property.constructor !== Array) {
                    prop = that.team[teamName][property];
                } else {
                    prop = that.team[teamName];
                    property.forEach( function (element){
                        prop = prop[element];
                    });
                }

                return {
                    name: teamName,
                    sortProperty: prop
                };
            });
            
            sortArray.sort(function(a,b) {
                
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
    league.teamsByWins      = league.makeTeamNameSort("wins");
    league.teamsByLosses    = league.makeTeamNameSort("losses");
    league.teamsByTies      = league.makeTeamNameSort("ties");
    league.teamsByDraftPick = league
        .makeTeamNameSort(["draftInformation","draftPick"],-1);
    
    
    // Name sorting is different
    league.teamsByName = function (Ascending) {
        if (Ascending === undefined || Ascending === true) {
            return Object.keys(this.team).sort();
        } else {
            return Object.keys(this.team).sort().reverse();
        }
    };
    
    
    league.addTeam = function (name /*,Owner,Wins,Losses,Ties*/) {
    
        // Populate new Team instance
        var newTeam = Team();
    

        var ArgumentOrder = ["owner","wins","losses","ties"];
        for (var k = 1; k < arguments.length; k++) {
            if ( arguments[k] !== undefined ) {
                newTeam[ArgumentOrder[k-1]] = arguments[k];
            }
        }
        
        this.team[name] = newTeam;
        
        return true;
        
    };
    Object.seal(league);

    return league;

}