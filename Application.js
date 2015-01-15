(function Application() {

    "use strict";
    
    var theLibraryKeeper  = League();
    var theLibraryLottery = Lottery();
    
    (function ($){
    
        // Margin adjustments for the displayed headers
        var labels = ["TeamName","DraftPick","InLottery","PickChance"];
        labels.forEach ( function (id) {
            var element = $("div#InputHeaders > div#"+id),
                labelLeft = $(element).offset().left,
                inputLeft = $("div#FirstTeam > input[name="+id+"]").offset().left;
            
            $(element).css("margin-left",inputLeft-labelLeft);
        });
        
    
    
        /* *************************************
            Handle the lottery participants 
            and (de)activate draft column.
           ************************************* */
        var checkedCount = 0    ;
        var disableName  = ""   ;
        var enableName   = ""   ;
        $("[name='InLottery']").click(function (event) {
            
            // Entering or leaving lottery?
            if ($(this).is(":checked")) {
                checkedCount += 1           ;
                disableName  = "DraftPick"  ;
                enableName   = "PickChance" ;
            } else {
                checkedCount -= 1           ;
                disableName  = "PickChance" ;
                enableName   = "DraftPick"  ;
            }

            // Enable/disable appropriate inputs
            $(this).siblings("[name='"+disableName+"']")
                .attr("disabled","disabled")
                .css("background-color","rgba(0,0,0,0.1)");
            $(this).siblings("[name='"+enableName+"']")
                .removeAttr("disabled")
                .css("background-color","");
            

            if (checkedCount === 1) {
            
                // Show PickChance header and Activate draft column
                $("div#PickChance").css("color","");
                $("div#Lottery > div.Overlay").css("height","0%");
                
            }

            if (0 >= checkedCount) {
                
                // Dull PickChance header and Deactivate draft column
                $("div#PickChance").css("color","rgba(0,0,0,0.1)");
                $("div#Lottery > div.Overlay").css("height","100%");
            }

        });
        
        
        /* *************************************

           ************************************* */
        function checkForDraftReadyStatus () {
        };
        
        $("[name='TeamName']").blur(function () {
            var TeamName   = $(this).val().trim(),
                PickChance = parseInt($(this).siblings("[name='PickChance']").val());
            
            if ( '' !== TeamName) {
                $(this).parent().attr("id",TeamName.replace(/\s/g,'-'));

                
                //
                if (!isNaN(PickChance) && 
                    PickChance >= 0    && 
                    PickChance <= 1) {
                    
                    
                }

            }
        });



        /* *************************************
                       Remove a team
           ************************************* */
        $("[name='RemoveTeam']").click(function (event) {
            $(this).parent().remove();
        });
                
                
                
        /* *************************************
                         Add a team
           ************************************* */
        $("[name='AddTeam']").click( function (event) {
            $("div#TeamList")
                .append($("div#BlankTeam")
                    .clone(true)
                    .attr("id","")
                    .toggle());
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

