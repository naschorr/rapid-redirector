/* Globals */
const POPUP_DESC_WAIT_TIME = 2000;
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
	
	let redirectionStateText;
	let redirectionBtnValue;

	if(state === 0) {
		redirectionStateText = DISABLED_TEXT;
		redirectionBtnValue = ENABLE_TEXT;

	}
	else{
		redirectionStateText = ENABLED_TEXT;
		redirectionBtnValue = DISABLE_TEXT;
	}

	/* subText and toggleRedirectionBtn defined with the listeners */
	Utilities.updateBrowserActionIcon(state);
	subText.textContent = `Redirection is now ${redirectionStateText}.`;
	toggleRedirectionBtn.value = redirectionBtnValue;

	setTimeout(function() {
		subTextElement.textContent = POPUP_DESC;
	}, POPUP_DESC_WAIT_TIME);
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
		saveRedirectionState(result.redirection ^= 1);
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