(function(){
    "use strict";
    Array.prototype.sum = function () {
        return this.reduce( function (previous,current) {
            return previous + current;
        }, 0);
    };
    
    Array.prototype.cumsum = function () {
        var accumulator = [];
        accumulator.push(0.0);
    
        this.forEach( function (current,index) {
            accumulator.push(accumulator[index] + current);
        });
    
        return accumulator;
    };
    
    
    Array.prototype.shuffle = function () {
        var array        = this             ,
            currentIndex = array.length-1   ,
            prng         = uheprng()        ,
            swapIndex    = 0                ,
            swapValue    = 0                ; 
            
        // Add entropy the prng
        array.forEach( function (current,index) {
            prng.addEntropy(current,index);
        });
            
        while (0 !== currentIndex) {
        
            // Get random swap index
            swapIndex = prng.range(currentIndex);
            currentIndex -= 1;
            
            // Swap values
            swapValue           = array[currentIndex]   ;
            array[currentIndex] = array[swapIndex]      ;
            array[swapIndex]    = swapValue             ;
        }
        
        return array;
    }

}());