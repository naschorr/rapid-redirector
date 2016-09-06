/**
 * Checks if the URL can be found in the supplied set of redirection rules.
 * @param {string} url - The url to check.
 * @param {array} rules - Array of 'rules' objects to check against. {src:"Source", dest:"Destination"}
 * @return {string|null} String containing the newly redirected URL. Null if a redirection doesn't exist.
 */
function isRedirectRule(url, rules) {
  var replaced = null;
  var i = 0;
  while(!replaced && i < rules.length) {
    var attempt = url.replace(rules[i].src, rules[i].dest);

    if(url !== attempt) {
      replaced = attempt;
    }
    i++;
  }
  return replaced;
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

  var mobileSubdomains = ['m', 'mobile'];

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
    while(!match && mobileIndex < mobileSubdomains.length) {
      if(domainTokens[domainIndex] === mobileSubdomains[mobileIndex]) {
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

/* Listener Init */
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'loading' && tab.active) {
    chrome.storage.sync.get({ redirection: 1  }, function(items) { // Default to redirection enabled.
        /* Make sure that redirection is enabled */
        if(items.redirection === 1) {
          chrome.storage.sync.get("redirectionRules", function(result) {
            var rules = result.redirectionRules;

            /* Check and see if the url exists in the list of redirection rules */
            var redirectRuleMatch = isRedirectRule(tab.url, rules);
            if(redirectRuleMatch !== null) {
              chrome.tabs.update(tabId, {url: redirectRuleMatch});
              return;
            }

            /* Check and see if the page is mobile */
            var mobileMatch = isMobile(tab.url);
            if(mobileMatch !== null) {
              chrome.tabs.update(tabId, {url: mobileMatch});
            }

            /* Else do nothing */
          })
        }
    })
  }
})
/* End Listener Init */