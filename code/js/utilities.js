/* Globals */
let debugMode = false;
/* End Globals */

/**
 * Class that handles storage and error handling of RegExp objects to be used during page redirection.
 */
class Utilities {
	/** 
	 * @ignore
	 * Outputs the currently saved redirection rules to the console.
 	*/
	static dumpCurrentRules() {
		chrome.storage.sync.get("redirectionRules", function(result) {
			let rules = result.redirectionRules || [];
			if(rules.length > 0) {
				console.log("Currently saved rules: ");

				rules.forEach(function(rule) {
					console.log(`\t${rule}`);
				});
			}else{
				console.log("No saved rules available");
			}
		});
	}

	/** 
	 * @ignore
	 * Deletes all saved redirection rules.
	 */
	static clearRules() {
		chrome.storage.sync.set({redirectionRules: []}, function() {
			console.log('Redirection rules cleared');
		});
	}

	/** 
	 * @ignore 
	 * Debugging wrapper for console.log(), where messages only get output if debug mode is enabled (DEBUG_MODE = true;)
	 */
	static debugLog(output) {
		if(debugMode) {
			console.log(output);
		}
	}

	/**
	 * @ignore
	 * Enables debug mode, and thus debugLog
	 */
	static enableDebugging() {
		debugMode = true;
	}

	/**
	 * @ignore
	 * Disables debug mode, and thus debugLog
	 */
	static disableDebugging() {
		debugMode = false;
	}
}

/**
 * Builds a string with another string inserted into it at a certain index.
 * @param {string} insertStr - The string to insert
 * @param {int} index - The index to insert into
 * @return {string} The string with the inserted string inside it
 * TODO: add testing for this into the spec
 */
String.prototype.insertAt = function(insertStr, index) {
	return this.substr(0, index) + insertStr + this.substr(index, this.length - 1);
}

/**
 * Like String.slice(), except it removes the characters between the indicies (inclusive), and returns the rest as one string.
 * @param {int} startIndex - The index to start removing characters at.
 * @param {int} endIndex - The index to end removing characters at (inclusive).
 * @return {string} The string with the characters between the indicies removed.
 * TODO: add testing for this into the spec
 */
String.prototype.antiSlice = function(startIndex, endIndex) {
	return this.substr(0, startIndex) + this.substr(endIndex + 1, this.length - 1);
}