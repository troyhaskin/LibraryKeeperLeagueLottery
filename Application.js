(function Application() {

    "use strict";
    
    var theLibraryKeeper  = League(),
        theLibraryLottery = Lottery();
        
    
    for ( var k = 0; k < 50; k++) {
        theLibraryLottery
            .prng.addEntropy(theLibraryLottery
                                .prng.string(16));
    }

    (function ($){
        
        /* ***************************************************************
                                       Utilities
           *************************************************************** */
        function makeTeamID(){
            return ("z"+theLibraryLottery.prng.safeString(15));
        }
        
        
        /* ***************************************************************
                                One-Timers
           *************************************************************** */
        (function () {
            // Margin adjustments for the displayed headers
            var labels = ["TeamName","DraftPick","InLottery","PickChance"];
            labels.forEach ( function (id) {
                var element   = $("div#InputHeaders > div#"+id),
                    labelLeft = $(element).offset().left,
                    inputLeft = $("div#TeamList input[name="+id+"]")
                                    .offset().left;
                
                $(element).css("margin-left",inputLeft-labelLeft);
            });

            
            // Set first team's ID
            $("div#TeamList div.Team").attr("id",makeTeamID());
        }());




    
        /* ***************************************************************
                                  Event Handlers
           *************************************************************** */
           
           
        /* *******************************************
                      Remove team name hint
           ******************************************* */
        var teamNoNameCount = 1;
        $("[name='TeamName']").focus(function () {
            $(this).val("");
        });
        
        
        /* *******************************************
                   Handle user-entered team name
           ******************************************* */
        $("[name='TeamName']").blur(function () {
        
            var teamName    = $(this).val().trim()
            
            if (teamName === "") {
                teamNoNameCount += 1;
                $(this)
                    .val("Team " + teamNoNameCount)
                    .css("color","rgba(0,0,0,0.35)");
                
                return false;
            }
            
            // Update non-empty value
            var oldTeamName = $(this).parent().attr("title") || "";
            
            $(this).removeAttr("style");
            
            if (oldTeamName === "") {
                $(this).parent().attr("title",teamName);
            } else {
                if (teamName !== oldTeamName) {
                    $(this).parent().attr("title",teamName);
                }
            } 
        });
        
        
        /* *******************************************
                         Add a team
           ******************************************* */
        $("[name='AddTeam']").click( function () {
        
            var newTeam = $("div#BlankTeam")
                            .clone(true)
                            .attr("id",makeTeamID());
                            
            teamNoNameCount += 1;
            $(newTeam)
                .children("[name='TeamName']")
                    .val("Team "+teamNoNameCount)
                    .css("color","rgba(0,0,0,0.35)");
        
            
            $("div#TeamList")
                .append($(newTeam).toggle());
        });
        
        
        /* *******************************************
                          Remove a team
           ******************************************* */
        $("[name='RemoveTeam']").click(function () {
        
            var teamID = $(this).parent().attr("id");
            if (draftPicks.indexOf(teamID) !== -1) {
                draftPicks[draftPicks.indexOf(teamID)] = undefined;
            }

            $(this).parent().remove();
        });
           
           
           
           
           
        /* *******************************************
                 Draft pick and Lottery Handling
           ******************************************* 
           
            Intermingling of three inputs:
                - DraftPick
                - InLottery
                - PickChance
        */
        var draftPicks     = [],   // (pick   => teamID) pairs
            lotteryChances = {};   // (teamID => chance) pairs
            
            
        function checkDraftStatus() {
            var pickCount   = draftPicks.definedCount(),
                chanceCount = Object.keys(lotteryChances).length,
                canSort     = pickCount   >= 1,
                canLottery  = chanceCount >  1;
                
            toggleOptionButtons(canSort,canLottery);
        }
        function toggleOptionButtons(canSort,canLottery) {
            if (canSort || canLottery) {
                $("div#Options > div.Overlay").hide();
            } else {
                $("div#Options > div.Overlay").show();
            }
            
            if (canSort) {
                $("input#SortByDraft").removeAttr("disabled");
            } else {
                $("input#SortByDraft").attr("disabled","disabled");
            }
            
            if (canLottery) {
                $("input#PerformLottery").removeAttr("disabled");
            } else {
                $("input#PerformLottery").attr("disabled","disabled");
            }
            
        }
            
            


        /* ****************************
                InLottery checkbox
           **************************** */
        var disableName  = ""   ,
            enableName   = ""   ;
        $("[name='InLottery']").click(function (event) {
        
            var teamID = $(this).parent().attr("id");
            
            // Entering or leaving lottery?
            if ($(this).is(":checked")) {
                disableName  = "DraftPick"  ;
                enableName   = "PickChance" ;
                
                // Remove draft pick (if exist)
                draftPicks.changeValue(teamID,undefined);

            } else {
                disableName  = "PickChance" ;
                enableName   = "DraftPick"  ;
                
                // Remove lottery chance (if exist)
                delete lotteryChances[teamID];

            }

            // Enable/disable appropriate inputs
            $(this).siblings("[name='"+disableName+"']")
                .attr("disabled","disabled")
                .val('')
                .css("background-color","rgba(0,0,0,0.1)");
            $(this).siblings("[name='"+enableName+"']")
                .removeAttr("disabled")
                .css("background-color","");

        });
        
        
        
        
        /* ****************************
                 DraftPick input
           **************************** */
           
        // Validation functions
        function isValidPick(value) {
            return (value === -1) || (Math.round(value) !== value);
        }
        function isNotUniquePick(value,teamID) {
            if (value <= (draftPicks.length-1)) {
                if ((draftPicks[value] === undefined) ||
                    (draftPicks[value] === teamID   )) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
        

        // Main event handler
        $("[name='DraftPick']").blur(function (event) {
        
            var value = $(this).val(),
                teamID = $(this).parent().attr("id"),
                errorText = '';
            
            if (value !== "") {
                value = parseFloat(value,10) || -1;
                
                if (isValidPick(value)) {
                    errorText = "Pick must be a positive integer.";
                } else if (isNotUniquePick(value,teamID)) {
                    errorText = "Pick is not unique.";
                }
                
                // Error if a message was received.
                if (errorText !== '') {
                    $(this)
                        .css("background-color","rgba(255,0,0,0.35)")
                        .siblings("div.ErrorIndicator")
                            .html(errorText)
                            .show();
                            
                    // Lock all other picks
                    $("div#TeamList > div.Team").not("#"+teamID)
                        .children("[name='InLottery']").not(":checked")
                            .siblings("[name='DraftPick']")
                                .attr("disabled","disabled")
                                .css("background-color","rgba(0,0,0,0.1)");
                                
                    return false;
                }
                
                // Unlock all other picks
                $("div#TeamList > div.Team")
                    .not("#"+teamID)
                    .children("[name='InLottery']")
                        .not(":checked")
                        .siblings("[name='DraftPick']")
                            .removeAttr("disabled")
                            .removeAttr("style");

                
                // Remove error and update draft pick array
                $(this)
                    .removeAttr("style")
                    .siblings("div.ErrorIndicator").hide();
                    
                // Update draft pick array
                draftPicks.changeValue(teamID,undefined);
                draftPicks[value] = teamID;            
                
            } else {
                // Remove from draft
                draftPicks.changeValue(teamID,undefined);
            }

            checkDraftStatus();
        });
        
        

        /* ****************************
                 PickChance input
           **************************** */
        $("[name='PickChance']").blur(function () {
        
            var value = $(this).val(),
                teamID = $(this).parent().attr("id");
            
            if (value !== "") {
                value = parseFloat(value,10) || -1;
                
                if ((value === -1) && (value < 0) && (value > 1)) {
                    $(this)
                        .css("background-color","rgba(255,0,0,0.35)")
                        .siblings("div.ErrorIndicator")
                            .html("Odd must be a number between 0 and 1.")
                            .show();
                    
                    return false;
                }

                // Remove error and update draft pick array
                $(this)
                    .removeAttr("style")
                    .siblings("div.ErrorIndicator").hide();
                
                lotteryChances[teamID] = value;
            }
            
            checkDraftStatus();
        });





        /* *******************************************
                           Sort by Draft
           ******************************************* */
    
        $("input#SortByDraft").click(function () {
            // $("div#TeamList").hide(100);
            
            // Pull out the Teams either with a Pick or Chance
            var idSelector = "#" + draftPicks.isDefined()
                                   .concat(Object.keys(lotteryChances))
                                   .join(',#');
            var children = $("div#TeamList").children(idSelector).detach();

            /*
                First insert lottery teams into the 
                draft order sorted by chance.
            */
            var idChancePair = Object.keys(lotteryChances)
                            .map(function (id) {
                                return {id:id,value:lotteryChances[id]};
                            });
            idChancePair.sort(function (a,b){return -(a.value - b.value)});
            idChancePair.forEach(function (elem) {
                $("div#TeamList")
                    .append($(children).filter("#"+elem.id));
            });

            /*
                Then insert sorted draft picks
            */
            console.log(draftPicks.isDefined());
            var temp = draftPicks.isDefined();
            temp.forEach(function (id) {
                console.log("#"+id);
                $("div#TeamList")
                    .append($(children).filter("#"+id));
            });
        });




        /* *******************************************
                          Perform Lottery
           ******************************************* */
        $("input#PerformLottery").click(function () {
            var teamCount   = $("div#TeamList > div.Team").length,
                pickCount   = draftPicks.definedCount(),
                chanceCount = Object.keys(lotteryChances).length;
                
            if (teamCount !== (pickCount + chanceCount)) {
                $("div#Options > div.ErrorIndicator")
                    .html("WARNING: draft line-up is not well-posed.")
                    .show();
            } else {
                $("div#Options > div.ErrorIndicator")
                    .html("")
                    .hide();
            }
            
            
            Object.keys(lotteryChances).forEach(function (id) {
                $("div#"+id)
                    .css("border-radius","1em")
                    .css("box-shadow","inset 0 0 1em 0.3em rgba(0,255,0,0.70)");
            });
            $("input#ConfirmLottery").show();

        });
        
        
        $("input#ConfirmLottery").click(function () {

        // An array that orders the object
        var idChancePair = Object.keys(lotteryChances)
                        .map(function (id) {
                            return {id:id,value:lotteryChances[id]};
                        }),
            Chances = idChancePair.map(function (kv){return kv.value});
            
            theLibraryLottery.percentages = Chances;
            
            var lotteryResults     = theLibraryLottery.sampleNRounds(500,true),
                lotteryTeamResults = [];

            lotteryResults.forEach(function (team,pick) {
                lotteryTeamResults.push({
                    id: idChancePair[team].id,
                    pick:   pick+1
                });
            });
            
            
            lotteryTeamResults.forEach(function (elem) {
                $("#"+elem.id)
                    .children("[name='DraftPick']")
                    .val(elem.pick);
            });
            
            console.log(lotteryTeamResults);
            
        });
        
        
    }(jQuery));
    
    

    return true;

}());


var theLibraryKeeper = League();
theLibraryKeeper.addTeam("Madison SkyShine","Troy Haskin",4,9);
theLibraryKeeper.addTeam("Picture of Boobs","Stephani Dalbesio",12,2);
theLibraryKeeper.addTeam("Zust More Boobs" ,"Myla Dalbesio",12,2);


theLibraryKeeper.team["Madison SkyShine"].draftInformation.draftPick = 1;
theLibraryKeeper.team["Picture of Boobs"].draftInformation.draftPick = 3;
theLibraryKeeper.team["Zust More Boobs"].draftInformation.draftPick = 2;

