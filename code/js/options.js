/* Globals */
let CURRENT_RULES_TEXT;
let NO_RULES_TEXT;
let NO_EMPTY_TEXT;
let NO_DUPS_TEXT;
let NO_CYCLES_TEXT;
let MISMATCHED_SUBDOMAINS_TEXT;
let MISMATCHED_PROTOCOLS_TEXT;
let MISMATCHED_SUBSTITUTIONS_TEXT;
/* End Globals */

/* Note: 'Rule' refers to the combination of the source and destination domains. */

/* Methods */
/**
 * Determines if a given object has the specified key and if the object has the given key, value pair.
 * @param {object} obj - The object to be checked.
 * @param {string} key - The name of the key to look for.
 * @param {string} value - The name of the value to check for.
 * @return {boolean} True if the object does have the key and corresponding value. False if it doesn't.
 */
function hasValue(obj, key, value) {
	return obj.hasOwnProperty(key) && obj[key] === value;
}

/**
 * Determines if a given string contains non-whitespace characters (and isn't empty).
 * @param {string} string - The string to be checked.
 * @return {boolean} True if the string does have non-whitespace characters. False if it doesn't.
 */
function hasChars(string) {
	/* '\S' checks for non-whitespace characters. */
	if(/\S/.test(string)) {
		return true;
	}
	return false;
}

/**
 * Gets the index associated with a given button's id. This index can then be used to delete specific redirection rules.
 * @param {string} buttonId - The id associated with a button in the current rules table.
 * @return {(int|null)} The integer representing the button's index in the rules table, or null if there isn't a valid index.
 */
function getButtonIndex(buttonId) {
	try {
		var index = parseInt(buttonId.match(/([0-9])+/)[0], 10);
	}
	catch (error){
		if(error instanceof TypeError) {
			console.error(`TypeError in getButtonIndex(). Arg: "${buttonId}" Error: ', ${error}`);
			return null;
		}
	}

	return index;
}

/**
 * Attempts to remove the protocol, leading forward slashes, and the path from a URL.
 * @param {string} url - The url to (attempt to) remove the protocol and path from/
 * @return {string} url - The resulting domain, or the url if a domain couldn't be found.
 */
function getDomain(url) {
	/* Need to combine these regexs into one statement somehow */
	var noProtocol = /\/\/(.+)/i.exec(url);
	if(noProtocol) {
		noProtocol = noProtocol[1];
	}else{
		noProtocol = url;
	}

	var noPath = /(.+?)\//i.exec(noProtocol);
	if(noPath) {
		noPath = noPath[1];
	}else{
		noPath = url;
	}
	return noPath;
}

/**
 * Attempts to calculate the difference in the number of subdomains beteween the source and destination domains. This can potentially forecast some redirection problems if a difference is present.
 * @param {string} source - The domain to redirect from.
 * @param {string} destination - The domain to redirect to.
 * @return {int} The difference in subdomain counts between the source and destination.
 */
function calcSubdomainDifference(source, destination) {
	source = getDomain(source);
	destination = getDomain(destination);

	var longer;
	var shorter;
	/* Determine which domain is longer */
	if(destination.length >= source.length) {
		longer = destination;
		shorter = source;
	}else{
		longer = source;
		shorter = destination;
	}

	/* Attempt to remove the smaller domain from the larger domain. */
	var postReplace = longer.replace(shorter, "");

	/* If the removal wasn't successful, then return a difference of 0. */
	if(postReplace.length === longer.length) {
		return 0;
	}

	/* Count the periods remaining after the removal operation. This can roughly determine if there was a difference in number of subdomains. */
	var periodCounter = 0;
	for(var i = 0; i < postReplace.length; i++) {
		if(postReplace.charAt(i) === ".") {
			periodCounter++;
		}
	}

	return periodCounter;
}

/**
 * Determines if the suplied URLs both either have or don't have protocols.
 * @param {string} source - The source URL.
 * @param {string} destination - The destination URL.
 * @return {boolean} True if both the source and destination URLs either have or don't have a protocol. False if one has a protocol and the other doesn't.
 */
