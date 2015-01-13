(function(){
    "use strict";
    Array.prototype.sum = function () {
        var compen  = 0,
            naive   = 0,
            shifted = 0,
            sum     = 0;
        
        // Kahan Algorithm
        this.forEach ( function (current,index) {
            shifted = current - compen;
            naive   = sum + shifted;
            compen  = (naive - sum) - shifted;
            sum     = naive;
        });
        
        return sum;
    };
    
    Array.prototype.cumsum = function () {
        var accumulator = [];
        accumulator.push(0.0);

        var compen  = 0,
            naive   = 0,
            shifted = 0,
            sum     = 0;
        
        // Kahan Algorithm
        this.forEach ( function (current,index) {
            shifted = current - compen;
            naive   = sum + shifted;
            compen  = (naive - sum) - shifted;
            sum     = naive;
            accumulator.push(sum);
        });
        
        return accumulator;
    };

    Array.prototype.shuffle = function ( /* Entropy sources */) {
        var array        = this             ,
            currentIndex = array.length-1   ,
            swapIndex    = 0                ,
            swapValue    = 0                ; 
            
        while (0 !== currentIndex) {
        
            // Get random swap index
            swapIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            
            // Swap values
            swapValue           = array[currentIndex]   ;
            array[currentIndex] = array[swapIndex]      ;
            array[swapIndex]    = swapValue             ;
        }
        
        return array;
    }

}());