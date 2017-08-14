/* Globals */
let debugMode = false;
const BROWSER_ACTION_ACTIVE_ICON_PATH = "../images/icon_38.png";
const BROWSER_ACTION_INACTIVE_ICON_PATH = "../images/icon_inactive_38.png";
/* End Globals */

/**
 * Class that handles storage and error handling of RegExp objects to be used during page redirection.
 */
class Utilities {
	/**
	 * @ignore
	 * Loads a localized string of text (via chrome.i18n)
	 */
	static loadI18n(message) {
		if(chrome.i18n == undefined) {
			console.error(`Chrome.i18n undefined, can't load the text '${message}'`);
			return message;
		}

		try{
			return chrome.i18n.getMessage(message);
		}
		catch(e) {
			if(e instanceof TypeError){
				console.error(`TypeError in ${arguments.callee} for text '${message}'`);
				return message;
			}else{
				console.error(`Unhandled error in ${arguments.callee} for text '${message}'`);
				return message;
			}
		}

	}

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
			console.log("Redirection rules cleared");
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

	/**
	 * Update the extension's browserAction icon.
	 * @param {int} state - The current redirection state of the extension (0 = Disabled, 1 = Enabled).
	 */
	static updateBrowserActionIcon(state) {
		let iconPath = (state === 1) ? BROWSER_ACTION_ACTIVE_ICON_PATH : BROWSER_ACTION_INACTIVE_ICON_PATH;

		chrome.browserAction.setIcon({
			path: {"38": `${iconPath}`}
		});
	}
}

/**
 * Builds a string with another string inserted into it at a certain index.
 * @param {string} insertStr - The string to insert
 * @param {int=} index - The index to insert into
 * @return {string} The string with the inserted string inside it
 */
String.prototype.insertAt = function(insertStr, index=0) {
	if(!index) {
		index = 0;
	}

	return this.substring(0, index) + insertStr + this.substring(index, this.length);
};

/**
 * Like String.slice(), except it removes the characters between the indicies (inclusive), and returns the rest as one string.
 * @param {int} startIndex - The index to start removing characters at.
 * @param {int} endIndex - The index to end removing characters at (inclusive).
 * @return {string} The string with the characters between the indicies removed.
 */
String.prototype.antiSlice = function(startIndex, endIndex) {
	if(!startIndex) {
		startIndex = 0;
	}
	if(!endIndex) {
		endIndex = 0;
	}

	return this.substring(0, startIndex) + this.substring(endIndex, this.length);
};

/**
 * Pushes an object onto the end of an array, and then returns the new array. Basically the same as Python's array.append().
 * @param {Object} object - The object to push into the array.
 * @return {Array.Object} The original array with the new object pushed into it.
 */
Array.prototype.append = function() {
	let args = Array.prototype.slice.call(arguments);
	let self = this;
	args.forEach(function(arg) {
		self.push(arg);
	});
	return this;
};