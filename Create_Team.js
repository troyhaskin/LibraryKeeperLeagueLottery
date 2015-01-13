var Team = (function () {

    "use strict";


    var Team = Object.create(null, {
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
    
    return Team;
}());