/**
 * Class that handles a limited redirection history and redirection checking
 * This is basically just a dict wrapper with some extra functionality (and room for expansion)
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
		let redirection = this.getRedirection(tabId);

		return (!redirection || (url != redirection));
	}

	/**
	 * Removes a tab's key from the dictionary
	 * @param {int} tabId - The tab's integer id
	 */
	remove(tabId) {
		delete this._tabs[tabId];
	}
}