function hasMismatchedProtocol(source, destination) {
	var protocolRegex = new RegExp("^.+?:\/\/");

	return (protocolRegex.test(source) !== protocolRegex.test(destination));
}

/**
 * Determines if the proposed redirection rule is valid, and thus can be added to the array of active rules. Also alerts the user with a notification if the rule fails a test.
 * @param {string} source - The proposed domain to redirect from.
 * @param {string} destination - The proposed domain to redirect to.
 * @param {array} rules - Array of 'rules' objects to check against. {src:"source URL (or regex pattern)", dest:"destination URL", regex:boolean if .src is a regex}
 * @param {object} regexGroups - Object containing count of regex capture groups, (key: captureGroups) and a list substitution groups (key: substitutionGroups)
 * @return {boolean} True if the proposed redirection rule passes the tests. False if it doesn't.
 */
function isValidInput(source, destination, rules, regexGroups=null) {
	/* Can't be empty or only have whitespace characters. */
	if(!hasChars(source) || !hasChars(destination)) {
		new NotificationPopup("red", "alert", [], NO_EMPTY_TEXT);
		return false;
	}

	/* Can't have duplicate sources. */
	if(rules.some(function(obj) {
		return hasValue(obj, "src", source);
	})) {
		new NotificationPopup("red", "alert", [], NO_DUPS_TEXT);
		return false;
	}

	/* Can't have a new source that's already a destination. */
	if(rules.some(function(obj) {
		return hasValue(obj, "dest", source);
	})) {
		new NotificationPopup("red", "alert", [], NO_CYCLES_TEXT);
		return false;
	}

	/* 
		Could still be a valid rule, but alert users to potential issues with their source and destination subdomain counts. 
		(ex. amazon.com -> smile.amazon.com won't work, but www.amazon.com -> smile.amazon.com will work.) 
	*/
	if(calcSubdomainDifference(source, destination) > 0) {
		new NotificationPopup("green", "success", [], MISMATCHED_SUBDOMAINS_TEXT);
	}

	/*
		Again, could still work out, but check if both the source and destination both either have or don't have a protocol section in the url.
		(ex. chrome://newtab -> reddit.com won't work, but chrome://newtab -> https://reddit.com will work.)
	*/
	if(hasMismatchedProtocol(source, destination)) {
		new NotificationPopup("green", "success", [], MISMATCHED_PROTOCOLS_TEXT);
	}

	/*
		This could also likely work, however the user should be alerted that one or more of their substitution groups in
		the destination doesn't point to a capture group in the source address. (ex. turbo.cars.com/vdp/(d+) -> 
		www.cars.com/vehicledetail/detail/$1/$2/ won't work, since the source address doesn't have a second capture
		group). Also, the invalid substitution group indices get parsed out later on.
	*/
	if(regexGroups && regexGroups.substitutionGroups.some((groupIndex) => groupIndex > regexGroups.captureGroups)) {
		new NotificationPopup("green", "success", [], MISMATCHED_SUBSTITUTIONS_TEXT);
	}

	return true;
}

/**
 * Parses the source and destination strings for meta regex info, specifically about how many capture groups exist in
 * the source, and what the substitution indices are in the destination.
 * @param {string} source - The domain to redirect from, to check for capture groups.
 * @param {string} destination - The domain to redirect to, to check for substitutions.
 */
function parseRegexGroups(source, destination) {
	source = source || "";
	destination = destination || "";

	const substitutionGroupMatches = destination.match(new RegExp(/\$\d/g));

	return {
		captureGroups: new RegExp(source + "|").exec("").length - 1,	// Thanks! https://stackoverflow.com/a/16046903
		substitutionGroups: (substitutionGroupMatches || []).map((group) => parseInt(group.slice(1)))
	};
}

/**
 * Stores a given source and destination domain into chrome's storage as a rule.
 * @param {string} source - The domain to redirect from.
 * @param {string} destination - The domain to redirect to.
 * @param {boolean} isRegex - True if the rule uses regex, False if it doesn't.
 */
