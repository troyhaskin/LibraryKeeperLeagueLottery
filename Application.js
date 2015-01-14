(function Application() {

    "use strict";
    
    var theLibraryKeeper  = Object.create(League);
    var theLibraryLottery = Object.create(Lottery);
    
    (function ($){
    
        // Margin adjustments for the displayed headers
        var reMarginDiv = function (id) {
            var element = $("div#InputHeaders > div#"+id),
                labelLeft = $(element).offset().left,
                inputLeft = $("div#FirstTeam > input[name="+id+"]").offset().left;
            
            $(element).css("margin-left",inputLeft-labelLeft);
            
        };
        var labels = ["TeamName","DraftPick","InLottery"];
        labels.forEach ( function (id) {
            reMarginDiv(id);
        });
        
    
    
        var checkedCount = 0;
        $("[name='InLottery']").click(function (event) {
            var InLotteryCheckbox = this;
            
            $(this).siblings("[name='PickChance']").toggle(100, function () {
                if ($(InLotteryCheckbox).is(":checked")) {
                    $(InLotteryCheckbox).siblings("[name='DraftPick']").attr("disabled","disabled");
                    $(InLotteryCheckbox).siblings("[name='DraftPick']").css("background-color","#dddddd");
                    checkedCount += 1;
                } else {
                    $(InLotteryCheckbox).siblings("[name='DraftPick']").removeAttr("disabled");
                    $(InLotteryCheckbox).siblings("[name='DraftPick']").css("background-color","#ffffff");
                    checkedCount -= 1;
                }

                if (checkedCount === 1) {
                
                    // Show PickChance column and resize once
                    $("div#PickChance").show(100, function () {
                        if (undefined !== reMarginDiv) {
                            reMarginDiv("PickChance");
                            reMarginDiv = function (){}; // We're done with this function
                        }
                    });

                    
                    // Activate draft 
                    $("input#PerformLottery").show(100);
                    $("div#DraftColumn").css("pointer-events","");
                    $("div#DraftColumn > div.ColumnHeader").css("opacity",1);
                    
                }

                if (0 >= checkedCount) {

                    $("div#PickChance").hide(100);
                    
                    // Deactivate draft 
                    $("input#PerformLottery").hide(100);
                    $("div#DraftColumn").css("pointer-events","none");
                    $("div#DraftColumn > div.ColumnHeader").css("opacity",0.1);
                }
            });
        });
        
        $("[name='TeamName']").blur(function (event) {
            var TeamName   = $(this).val().trim(),
                PickChance = $(this).siblings("[name='PickChance']").val();
            
            $(this).parent().attr("id",$(TeamName.replace(/\s/g,'-')));
            
            if (PickChance != '') {
                TeamName = '<div>'+TeamName + ' ' + PickChance + '</div>';
                $(TeamName).appendTo("div#PreLotteryInformation");
            }
        });
        
        $("[name='RemoveTeam']").click(function (event) {
            $(this).parent().remove();
        });
        
        var inLotteryWidth = $("div#InLottery").width();
        $("[name='AddTeam']").click( function (event) {
            var newTeam = $("div#BlankTeam").clone(true);
            newTeam.siblings("[name='InLottery']").width(inLotteryWidth);
            $("div#League").append(newTeam.attr("id",""));
            newTeam.toggle(100);
        });
        
        
        
        
        
    }(jQuery));
    
    

    return true;

}());


var theLibraryKeeper = Object.create(League);

theLibraryKeeper.addTeam("Madison SkyShine","Troy Haskin",4,9);
theLibraryKeeper.addTeam("Picture of Boobs","Stephani Dalbesio",12,2);
theLibraryKeeper.addTeam("Zust More Boobs" ,"Myla Dalbesio",12,2);
