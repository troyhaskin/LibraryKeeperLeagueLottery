@Echo off
SetLocal EnableDelayedExpansion

Del Monolith.js
echo (function () {             >> Monolith.js
type "Resources\uheprng.js"               >> Monolith.js
type "Resources\Augment_Array.js"         >> Monolith.js
type "Resources\jquery-2.1.3.min.js"      >> Monolith.js
type "Resources\Spec_DraftInformation.js" >> Monolith.js
type "Resources\Spec_Team.js"             >> Monolith.js
type "Resources\Spec_League.js"           >> Monolith.js
type "Resources\Spec_Lottery.js"          >> Monolith.js
type "Resources\theLibraryCnB.js"         >> Monolith.js
type "Resources\Application.js"           >> Monolith.js
echo }());                      >> Monolith.js

"C:\Program Files (x86)\Mozilla Firefox\firefox.exe" -new-tab .\Main.html

