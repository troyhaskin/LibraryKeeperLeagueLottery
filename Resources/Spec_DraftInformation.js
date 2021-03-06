function draftSpec() {

    "use strict";
    
    var draftPick     = 0       ,
        lotteryChance = 0       ,
        inLottery     = false   ;
    return {
        name: "draftInformation",
        proto: null,
        prop:   {
            draftPick: {
                enumerable:   true,
                get: function () {
                    return draftPick;
                },
                set: function (pickValue) {
                    if (pickValue > 0) {
                        draftPick     = parseInt(pickValue);
                        inLottery     = false;
                        lotteryChance = 0;
                    }
                }
            },
            lotteryChance: {
                enumerable: true,
                get: function () {
                    return lotteryChance;
                },
                set: function (chanceValue) {
                    if (0 < chanceValue && chanceValue <= 1) {
                        draftPick     = "TBD";
                        inLottery     = true;
                        lotteryChance = parsefloat(chanceValue);
                    }
                }
            },
            inLottery: {
                enumerable: true,
                get: function () {
                    return inLottery;
                }
            }
        }
    };
}