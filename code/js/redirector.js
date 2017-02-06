/* Globals */
const MOBILE_SUBDOMAINS = ['m', 'mobile'];
var regexLookup;
var redirectionTracker;
/* End Globals */

/**
 * Class that handles a limited redirection history and redirection checking
 * TODO: Add tests for this class
 */
class RedirectionTracker {
  /**
   * Creates a private dictionary to hold the tab redirection data
   */
  constructor() {
    this._tabs = {};
  }

  /**
   * Adds a redirection source to the given tab
   * @param {int} tabId - The tab's integer id
   * @param {string} url - The url of the last page redirected from
   */
  addRedirection(tabId, url) {
    this._tabs[tabId] = url;
  }

  /**
   * Gets the most recent redirection source done in the given tab
   * @param {int} tabId - The tab's integer id
   * @return {string} The url of the last page redirected from
   */
  getRedirection(tabId) {
    return this._tabs[tabId];
  }

  /**
   * Checks if the given tab can redirect to the current URL
   * @param {int} tabId - The tab's integer id
   * @param {string} url - The url of the active tab
   * @return {boolean} True if redirection is possible, False if it isn't
   */
  canRedirect(tabId, url) {
    return (url != this.getRedirection(tabId));
  }

  /**
   * Removes a tab's key from the dictionary
   * @param {int} tabId - The tab's integer id
   */
  remove(tabId) {
    delete this._tabs[tabId];
  }
}

/**
 * Class that handles storage and error handling of RegExp objects to be used during page redirection.
 */
class RegexLookup {
  /**
   * Create a private lookup dictionary.
   */
  constructor() {
    this._lookup = {};
  }

  /**
   * Add a key, generate its RegExp, and insert into the lookup dict.
   * @param {string} key - The key for the lookup dict.
   */
  add(key) {
    if(!(key instanceof String)) {
      key = String(key);
    }

    this._lookup[key] = new RegExp(key);
    // catch bad RegExp instantiation attempt here? Is that even a thing? RegExp is pretty flexible in what it can take for a pattern.
  }

  /**
   * Get a stored RegExp with a key if it exists. If not, create a new RegExp with the supplied key.
   * @param {string} key - The key to get the stored RegExp for.
   * @return {RegExp} The stored RegExp found at the key.
   */
  get(key) {
    if(key in this._lookup) {
      return this._lookup[key];
    }
    else{
      Utilities.debugLog(`Key: '${key}' not found. Constructing and returning its RegExp now.`);
      this.add(key);
      return this.get(key);
    }
  }

  /**
   * Removes a key:regex pair from the lookup dict.
   * @param {string} key - The key of the key:regex pair to be removed.
   */
  remove(key) {
    delete this._lookup[key];
  }
}

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
        newUrl = url.antiSlice(result.index, result.index + result[0].length).insertAt(rule.dest, result.index);
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
    var domainTokens = domain.split('.');
  }
  catch (e) {
    if(e instanceof TypeError) {
      console.error(e, '\n', `TypeError in isMobile(). Arg: "${url}". Error: ${e}`);
    }
    else{
      console.error(e, '\n', `Unhandled error in isMobile(). Arg: "${url}". Error: ${e}`);
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
        match = url.replace(domain, domainTokens.join('.'));
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
    result.redirectionRules.forEach(function(rule) {
      if(rule.regex) {
        regexLookup.add(rule.src);
      }
    });
  });
  
  return regexLookup;
}

/* Generate the regex lookup on startup */
regexLookup = generateRegexLookup();

/* Declare the redirection tracker on startup */
redirectionTracker = new RedirectionTracker();

/* Listener Init */
// Consider changing to event filters -- https://developer.chrome.com/extensions/event_pages#best-practices #4
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  /* 
    Make sure that redirection is enabled, and that the url we just redirected from isn't the same as the one we're redirecting to. 
    This helps to prevent getting stuck in redirection loops, and losing control of the browser's back button.
  */
  if (changeInfo.status == 'loading' && redirectionTracker.canRedirect(tab.id, tab.url)) {
    chrome.storage.sync.get({redirection: 1}, function(items) { // Default to redirection enabled.
        if(items.redirection === 1) {
          chrome.storage.sync.get("redirectionRules", function(result) {
            let rules = result.redirectionRules;

            /* Check and see if the url exists in the list of redirection rules */
            // TODO: Condense these blocks into one -- DRY
            let redirectRuleMatch = isRedirectRule(tab.url, rules);
            if(redirectRuleMatch) {
              // TODO: Tabs don't always have ids.. handle this
              redirectionTracker.addRedirection(tab.id, tab.url);
              chrome.tabs.update(tabId, {url: redirectRuleMatch});
              return;
            }

            /* Check and see if the page is mobile */
            let mobileMatch = isMobile(tab.url);
            if(mobileMatch) {
              // TODO: Tabs don't always have ids.. handle this
              redirectionTracker.addRedirection(tab.id, tab.url);
              chrome.tabs.update(tabId, {url: mobileMatch});
              return;
            }

            /* Else do nothing */
          });
        }
    });
  }
});

/* Remove tabs from the redirection tracker when the tab is closed */
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
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