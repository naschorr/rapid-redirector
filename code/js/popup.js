/* Globals */
var ENABLED_TEXT = chrome.i18n.getMessage('popup_enabled_string');
var DISABLED_TEXT = chrome.i18n.getMessage('popup_disabled_string');
var ENABLE_TEXT = chrome.i18n.getMessage('popup_enable_string');
var DISABLE_TEXT = chrome.i18n.getMessage('popup_disable_string');
var POPUP_DESC = chrome.i18n.getMessage('popup_description');
/* End Globals */

/* Methods */
/**
 *	Update the subText and toggleRedirectionBtn's text after a new state has been saved.
 *  @param {int} state - The current redirection state of the extension (0 = Disabled, 1 = Enabled).
 */
function updatePopupAfterStateSaved(state) {
	/* subText and toggleRedirectionBtn defined with the listeners */
	var redirectionStateText = (state === 0) ? DISABLED_TEXT : ENABLED_TEXT;
	subText.textContent = `Redirection is now ${redirectionStateText}.`;
	toggleRedirectionBtn.value = (state === 0) ? ENABLE_TEXT : DISABLE_TEXT;
	setTimeout(function() {
		subTextElement.textContent = POPUP_DESC;
	}, 2000);
}

/**
 * Saves the given redirection state.
 * @param {int} state - The redirection state to be saved (0 = Disabled, 1 = Enabled).
 */
function saveRedirectionState(state) {
	/* Make sure that only valid states are being saved. */
	if(state >= 0 && state <= 1) {
		chrome.storage.sync.set({redirection: state}, updatePopupAfterStateSaved(state));
	}
}

/**
 * Restore the popup's redirection state for the enable/disable button.
 */
function loadRedirectionState() {
	chrome.storage.sync.get({redirection: 1}, function(result) {
		/* toggleRedirectionBtn defined with the listeners */
		toggleRedirectionBtn.value = (result.redirection === 0) ? ENABLE_TEXT : DISABLE_TEXT;
	});
}

/**
 * Load the localized text from messages.json (via chrome.i18n), and apply the strings to forward facing elements of the interface.
 */
function loadLocalizedText() {
	document.title = chrome.i18n.getMessage('popup_title');
	document.getElementById('logoText').innerHTML = chrome.i18n.getMessage('name');
	document.getElementById('subText').innerHTML = POPUP_DESC;
	document.getElementById('redirectionRules').value = chrome.i18n.getMessage('popup_add_new_rule_string');
}
/* End Methods */

/* Listener Init */
document.addEventListener('DOMContentLoaded', loadRedirectionState());

var toggleRedirectionBtn = document.getElementById('toggleRedirection');
var subTextElement = document.getElementById('subText');
toggleRedirectionBtn.addEventListener('click', function() {
	chrome.storage.sync.get({redirection: 1}, function(result) {
		var redirectionState = result.redirection;
		saveRedirectionState(redirectionState ^= 1);
	})
});

var redirectionRulesBtn = document.getElementById('redirectionRules');
redirectionRulesBtn.addEventListener('click', function() {
	chrome.tabs.create({'url': `chrome://extensions/?options=${chrome.runtime.id}`});
});
/* End Listener Init */

/* Localization Init */
document.addEventListener('DOMContentLoaded', loadLocalizedText());
/* End Localization */