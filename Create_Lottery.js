var Lottery = (function MakeLottery() {

    "use strict";

    var percentageArray = [];
    var Lottery = Object.create(null,{
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
                
                percentageArray = array;
            },
            get: function () {
                return percentageArray;
            }
        },
        cummulativePercentages : {
            enumerable: true,
            get: function () {
                return percentageArray.cumsum();
            }
        }
    });
   

    Lottery.sample = function(){
    
    
    };
    Lottery.performDrawing = function(){};

    return Lottery;
    
}());