function storeRule(source, destination, isRegex) {
	try{
		// Object format = {src:"source URL (or regex pattern)", dest:"destination URL", regex:boolean if .src is a regex}
		chrome.storage.sync.get("redirectionRules", function(result) {
			const rules = result.redirectionRules || [];
			let regexGroups = null;
			if(isRegex) {
				regexGroups = parseRegexGroups(source, destination);
			}

			if(isValidInput(source, destination, rules, regexGroups)) {
				source = source.trim();
				const rule = {
					src: source,
					dest: destination.trim(),
					regex: isRegex
				};

				if(isRegex) {
					// Filter out all substitutions that try to match a capture group that doesn't exist
					rule.substitutionGroups = regexGroups.substitutionGroups.filter((group) => {
						return group <= regexGroups.captureGroups;
					});
				}
				rules.push(rule);

				chrome.storage.sync.set({redirectionRules: rules}, function() {
					chrome.runtime.sendMessage({addRule: source});
					Utilities.debugLog(`Added new rule: '${source}' -> '${destination}', regex: ${isRegex}`);
					updateRulesTable();
				});
			}else{
				Utilities.debugLog(`Failed to add rule: '${source}' -> '${destination}', isRegex: '${isRegex}'.`);
			}
		});
	}
	catch(e) {
		if(e instanceof TypeError){
			console.error(`TypeError in ${arguments.callee}`);
		}
	}
}

/**
 * Deletes a redirection rule. Uses the index stored in the delete button's id to delete the rule.
 * @param {string} buttonId - The id of the delete button for a given rule.
 */
function deleteRule(buttonId) {
	var buttonIndex = getButtonIndex(buttonId);

	/* Make sure that there is a legitimate index to delete with */
	if(buttonIndex === null) {
		Utilities.debugLog(`Invalid button index from button: ${buttonId}`);
		return;
	}

	try{
		chrome.storage.sync.get("redirectionRules", function(result) {
			var rules = result.redirectionRules || [];
			var removed = rules.splice(buttonIndex, 1)[0];

			chrome.storage.sync.set({redirectionRules: rules}, function() {
				chrome.runtime.sendMessage({deleteRule: removed.src});
				Utilities.debugLog(`Rule associated with ${buttonId} has been deleted`);
				updateRulesTable();
			});
		});
	}
	catch(e) {
		if(e instanceof TypeError){
			console.error(`TypeError in ${arguments.callee}`);
		}
	}
}

/**
 * Adds a listener for a specific delete button. When triggered, it'll try to delete the corresponding redirection rule.
 * @param {string} buttonId - The id of the button to receive the listener.
 */
function addBtnListener(buttonId) {
	document.getElementById(buttonId).addEventListener("click", function() {
		Utilities.debugLog(`listener triggered for ${buttonId}`);
		deleteRule(buttonId);
	});
}

/**
 * Builds a formatted HTML table of all current redirection rules, as well as sets up the buttons used to delete individual rules.
 */
function buildRulesTable() {
	try{
		chrome.storage.sync.get("redirectionRules", function(result) {
			let rules = result.redirectionRules || [];

			if(rules.length > 0) {
				let tableContainer = document.getElementById("currentRulesTableContainer");
				document.getElementById("currentRulesStatus").innerHTML = CURRENT_RULES_TEXT;

				let table = document.createElement("table");
				table.id = "currentRulesTable";
				tableContainer.appendChild(table);

				/* Generate the table */
				rules.forEach(function(rule, index) {
					/* Build a new row for the table */
					let tr = table.insertRow();

					/* Add in source cell */
					tr.insertCell().appendChild(document.createTextNode(rule.src));

					/* Add in arrow cell and add in regex class if the rule uses regex */
					let arrow = tr.insertCell();
					let span = document.createElement("span");
					span.className = "arrow";
					if(rule.regex) {
						span.classList.add("regex-rule");
					}
					arrow.appendChild(span);

					/* Add in destination cell */
					tr.insertCell().appendChild(document.createTextNode(rule.dest));

					let buttonCell = tr.insertCell();
					let buttonElement = document.createElement("BUTTON");
					buttonElement.className = "delete-rule-button right";
					buttonElement.id = `deleteRuleButton-${index}`;
					buttonCell.appendChild(buttonElement);

					/* Add the listener to the button */
					addBtnListener(`deleteRuleButton-${index}`);
				});

			}else{
				document.getElementById("currentRulesStatus").innerHTML = NO_RULES_TEXT;
			}
		});
	}
	catch(e) {
		if(e instanceof TypeError){
			console.error(`TypeError in ${arguments.callee}`, e);
		}
	}
}

