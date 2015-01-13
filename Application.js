(function Application() {

    "use strict";
    
    var theLibraryKeeper  = League;
    var theLibraryLottery = Lottery;
    
    (function ($){
    
    
        var checkedCount = 0;
        $("[name='InLottery']").click(function (event) {
            $(this).siblings("[name='PickChance']").toggle();

            if ($(this).is(":checked")) {
                $(this).siblings("[name='DraftPick']").attr("disabled","disabled");
                $(this).siblings("[name='DraftPick']").css("background-color","#dddddd");
                checkedCount += 1;
            } else {
                $(this).siblings("[name='DraftPick']").removeAttr("disabled");
                $(this).siblings("[name='DraftPick']").css("background-color","#ffffff");
                checkedCount -= 1;
            }
                                    
            if (checkedCount === 1) {
                $("input#PerformLottery").show(100);
            }

            if (0 >= checkedCount) {
                $("input#PerformLottery").hide(100);
            }
        });
        
        $("[name='Name']").blur(function (event) {
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
        
        $("input#AddNewTeam").click( function (event) {
            var newTeam = $("div#BlankTeam").clone(true);
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
