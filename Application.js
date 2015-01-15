(function Application() {

    "use strict";
    
    var theLibraryKeeper  = Object.create(League);
    var theLibraryLottery = Object.create(Lottery);
    
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
                $("div#DraftColumn").css("pointer-events","");
                $("div#DraftColumn > div.ColumnHeader").css("opacity",1);
                
            }

            if (0 >= checkedCount) {
                
                // Dull PickChance header and Deactivate draft column
                $("div#PickChance").css("color","rgba(0,0,0,0.1)");
                $("div#DraftColumn").css("pointer-events","none");
                $("div#DraftColumn > div.ColumnHeader").css("opacity",0.1);
            }

        });
        
        
        /* *************************************
            Handle the lottery participants 
            and activate draft column.
           ************************************* */
        $("[name='TeamName']").blur(function (event) {
            var TeamName   = $(this).val().trim(),
                PickChance = $(this).siblings("[name='PickChance']").val();
            
            $(this).parent().attr("id",$(TeamName.replace(/\s/g,'-')));
            
            if (PickChance != '') {
                TeamName = '<div>'+TeamName + ' ' + PickChance + '</div>';
                $(TeamName).appendTo("div#PreLotteryInformation");
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




