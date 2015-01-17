function leaguePrototype() {

    "use strict";
    
    
    var leagueTeamSort = function (league,ascending,property,comparator) {
    
        if (ascending === undefined || ascending === true) {
            var flip =  comparator || 1;
        } else {
            var flip = -comparator || -1;
        }
        
        var sortArray = Object.keys(league.team).map(function (teamName) {
            var prop;

            if (property.constructor !== Array) {
                prop = league.team[teamName][property];
            } else {
                prop = league.team[teamName];
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

    
    return {
    name: "league",
    prop: {
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
    },
        proto: {
            teamsByWins: function (ascending) {
                return leagueTeamSort(this,ascending,"wins");
            },
            teamsByLosses: function (ascending) {
                return leagueTeamSort(this,ascending,"losses");
            },
            teamsByTies: function (ascending) {
                return leagueTeamSort(this,ascending,"ties");
            },
            teamsByDraftPick: function (ascending) {
                return leagueTeamSort(this,ascending,["draftInformation","draftPick"],-1);
            },
            teamsByName: function (Ascending) {
                if (Ascending === undefined || Ascending === true) {
                    return Object.keys(this.team).sort();
                } else {
                    return Object.keys(this.team).sort().reverse();
                }
            },
            addTeam: function (name /*,Owner,Wins,Losses,Ties*/) {
                
                    // Populate new Team instance
                    var newTeam = makeObject(teamPrototype());
                

                    var ArgumentOrder = ["owner","wins","losses","ties"];
                    for (var k = 1; k < arguments.length; k++) {
                        if ( arguments[k] !== undefined ) {
                            newTeam[ArgumentOrder[k-1]] = arguments[k];
                        }
                    }
                    
                    this.team[name] = newTeam;
                    
                    return true;
                    
            },
            removeTeam: function (name) {
                        delete this.team[name];
                        return true;
            },
            changeTeamName: function (oldName,newName) {
            
                        if (this.team.hasOwnProperty(oldName)) {
                            var temp = this.team[oldName];
                            delete this.team[oldName];
                            this.team[newName] = temp;
                            return true;
                        } {
                            return false;
                        }

            },
            teamExists: function (name) {
                        if (this.team.hasOwnProperty(name)) {
                            return true;
                        } {
                            return false;
                        }
            }
        }
    };

}