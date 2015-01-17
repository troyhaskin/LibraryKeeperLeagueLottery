@Echo off
SetLocal EnableDelayedExpansion

Del Monolith.js
echo (function () {             >> Monolith.js
type "uheprng.js"               >> Monolith.js
type "Augment_Array.js"         >> Monolith.js"
type "jquery-2.1.3.min.js"      >> Monolith.js"
type "Spec_DraftInformation.js" >> Monolith.js"
type "Spec_Team.js"             >> Monolith.js"
type "Spec_League.js"           >> Monolith.js"
type "Spec_Lottery.js"          >> Monolith.js"
type "theLibraryCnB.js"         >> Monolith.js"
type "Application.js"           >> Monolith.js
echo }());                      >> Monolith.js

"C:\Program Files (x86)\Mozilla Firefox\firefox.exe" -new-tab .\Main.html