/**
 * Deletes the HTML table of redirection rules.
 */
function deleteRulesTable() {
	/* Should also delete the listeners that the buttons reference. */
	var table = document.getElementById("currentRulesTable");
	if(table) {
		/* Don't delete the table if it doesn't exist. */
		table.parentNode.removeChild(table);
	}
}

/**
 * 'Updates' the HTML table of redirection rules by deleting it, and then rebuilding it.
 */
function updateRulesTable() {
	deleteRulesTable();
	buildRulesTable();
}

/**
 * Load the localized text from messages.json (via chrome.i18n), and apply the strings to forward facing elements of the interface.
 */
function loadLocalizedText() {
		/* Load globals */
	CURRENT_RULES_TEXT = Utilities.loadI18n("options_current_rules_string");
	NO_RULES_TEXT = Utilities.loadI18n("options_no_rules_string");
	NO_EMPTY_TEXT = Utilities.loadI18n("options_no_empty_rule_string");
	NO_DUPS_TEXT = Utilities.loadI18n("options_no_duplicates_string");
	NO_CYCLES_TEXT = Utilities.loadI18n("options_no_cycles_string");
	MISMATCHED_SUBDOMAINS_TEXT = Utilities.loadI18n("options_mismatched_subdomains_string");
	MISMATCHED_PROTOCOLS_TEXT = Utilities.loadI18n("options_mismatched_protocols_string");
	MISMATCHED_SUBSTITUTIONS_TEXT = Utilities.loadI18n("options_mismatched_substitutions_string");

	document.title = Utilities.loadI18n("options_title");
	document.getElementById("addRuleStatus").innerHTML = Utilities.loadI18n("options_add_rule_string");
	document.getElementById("addRuleMobile").placeholder = Utilities.loadI18n("options_new_source_placeholder");
	document.getElementById("addRuleDesktop").placeholder = Utilities.loadI18n("options_new_destination_placeholder");
	document.getElementById("addRuleConfirm").value = Utilities.loadI18n("options_add_rule_button");
	document.getElementById("addRuleOrRegexText").innerHTML = Utilities.loadI18n("options_add_rule_or_regex");
	document.getElementById("addRegexConfirm").value = Utilities.loadI18n("options_add_regex_button");
}
/* End Methods */


/* Localization Init */
document.addEventListener("DOMContentLoaded", loadLocalizedText());
/* End Localization */

/* Listener Init */
document.addEventListener("DOMContentLoaded", buildRulesTable());

var mobileInputElement = document.getElementById("addRuleMobile");
var desktopInputElement = document.getElementById("addRuleDesktop");

var addRuleBtn = document.getElementById("addRuleConfirm");
addRuleBtn.addEventListener("click", function() {
	/* Store the rule */
	storeRule(mobileInputElement.value, desktopInputElement.value, false);
	/* Clear the input box's text */
	mobileInputElement.value = "";
	desktopInputElement.value = "";
});

var addRegexBtn = document.getElementById("addRegexConfirm");
addRegexBtn.addEventListener("click", function() {
	/* Store the rule */
	storeRule(mobileInputElement.value, desktopInputElement.value, true);
	/* Clear the input box's text */
	mobileInputElement.value = "";
	desktopInputElement.value = "";
});
/* End Listener Init */
