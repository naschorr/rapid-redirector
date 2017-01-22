/* Globals */
const DEBUG_MODE = false;
/* End Globals */

/** 
 * @ignore
 * Outputs the currently saved redirection rules to the console.
 */
function dumpCurrentRules() {
	chrome.storage.sync.get("redirectionRules", function(result) {
		var rules = result.redirectionRules || [];
		if(rules.length > 0) {
			console.log("Currently saved rules: ");

			rules.forEach(function(rule) {
				console.log(`\t${rule}`);
			});
		}else{
			console.log("No saved rules available");
		}
	})
}

/** 
 * @ignore
 * Deletes all saved redirection rules.
 */
function clearRules() {
	chrome.storage.sync.set({redirectionRules: []}, function() {
		console.log('Redirection rules cleared');
	})
}

/** 
 * @ignore 
 * Debugging wrapper for console.log(), where messages only get output if debug mode is enabled (DEBUG_MODE = true;)
 */
function debugLog(output) {
	if(DEBUG_MODE) {
		console.log(output);
	}
}