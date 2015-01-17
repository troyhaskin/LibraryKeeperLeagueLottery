function makeObject(objectSpec) {
    "use strict";
    if (objectSpec.proto === undefined) {
        return false;
    }
    var newObject = Object.create(objectSpec.proto);
    if (objectSpec.prop !== undefined) {
        Object.defineProperties(newObject,objectSpec.prop);
    }
    return newObject;
}


var theLibCnB = (function () {

    "use strict";

    var menu     = {}           ,
        makeItem = makeObject   ;
    
    var theLibProto = {
        order:
            function (itemName) {
                if(menu[itemName] !== undefined) {
                    return makeItem(menu[itemName]);
                } else {
                    return false;
                }
            },
        putOnMenu:
            function (item) {
                if (menu[item.name] === undefined) {
                    menu[item.name] = {};
                }
                menu[item.name].proto = item.proto;
                menu[item.name].prop  = item.prop ;
                return true;
            },
        onMenu:
            function (itemName) {
                return (menu[item] !== undefined);
            }
    };
    var theLibProp = {
        menu: {
            enumerable: true,
            get: function () {
                return Object.keys(menu);
            }
        }
    };


    var theLib = makeItem({
        proto:theLibProto,
        prop: theLibProp
    });
    
    
    theLib.putOnMenu(draftSpec());
    theLib.putOnMenu(teamSpec());
    theLib.putOnMenu(leagueSpec());
    theLib.putOnMenu(lotterySpec());

    
    return theLib;

}());








