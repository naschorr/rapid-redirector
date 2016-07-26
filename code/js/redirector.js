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
    /* Make sure that the destination isn't already in the URL. (ex amazon.com -> smile.amazon.com) */
    if(url.search(rules[i].dest) < 0) {
      var attempt = url.replace(rules[i].src, rules[i].dest);
      if(url !== attempt) {
        replaced = attempt;
      }
    }
    i++;
  }
  return replaced;
}

/**
 * Checks if the URL is of the 'm.' style. (ex. en.m.wikipedia.org)
 * @param {string} url - The url to check.
 * @return {string|null} String containing the now non-mobile URL. Null if it's not a mobile URL.
 */
function isMobile(url) {
  var match = /([^a-z ]m\.)/i.exec(url);
  if(match) {
    var nonMobileUrl = url.split('');
    nonMobileUrl.splice(match.index + 1, 2);
    return nonMobileUrl.join('');
  }
  return null;
}

/* Listener Init */
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'loading' && tab.active) {
    chrome.storage.sync.get({
      redirection: 'enable'   // Default to redirection enabled.
      }, function(items) {
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