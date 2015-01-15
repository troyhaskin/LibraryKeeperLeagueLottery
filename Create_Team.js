function Team() {

    "use strict";

    var team = Object.create(null, {
        owner: {
            value: "",
            configurable: false,
            enumerable:   true,
            writable:     true
        },
        wins: {
            value: 0,
            configurable: false,
            enumerable:   true,
            writable:     true
        },
        losses: {
            value: 0,
            configurable: false,
            enumerable:   true,
            writable:     true
        },
        ties: {
            value: 0,
            configurable: false,
            enumerable:   true,
            writable:     true
        },
        record: {
            enumerable:   true,
            get: function () {
            
                var record = this.wins + "-" + this.losses;
                
                if (this.ties > 0) {
                    record = record + "-" + this.ties;
                }
                
                return (this.wins.toString() + "-" + this.losses.toString());
            },
            set: function (record) {
            
                if ((typeof record) === "string") {
                
                    var winLoss = Record.split(/[^0-9]+/);                  
                    this.wins   = parseInt(winLoss[0],10);
                    this.losses = parseInt(winLoss[1],10);
                    
                    if (winLoss.length > 2) {
                        this.ties = parseInt(winLoss[2],10);
                    }

                }
            }
        },
        draftInformation: {
            value:        new DraftInformation(),
            configurable: false,
            enumerable:   true,
            writable:     false
        }
    });
    Object.seal(team);
    
    return team;
}