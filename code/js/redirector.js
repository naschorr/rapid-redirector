/* Globals */
const MOBILE_SUBDOMAINS = ["m", "mobile", "mobi"];
var regexLookup;
var redirectionTracker;
let NAME;
let REDIRECTING_TO;
/* End Globals */

/* Methods */
/**
 * Checks if the URL can be found in the supplied set of redirection rules.
 * @param {string} url - The url to check.
 * @param {array} rules - Array of 'rules' objects to check against. {src:"source URL (or regex pattern)", dest:"destination URL", regex:boolean if .src is a regex}
 * @return {(string|null)} String containing the newly redirected URL. Null if a redirection doesn't exist.
 */
function isRedirectRule(url, rules) {
	if(!url) {
		return null;
	}

	let match = null;
	let index = 0;
	let newUrl;

	while(!match && index < rules.length) {
		let rule = rules[index];

		if(rule.regex) {
			let result = regexLookup.get(rule.src).exec(url);
			if(result) {
				let substitution = rule.dest;
				rule.substitutionGroups.forEach((group) => {
					if(result[group]) {
						substitution = substitution.replace('$' + group.toString(), result[group].toString());
					}
				});

				newUrl = url.antiSlice(result.index, result.index + result[0].length).insertAt(substitution, result.index);
			}
		}else{
			newUrl = url.replace(rules[index].src, rules[index].dest);
		}

		if(newUrl !== url) {
			match = newUrl;
		}

		index++;
	}

	return match;
}

/**
 * Checks if the URL is a mobile URL. (ex. en.m.wikipedia.org or mobile.twitter.com)
 * @param {string} url - The url to check.
 * @return {(string|null)} String containing the now non-mobile URL. Null if it's not a mobile URL.
 */
function isMobile(url) {
	if(!url) {
		return null;
	}

	try {
		var domain = /\/\/(\S+?)\//.exec(url)[1];
		var domainTokens = domain.split(".");
	}
	catch (e) {
		if(e instanceof TypeError) {
			Utilities.debugLog(e, `TypeError in isMobile(). Arg: "${url}". Error: ${e}`);
		}
		else{
			Utilities.debugLog(e, `Unhandled error in isMobile(). Arg: "${url}". Error: ${e}`);
		}
		return null;
	}

	/* 
		Basically, just loop through the array of domain tokens and check each mobile subdomain against it.
		If a match is found, stop the loop, and replace the url's domain with the new non-mobile one. Theres probaby a better way to do this.
	*/
	var domainIndex = 0;
	var mobileIndex = 0;
	var match = null;
	while(!match && domainIndex < domainTokens.length) {
		while(!match && mobileIndex < MOBILE_SUBDOMAINS.length) {
			if(domainTokens[domainIndex] === MOBILE_SUBDOMAINS[mobileIndex]) {
				domainTokens.splice(domainIndex, 1);
				match = url.replace(domain, domainTokens.join("."));
			}
			mobileIndex++;
		}
		domainIndex++;
		mobileIndex = 0;
	}

	return match;
}

/**
 * Builds and populates the regex lookup dictionary with a set of {src:RegExp} pairs for every redirection rule that uses regex.
 * @return {.RegexLookup} RegexLookup object containing the list of rules that use regex.
 */
function generateRegexLookup() {
	var regexLookup = new RegexLookup();

	chrome.storage.sync.get("redirectionRules", function(result) {
		(result.redirectionRules || []).forEach(function(rule) {
			if(rule.regex) {
				regexLookup.add(rule.src);
			}
		});
	});
	
	return regexLookup;
}

/**
 * Push a browser notification to the user to alert when they're being redirected.
 * @param {string} redirectUrl - The url that's being redirected to
 */
function pushRedirectNotification(redirectUrl) {
	// Format the notification with NotificationOptions
	let options = {
		type: "basic",
		title: NAME,
		message: `${REDIRECTING_TO}:\n${redirectUrl}`,
		iconUrl: "images/icon_512.png"
	};

	// Push the notification
	chrome.notifications.create(NAME, options);
}

/**
 * Load the localized text from messages.json (via chrome.i18n) for later use.
 */
function loadLocalizedText() {
	NAME = Utilities.loadI18n("name");
	REDIRECTING_TO = Utilities.loadI18n("notification_redirecting_to");
}
/* End Methods */


/* Localization Init */
loadLocalizedText();
/* End Localization Init */

/* Generate the regex lookup on startup */
regexLookup = generateRegexLookup();

/* Declare the redirection tracker on startup */
redirectionTracker = new RedirectionTracker();

/* Listener Init */
// Consider changing to event filters -- https://developer.chrome.com/extensions/event_pages#best-practices #4
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	let url = tab.url;
	/* 
		Make sure that redirection is enabled, and that the url we just redirected from isn't the same as the one we're redirecting to. 
		This helps to prevent getting stuck in redirection loops, and losing control of the browser's back button.
	*/
	if (changeInfo.status == "loading" && redirectionTracker.canRedirect(tabId, url)) {
		chrome.storage.sync.get({redirection: 1}, function(items) { // Default to redirection enabled.
			if(items.redirection === 1) {
				chrome.storage.sync.get("redirectionRules", function(result) {
					let rules = result.redirectionRules;

					/* Attempt to get a URL to redirect to */
					let redirectUrl = null;
					if(rules && rules.length > 0) {
						redirectUrl = isRedirectRule(url, rules);
					}
					if(!redirectUrl) {
						redirectUrl = isMobile(url);
					}

					/* Only redirect if there is a URL to redirect to */
					if(redirectUrl) {
						// Notify the user that a redirection is happening per the 7/5/17(?) web store policy update (link?)
						pushRedirectNotification(redirectUrl);

						// TODO: Tabs don't always have valid IDs (chrome.tabs.TAB_ID_NONE = -1)... handle this
						redirectionTracker.addRedirection(tabId, url);
						chrome.tabs.update(tabId, {url: redirectUrl});
					}
				});
			}
		});
	}
});

/* Remove tabs from the redirection tracker when the tab is closed */
chrome.tabs.onRemoved.addListener(function(tabId) {
	redirectionTracker.remove(tabId);
});

/* Setup message handling for this script */
chrome.runtime.onMessage.addListener(function(request) {
	if(request.deleteRule) {
		regexLookup.remove(request.deleteRule);
	}
	else if(request.addRule) {
		regexLookup.add(request.addRule);
	}
});
/* End Listener Init */

/* Set the browser action icon to the inactive version if necessary */
chrome.storage.sync.get({redirection: 1}, function(result) { // Default to redirection enabled
	if(result.redirection === 0) {
		Utilities.updateBrowserActionIcon(0);
	}
});