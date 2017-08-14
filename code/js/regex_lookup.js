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