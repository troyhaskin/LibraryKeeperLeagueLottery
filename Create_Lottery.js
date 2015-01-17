function Lottery() {

    "use strict";

    var percentages = [];
    
    var lottery = Object.create(null,{
        prng: {
            value: uheprng(),
            enumerable: true,
            writable: false,
            configurable: false
        },
        percentages : {
            enumerable: true,
            set: function (array) {
                var total = array.sum();
                
                if (Math.abs(1 - total) > 2.220446049250313e-16) {
                    array.forEach( function (current,index,arr) {
                        arr[index] = current/total;
                    });
                }
                
                percentages = array;
            },
            get: function () {
                return percentages;
            }
        },
        cummulativePercentages : {
            enumerable: true,
            get: function () {
                return percentages.cumsum();
            }
        }
    });
    
    
    // Add some initial entropy to this prng
    for (var k = 0; k < 50; k ++ ) {
        lottery.prng.addEntropy(Math.random());
    }
   

    lottery.performDrawingWithoutReplacement = function (shuffle) {
    
        var nSamples = 0,
            work     = percentages,
            bins     = [],
            sampled  = 0,
            selected    = [],
            sampleProb = 0,
            indices  = work.map( function (current,index) {
                return index;
            }),
            notSelected = indices;
        
        
        while (nSamples < percentages.length-1) {
        
            // Shuffle and rebuild bins
            if(shuffle === true) {
                indices.shuffle();
            }
            work = work.map( function (current,index,arr) {
                return arr[indices[index]];
            });
            bins = work.cumsum();
            
            
            // Perform sampling and search for index
            sampleProb = this.prng.uniform();
            bins       = bins.map( function (current) {
                return (current - sampleProb);
            });
            for(k = 0; k < bins.length; k++) {
                if( 0 <= bins[k] ) {
                    sampled = indices[k-1];
                    break;
                }
            }
            
            // Make sure it hasn't been selected before
            var selectedIndexOf = selected.indexOf(sampled);
            if (selected.indexOf(sampled) === -1) {
                selected.push(sampled);
                notSelected = notSelected.filter( function (value) {
                    return value !== sampled;
                });
                nSamples +=1;
            }
        }
        
        selected.push(notSelected[0]);
        
        return selected;
    }
    
    
    
    lottery.sampleNRounds = function (n,shuffle) {
        if(n === undefined) {
            n = 100;
        }
        if ( shuffle === undefined || shuffle !== false || shuffle !== true) {
            shuffle = false;
        }
        
        var outcome =[];
        
        for(var k = 0; k < n; k++){
            outcome = this.performDrawingWithoutReplacement(shuffle);
        }
        
        return outcome;
        
    }
    
    
    lottery.verifySampling = function (n,shuffle) {
        if(n === undefined) {
            n = 100;
        }
        if ( shuffle === undefined || shuffle !== false || shuffle !== true) {
            shuffle = false;
        }
        
        var outcome =[],
            occurences = percentages.map( function ( ) {
                return 0;
            });
        
        for(var k = 0; k < n; k++){
            outcome = this.performDrawingWithoutReplacement(shuffle);
            occurences[outcome[0]] += 1;
        }
        
        return occurences.map(function (current) {
            return current/n;
        });
        
    }
    
    Object.seal(lottery);

    return lottery;
    
}

