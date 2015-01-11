var Lottery = (function MakeLottery() {

    "use strict";

    var Lottery = Object.create(null);
    
    Lottery.prng           = uheprng();
    
    Lottery.percentages    = [];
    
    
    Object.defineProperty(Lottery,"cummulativePercentages",{
        enumerable: true,
        get: function () {
            var cummulative = [];
            cummulative.push(0.0);
        
            Lottery.percentages.forEach(function(curr,k,arr){
                cummulative.push(cummulative[k] + curr);
            });
        
            return cummulative;
        }
    });

    Lottery.sample = function(){
    
    
    };
    Lottery.performDrawing = function(){};

    return Lottery;
    
}());