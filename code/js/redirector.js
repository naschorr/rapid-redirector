/* Globals */
const MOBILE_SUBDOMAINS = ['m', 'mobile'];
var lastRedirectionSource = "";
var regexLookup = {}; // Note that pairs aren't being deleted from this dict when they're removed from the rules array. TODO: fix this.
/* End Globals */

/**
 * Checks if the URL can be found in the supplied set of redirection rules.
 * @param {string} url - The url to check.
 * @param {array} rules - Array of 'rules' objects to check against. {src:"source URL (or regex pattern)", dest:"destination URL", regex:boolean if .src is a regex}
 * @return {string|null} String containing the newly redirected URL. Null if a redirection doesn't exist.
 * TODO build an error handler to handle these and any other errors that might occur.
 */
function isRedirectRule(url, rules) {
  var match = null;
  var index = 0;

  while(!match && index < rules.length) {
    var rule = rules[index];

    if(rule.regex) {
      try {
        var result = regexLookup[rule.src].exec(url);
        if(result) {
          // Build extension onto string class for string insertions/removals? Maybe a utilities script to load with the other scripts in this extension?
          match = url.substr(0, result.index) + rule.dest + url.substr(result.index + result[0].length);
        }
      }
      catch(e){
        if(e instanceof TypeError) {
          console.log(e, '\n', "Probably from a new regex rule not present in the regexpLookup. Adding it now...");
          regexLookup[rule.src] = RegExp(rule.src);
          continue;
        }else{
          console.log(e, '\n', "Unhandled error in isRedirectRule's regex rule checker. Returning null.");
          break;
        }
      }
    }else{
      var attempt = url.replace(rules[index].src, rules[index].dest);
      if(url !== attempt) {
        match = attempt;
      }
    }

    index++;
  }
  return match;
}

/**
 * Checks if the URL is a mobile URL. (ex. en.m.wikipedia.org or mobile.twitter.com)
 * @param {string} url - The url to check.
 * @return {string|null} String containing the now non-mobile URL. Null if it's not a mobile URL.
 */
function isMobile(url) {
  if(!url) {
    return null;
  }

  try {
    var domain = /\/\/(\S+?)\//.exec(url)[1];
    var domainTokens = domain.split('.');
  }
  catch (error) {
    if(error.name === 'TypeError') {
      console.error(`TypeError in isMobile(). Arg: "${url}". Error: ${error}`);
      return null; 
    }
  }

  /* Basically, just loop through the array of domain tokens and check each mobile subdomain against it.
     If a match is found, stop the loop, and replace the url's domain with the new non-mobile one. Theres probaby a better way to do this. */
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
 * Populates the regex lookup dictionary with a set of {src:RegExp} pairs for every redirection rule that uses regex.
 */
function populateRegexLookup() {
  chrome.storage.sync.get("redirectionRules", function(result) {
    result.redirectionRules.forEach(function(rule) {
      if(rule.regex) {
        regexLookup[rule.src] = RegExp(rule.src);
      }
    });
  })
}

/* Listener Init */
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  /* Make sure that redirection is enabled, and that the url we just redirected from isn't the same as the one we're redirecting to. 
     This helps to prevent getting stuck in redirection loops, and losing control of the browser's back button. */
  if (changeInfo.status == 'loading' && lastRedirectionSource != tab.url) {
    chrome.storage.sync.get({ redirection: 1 }, function(items) { // Default to redirection enabled.
        if(items.redirection === 1) {
          chrome.storage.sync.get("redirectionRules", function(result) {
            var rules = result.redirectionRules;

            /* Check and see if the url exists in the list of redirection rules */
            var redirectRuleMatch = isRedirectRule(tab.url, rules);
            if(redirectRuleMatch) {
              lastRedirectionSource = tab.url;
              chrome.tabs.update(tabId, {url: redirectRuleMatch});
              return;
            }

            /* Check and see if the page is mobile */
            var mobileMatch = isMobile(tab.url);
            if(mobileMatch) {
              lastRedirectionSource = tab.url;
              chrome.tabs.update(tabId, {url: mobileMatch});
              return;
            }

            /* Else do nothing */
          })
        }
    })
  }
})
/* End Listener Init */

/* Populate the regexLookup dict on startup */
populateRegexLookup();
