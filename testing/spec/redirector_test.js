describe("the background redirector", function() {
	/*
		Notes: 
		FQ = 'fully-qualified'
	*/

	describe("the RegexLookup class", function() {
		var regexLookup;
		var string = "string";
		var integer = 123;

		beforeEach(function() {
			regexLookup = new RegexLookup();
		});

		afterEach(function() {
			delete regexLookup;
		});

		describe("the constructor function", function() {
			/*	Tests:
				none - an empty dictionary member variable
			*/

			it("should create an empty lookup dictionary (js object) when called", function() {
				expect(regexLookup._lookup instanceof Object).toEqual(true);
				expect(Object.keys(regexLookup._lookup).length).toEqual(0);
			});
		});

		describe("the add function", function() {
			/* 	Tests:
				string - RegExp
				non-string (number) - RegExp
				string (then overwrite with another string) - RegExp
			*/

			beforeEach(function() {
				regexLookup = new RegexLookup();
			});

			afterEach(function() {
				delete regexLookup;
			});

			it("should be able to add a string key to the lookup dict, and generate a RegExp", function() {
				regexLookup.add(string);
				var result = regexLookup._lookup[string];

				expect(result).toEqual(new RegExp(string));
			});

			it("should be able to add a non-string key to the lookup dict, and generate a RegExp", function() {
				regexLookup.add(integer);
				var result = regexLookup._lookup[integer];

				expect(result).toEqual(new RegExp(integer));
			});

			it("should overwrite a previous key with a new key, and generate an equivalent RegExp", function() {
				var firstRegex = new RegExp(string);
				var secondRegex = new RegExp(string);

				regexLookup.add(string);
				expect(regexLookup._lookup[string]).toEqual(firstRegex);
				expect(Object.keys(regexLookup._lookup).length).toEqual(1);

				regexLookup.add(string);
				expect(regexLookup._lookup[string]).toEqual(secondRegex);
				expect(Object.keys(regexLookup._lookup).length).toEqual(1);

				expect(firstRegex).toEqual(secondRegex);
			});
		});

		describe("the get function", function() {
			/*	Tests:
				empty string - RegExp for the empty string
				valid key - RegExp for the key
				key not in lookup - RegExp for the key, and key added to lookup
			*/

			beforeEach(function() {
				regexLookup = new RegexLookup();
			});

			afterEach(function() {
				delete regexLookup;
			});

			it("should return the correct RegExp when given an empty key", function() {
				var emptyString = "";
				var result = regexLookup.get(emptyString);

				expect(result).toEqual(regexLookup._lookup[emptyString]);
				expect(result).not.toBeUndefined();
			});

			it("should return the correct RegExp when given a key for an element in the lookup dict", function() {
				regexLookup.add(string);
				var result = regexLookup._lookup[string];

				expect(result).toEqual(regexLookup.get(string));
				expect(result).not.toBeUndefined();
			});

			it("should return the correct RegExp when given a key for an element NOT in the lookup dict, and add the key to the lookup dict", function() {
				var randomFloat = Math.random() * 100;
				var result = regexLookup.get(randomFloat);

				expect(result).toEqual(regexLookup._lookup[randomFloat]);
				expect(result).not.toBeUndefined();
				expect(randomFloat in regexLookup._lookup).toEqual(true);
			});
		});

		describe("the remove function", function() {
			/*	Tests:
				key present in lookup - lookup dict without key in it
				key not in lookup - no changes/returns
			*/

			beforeEach(function() {
				regexLookup = new RegexLookup();
			});

			afterEach(function() {
				delete regexLookup;
			});

			it("should be able to remove a key from the lookup dict", function() {
				regexLookup.add(string);
				expect(regexLookup.get(string)).toEqual(regexLookup._lookup[string]);
				expect(Object.keys(regexLookup._lookup).length).toEqual(1);

				regexLookup.remove(string);

				expect(regexLookup._lookup[string]).toBeUndefined();
				expect(Object.keys(regexLookup._lookup).length).toEqual(0);
			});

			it("should have no effect when removing a key that isn't in the lookup dict", function() {
				expect(Object.keys(regexLookup._lookup).length).toEqual(0);

				regexLookup.remove(string);

				expect(regexLookup._lookup[string]).toBeUndefined();
				expect(Object.keys(regexLookup._lookup).length).toEqual(0);
			});
		});
	});


	describe("the isMobile function", function() {
		/* 	Tests:
			empty string - null
			non-URL string - null
			FQ non-mobile URL - null
			FQ non-URL string - null
			non-FQ URL - null
			non-mobile FQ URL with 'm' in the front of the path - null
			non-mobile FQ URL with 'm' later in the path - null
			non-mobile FQ URL with 'mobile' substring in the domain - null
			non-mobile FQ URL without a trailing forward slash - null
			non-mobile FQ URL with a 'm.' in the path - null
			FQ URL with 'm' subdomain in the front of the domain - different URL
			FQ URL with 'm' subdomain after the front of the domain - different URL
		*/

		it("should return null with an empty string", function() {
			expect(isMobile('')).toBeNull();
		});

		it("should return null with a non-URL string", function() {
			expect(isMobile('this is a non URL string!')).toBeNull();
		});

		it("should return null with a FQ non-mobile URL", function() {
			expect(isMobile('http://www.amazon.com/')).toBeNull();
		});

		/* 
			'appears to be FQ' refers to a string that can fool the regex that looks for
			leading and trailing forward slashes in the URL being tested. Ideally there would be a way to
			check explicitly for valid domains, but with all the potential variations around the world, 
			it seems both fast and reasonable to do it this way.
		*/
		it("should return null with a non-URL string that appears to be FQ", function() {
			expect(isMobile('http://this is not a url!/')).toBeNull();
		});

		it("should return null without a FQ URL", function() {
			expect(isMobile('nickschorr.com')).toBeNull();
		});

		/*
			Assume FQ URLS from here on out, since that's what Chrome gives us when we
			ask for the tab's url (tab.url), and end-users don't really have access to this function.
		*/

		it("should return null for a non-mobile URL with a 'm' folder in the front of the path", function() {
			expect(isMobile('http://nickschorr.com/m/test/path/')).toBeNull();
		});

		it("should return null for a non-mobile URL with a 'm' folder later in the path", function() {
			expect(isMobile('http://nickschorr.com/test/m/path/')).toBeNull();
		});

		it("should return null for a non-mobile URL containing the substring 'mobile' in the address", function() {
			expect(isMobile('http://cars.automobile.com/')).toBeNull();
		});

		it("should return null for a non-mobile URL without a trailing forward slash in the path", function() {
			expect(isMobile('http://nickschorr.com/test/path')).toBeNull();
		});

		it("should return null for a non-mobile URL with a 'm.' in the path", function() {
			expect(isMobile('http://nickschorr.com/test/path/m.php')).toBeNull();
		});

		it("should return a different URL for a URL with a 'm' subdomain in the front", function() {
			var url = 'http://m.reddit.com/';
			var result = isMobile(url);

			expect(result).not.toBeNull();
			expect(result).not.toEqual(url);
		});

		it("should return a different URL for a URL with a 'm' subdomain not in the front", function() {
			var url = 'http://en.m.wikipedia.org/';
			var result = isMobile(url);

			expect(result).not.toBeNull();
			expect(result).not.toEqual(url);
		});
	});

	describe("the isRedirectRule function", function() {
		/*	Tests:
			empty URL, empty rule array - null
			FQ URL, empty array - null
			FQ URL, rule array with incorrect keys - null
			FQ URL, rule array with empty src and dest keys - null
			FQ URL, rule array with no matches - null
			FQ URL, rule array with match at the beginning - different URL
			FQ URL, rule array with match in the middle - different URL
			FQ URL, rule array with match at the end - different URL
			FQ URL, rule array with a match where the destination is longer than the source - different URL
			FQ URL, rule array with multiple matches - first matching URL
		*/

		var validURL = 'http://nickschorr.com';

		it("should return null for an empty URL and empty array", function() {
			expect(isRedirectRule('', [])).toBeNull();
		});

		it("should return null for a URL and empty rule array", function() {
			expect(isRedirectRule(validURL, [])).toBeNull();
		});

		/*
			'malformed' refers to an array of objects that aren't rules objects. (ex. Their keys aren't correct)
		*/
		it("should return null for a URL and malformed rule array", function() {
			var malformed = [
				{source:"nickschorr.com", destination:"nickschorr.com/test/"},
				{mal:"nickschorr.com", formed:"nickschorr.com/test"}
			];

			expect(isRedirectRule(validURL, malformed)).toBeNull();
		});

		it("should return null for a URL and rule array with an empty src, and dest", function() {
			var empty = [
				{source:'', destination:''}
			];

			expect(isRedirectRule(validURL, empty)).toBeNull();
		});

		it("should return null for a URL and rule array with no matches", function() {
			var noMatches = [
				{src:"one.com", dest:"nickschorr.com"},
				{src:"www.two.com", dest:"nickschorr.com"},
				{src:"sub.domain.com", dest:"nickschorr.com"}
			];

			expect(isRedirectRule(validURL, noMatches)).toBeNull();
		});

		it("should return a different URL for a URL and rule array with a match at the beginning", function() {
			var match = [
				{src:"nickschorr.com", dest:"nickschorr.com/test"},
				{src:"www.two.com", dest:"nickschorr.com"},
				{src:"sub.domain.com", dest:"nickschorr.com"}
			];
			var result = isRedirectRule(validURL, match);

			expect(result).not.toBeNull();
			expect(result).not.toEqual(validURL);
		});

		it("should return a different URL for a URL and rule array with a match in the middle", function() {
			var match = [
				{src:"www.two.com", dest:"nickschorr.com"},
				{src:"nickschorr.com", dest:"nickschorr.com/test"},
				{src:"sub.domain.com", dest:"nickschorr.com"}
			];
			var result = isRedirectRule(validURL, match);

			expect(result).not.toBeNull();
			expect(result).not.toEqual(validURL);
		});

		it("should return a different URL for a URL and rule array with a match at the end", function() {
			var match = [
				{src:"www.two.com", dest:"nickschorr.com"},
				{src:"sub.domain.com", dest:"nickschorr.com"},
				{src:"nickschorr.com", dest:"nickschorr.com/test"}
			];
			var result = isRedirectRule(validURL, match);

			expect(result).not.toBeNull();
			expect(result).not.toEqual(validURL);
		});

		it("should return a different URL, even if the destination domain is longer than the source domain", function() {
			var url = 'https://en.m.wikipedia.org/wiki/Main_Page';
			var match = [
				{src:"www.two.com", dest:"nickschorr.com"},
				{src:"sub.domain.com", dest:"nickschorr.com"},
				{src:"en.m.wikipedia.org/wiki/Main_Page", dest:"wikipedia.org"}
			];
			var result = isRedirectRule(url, match);

			expect(result).not.toBeNull();
			expect(result).not.toEqual(url);
		});

		it("should return the first matching URL for a URL and rule array with multiple matches", function() {
			var url = 'nickschorr.com';
			var first = 'nickschorr.com/one';
			var second = 'nickschorr.com/two';
			var match = [
				{src:"nickschorr.com", dest:first},
				{src:"sub.domain.com", dest:"nickschorr.com"},
				{src:"nickschorr.com", dest:second}
			];
			var result = isRedirectRule(url, match);

			expect(result).not.toBeNull();
			expect(result).not.toEqual(url);
			expect(result).toEqual(first);
		});
	});
});