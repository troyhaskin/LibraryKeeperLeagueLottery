(function Application() {

    "use strict";
    
    var theLibraryLottery = theLibCnB.order("lottery");
        
    
    function addEntropyToLottery() {
        for ( var k = 0; k < 50; k++) {
            theLibraryLottery
                .prng.addEntropy(theLibraryLottery
                                    .prng.string(16));
        }
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
                .append($(newTeam).show(100,'linear'));
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
                canLottery  = chanceCount >  1,
                canSort     = (pickCount   >= 1) || canLottery;
                
            toggleOptionButtons(canSort,canLottery);
        }
        function toggleOptionButtons(canSort,canLottery) {
            if (canSort) {
                $("input#SortByDraft").removeAttr("disabled");
            } else {
                $("input#SortByDraft").attr("disabled","disabled");
            }
            
            if (canLottery) {
                $("input#ConfirmDraftInformation").removeAttr("disabled");
            } else {
                $("input#ConfirmDraftInformation").attr("disabled","disabled");
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
                            .html("The chance of a pick must be a strictly positive number.")
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
            
            // Pull out the Teams either with a Pick or Chance
            var idSelector = "#" + draftPicks.isDefined()
                                   .concat(Object.keys(lotteryChances))
                                   .join(',#'),
                children = $("div#TeamList")
                            .children(idSelector)
                                .detach(),
                sortedIDs = [];
            /*
                Sort lottery team IDs
            */
            if (Object.keys(lotteryChances).length > 0) {
                var idChancePair = Object.keys(lotteryChances)
                                .map(function (id) {
                                    return {id:id,value:lotteryChances[id]};
                                });
                idChancePair.sort(function (a,b){return -(a.value - b.value)});

                sortedIDs = idChancePair.map(function (elem) {
                    return (elem.id);
                });
            }

            /*
                Draft picks are sorted by default
            */
            sortedIDs = sortedIDs.concat(draftPicks.isDefined());
            
            /*
                Reinsert into DOM and show
            */
            $("div#TeamList").hide()
                .append($(children).filter("#"+sortedIDs.join(",#")));
            
        });




        /* *******************************************
                          Perform Lottery
           ******************************************* */
        $("input#ConfirmDraftInformation").click(function () {
            var teamCount   = $("div#TeamList > div.Team").length,
                pickCount   = draftPicks.definedCount(),
                chanceCount = Object.keys(lotteryChances).length;
                
            // Check for well-posedness
            if (teamCount !== (pickCount + chanceCount)) {
                $("div#Controls div#IllPosedDraft")
                    .show();
            } else {
                $("div#Controls div#IllPosedDraft")
                    .hide();
            }
            
            
            // 
            var minExplicitPick = 1E8;
            for(var k = 0; k < draftPicks.length; k++) {
                if (draftPicks[k] !== undefined) {
                    minExplicitPick = k;
                    break;
                }
            }

            if (minExplicitPick <= chanceCount) {
                // Pad draftPicks array
                var pad = [];
                pad[chanceCount-minExplicitPick] = undefined;
                draftPicks = pad.concat(draftPicks);
                
                // Update draft pick values
                draftPicks.forEach( function (id,pick) {
                    $("#"+id)
                        .children("[name='DraftPick']")
                            .val(pick);
                });
                
                // Show log
                $("div#Controls div#IncrementedExplicitPicks")
                    .show();
            } else {
                $("div#Controls div#IncrementedExplicitPicks")
                    .hide();
            }
            
            
            // Highlight the lottery teams
            Object.keys(lotteryChances).forEach(function (id) {
                $("div#"+id)
                    .css("border-radius","1em")
                    .css("background-color","rgba(0,255,0,0.40)")
                    .css("border","2px solid green");
            });
            
            // Activate button and show log information
            $("input#PerformLottery").removeAttr("disabled");
            $("div#Controls div.Log div.LotteryParticipants").show();

        });
        
        
        
        $("input#PerformLottery").click(function () {
        
            addEntropyToLottery();

        // An array that serializes the object into an array.
        var idChancePair = Object.keys(lotteryChances)
                        .map(function (id) {
                            return {id:id,value:lotteryChances[id]};
                        }),
            Chances = idChancePair.map(function (kv){return kv.value});
            
            // Set the chances
            theLibraryLottery.percentages = Chances;
            
            var lotteryResults = theLibraryLottery.sampleNRounds(1000,true),
                lotteryIDs     = [];

            lotteryIDs = lotteryResults.map(function (chosenIndex) {
                return idChancePair[chosenIndex].id;
            });
            
            
            // Sort elements by  pick
            var previousElement = "div#InputHeaders",
                theID = '',
                team;
            lotteryIDs.forEach(function (id,pick) {
                theID = "#"+id;
                team = $(theID).detach();
                $(previousElement).after(team);
                previousElement = theID;
            });
            
            // Pick value to lottery one
            lotteryIDs.forEach(function (id,pick) {
                $("#"+id)
                    .children("[name='DraftPick']")
                        .val(pick+1);
            });
        });
        
        
    }(jQuery));
    
    

    return true;

}());



var theLibKeeper = theLibCnB.order("league");


theLibKeeper.addTeam("Madison SkyShine","Troy Haskin",4,9);
theLibKeeper.addTeam("Picture of Boobs","Stephani Dalbesio",12,2);
theLibKeeper.addTeam("Zust More Boobs" ,"Myla Dalbesio",12,2);


theLibKeeper.team["Madison SkyShine"].draftInformation.draftPick = 1;
theLibKeeper.team["Picture of Boobs"].draftInformation.draftPick = 3;
theLibKeeper.team["Zust More Boobs"].draftInformation.draftPick = 2;

