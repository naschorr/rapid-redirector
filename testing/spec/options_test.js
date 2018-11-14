describe("the options page", function() {
	/*
		Notes: 
		FQ = 'fully qualified'
	*/
	describe("the hasValue function", function() {
		/* 	Tests:
			empty object, empty source, empty destination - false
			object, wrong key, matching value - false
			object, matching key, wrong value - false
			object, matching key, matching value - true
		*/
		it("should return false given empty arguments (of the correct type)", function() {
			expect(hasValue({}, '', '')).toBe(false);
		});

		it("should return false when given an object, an invalid key, and a valid value", function() {
			var key = "key";
			var value = "value";
			var obj = {testKey: value};

			expect(hasValue(obj, key, value)).toBe(false);
		});

		it("should return false when given an object, a valid key, and an invalid value", function() {
			var key = "testKey";
			var value = "value";
			var obj = {testKey: "invalid"};

			expect(hasValue(obj, key, value)).toBe(false);
		});

		it("should return true when given an object with a valid key and value pair", function() {
			var key = "testKey";
			var value = "value";
			var obj = {testKey: "value"};

			expect(hasValue(obj, key, value)).toBe(true);
		});
	});

	describe("the hasChars function", function() {
		/* 	Tests:
			empty string - false
			whitespace string - false
			non-whitespace string - true
			whitespace and character string - true
		*/
		it("should return false for an empty string", function() {
			expect(hasChars('')).toBe(false);
		});

		it("should return false for a string with only whitepsace characters in it", function() {
			expect(hasChars('   \t	\t\t  \t	  ')).toBe(false);
		});

		it("should return true for a string with only non-whitespace characters in it", function() {
			expect(hasChars('test_string')).toBe(true);
		});

		it("should return true for a string with both whitespace and non-whitespace characters in it", function() {
			expect(hasChars('\tthis is a test string!')).toBe(true);
		});

	});

	describe("the getButtonIndex function", function() {
		/* 	Tests:
			empty string - null
			buttonId without digits at the end - null
			buttonId ending in 0 - 0
			buttonId ending in 999 - 999
		*/
		it("should return null when given an empty string", function() {
			expect(getButtonIndex('')).toBeNull();
		});

		it("should return null when given a buttonId that doesn't have any digits at the end", function() {
			expect(getButtonIndex('deleteRuleButton-')).toBeNull();
		});

		it("should return the number 0 when given a buttonId that ends with a 0", function() {
			expect(getButtonIndex('deleteRuleButton-0')).toBe(0);
		})

		it("should return the number 999 when given a buttonId that ends with a 999", function() {
			expect(getButtonIndex('deleteRuleButton-999')).toBe(999);
		});
	});

	describe("the getDomain function", function() {
		/* 	Tests:
			empty string - empty string
			non-url string - non-url string
			non-FQ url - non-FQ url
			FQ url - non-FQ url
			FQ url with subdomain - non FQ url with subdomain
			non-FQ url with path - non-FQ url
			non-FQ url with one subdomain and path - non-FQ url with subdomain
		*/
		it("should return an empty string when given an empty string", function() {
			var emptyString = '';

			expect(getDomain(emptyString)).toBe(emptyString);
		});

		it("should return a non-URL string when given a non-URL string", function() {
			var nonURL = 'wow, this really isnt a URL at all!';

			expect(getDomain(nonURL)).toBe(nonURL);
		});

		it("should return a non-FQ url when given a non-FQ URL", function() {
			var nonFQ = 'nickschorr.com';

			expect(getDomain(nonFQ)).toBe(nonFQ);
		});

		it("should return a non-FQ URL when given an FQ URL", function() {
			var FQ = 'http://nickschorr.com/';
			var nonFQ = 'nickschorr.com';

			expect(getDomain(FQ)).toBe(nonFQ);
		});

		it("should return a non-FQ URL with a subdomain when given an FQ URL with a subdomain", function() {
			var FQ = 'http://test.nickschorr.com/';
			var nonFQ = 'test.nickschorr.com';

			expect(getDomain(FQ)).toBe(nonFQ);
		});

		it("should return a non-FQ URL when given a non-FQ URL with a path", function() {
			var withPath = 'nickschorr.com/test/path/to/nowhere/';
			var withoutPath = 'nickschorr.com';

			expect(getDomain(withPath)).toBe(withoutPath);
		});

		it("should return a non-FQ URL with a subdomain when given a non-FQ URL with a path and a subdomain", function() {
			var withPath = 'test.nickschorr.com/test/path/to/nowhere/';
			var withoutPath = 'test.nickschorr.com';

			expect(getDomain(withPath)).toBe(withoutPath);
		});
	});

	describe("the calcSubdomainDifference function", function() {
		/*	Tests:
			empty source, empty destination - 0
			FQ source with no subdomains, FQ destination with no subdomains - 0
			FQ source with one subdomain, FQ destination with one subdomain - 0
			FQ source with one subdomain, FQ destination with no subdomains - 1
			source with no subdomains, destination with no subdomains - 0
			source with one subdomain, destination with one subdomain - 0
			source with one subdomain, destination with no subdomains - 1
			source no subdomains, destination with one subdomain - 1
			source with three subdomains, destination with two of the same subdomains - 1
			destination with three subdomains, source with two of the same subdomains - 1
			source with five subdomains, destination with no subdomains - 5
			FQ source with no subdomains and path, FQ destination with no subdomains, and different path - 0
			FQ source with one subdomain and path, FQ destination with no subdomains, and different path - 1
		*/
		it("should return 0 when given an empty source and destination", function() {
			expect(calcSubdomainDifference('','')).toBe(0);
		});

		it("should return 0 when given a FQ source and FQ destination with no subdomains", function() {
			expect(calcSubdomainDifference('http://nickschorr.com/','http://nickschorr.com/')).toBe(0);
		});

		it("should return 0 when given a FQ source and FQ destination with one subdomain each", function() {
			expect(calcSubdomainDifference('http://one.nickschorr.com/','http://two.nickschorr.com/')).toBe(0);
		});

		it("should return 0 when given a FQ source with one subdomain and a FQ destination with no subdomains", function() {
			expect(calcSubdomainDifference('http://one.nickschorr.com/','http://nickschorr.com/')).toBe(1);
		});

		it("should return 0 when given a source and destination with no subdomains", function() {
			expect(calcSubdomainDifference('nickschorr.com','nickschorr.com')).toBe(0);
		});

		it("should return 0 when given a source and destination with a single subdomain each", function() {
			expect(calcSubdomainDifference('one.nickschorr.com','two.nickschorr.com')).toBe(0);
		});

		it("should return 1 when given a source with one subdomain, and a destination with no subdomain", function() {
			expect(calcSubdomainDifference('one.nickschorr.com','nickschorr.com')).toBe(1);
		});

		it("should return 1 when given a source with no subdomain, and a destination with one subdomain", function() {
			expect(calcSubdomainDifference('nickschorr.com','one.nickschorr.com')).toBe(1);
		});

		/* 'of the same subdomains' refers to matching nested subdomains as the other domain, like a subset */
		it("should return 1 when given a source with three subdomains and destination with two of the same subdomains", function() {
			expect(calcSubdomainDifference('three.two.one.nickschorr.com','two.one.nickschorr.com')).toBe(1);
		});

		it("should return 1 when given a destination with three subdomains, and a source with two of the same subdomains", function() {
			expect(calcSubdomainDifference('two.one.nickschorr.com','three.two.one.nickschorr.com')).toBe(1);
		});

		it("should return 5 when given a source with five subdomains and destination with no subdomains", function() {
			expect(calcSubdomainDifference('one.two.three.four.five.nickschorr.com','nickschorr.com')).toBe(5);
		});

		it("should return 0 when given a FQ source with no subdomains and a path, and a FQ destination with no subdomains and a different path", function() {
			expect(calcSubdomainDifference('http://nickschorr.com/test/path/', 'http://nickschorr.com/path/test/')).toBe(0);
		});

		it("should return 1 when given a FQ source with one subdomain and a path, and a FQ destination with no subdomains and a different path", function() {
			expect(calcSubdomainDifference('http://one.nickschorr.com/test/path/', 'http://nickschorr.com/path/test/')).toBe(1);
		});
	});

	describe("the hasMismatchedProtocol function", function() {
		/*	Tests:
			both URLs have a protocol - false
			both URLs don't have a protocol - false
			only source URL has a protocol - true
			only destination URL has a protocl - true
		*/

		let protocolA;
		let protocolB;
		let domainA;
		let domainB;

		beforeEach(function() {
			protocolA = "chrome://";
			protocolB = "https://";
			domainA = "nickschorr.com/";
			domainB = "test.nickschorr.com/"
		});

		it("should return false when both URLs have a protocol", function() {
			expect(hasMismatchedProtocol(protocolA + domainA, protocolB + domainB)).toEqual(false);
		});

		it("should return false when both URLs don't have a protocol", function() {
			expect(hasMismatchedProtocol(domainA, domainB)).toEqual(false);
		});

		it("should return true when only the source URL has a protocol", function() {
			expect(hasMismatchedProtocol(protocolA + domainA, domainB)).toEqual(true);
		});

		it("should return true when only the destination URL has a protocol", function() {
			expect(hasMismatchedProtocol(domainA, protocolB + domainB)).toEqual(true);
		});
	});

	/* Uses NotificationPopup, so this won't work either */
	describe("the isValidInput function", function() {
		/* 	Tests:
			// Tests the whitespace checker
			empty source, empty destination, empty rules array - false
			empty source, non-empty destination, empty rules array - false
			non-empty source, empty destination, empty rules array - false
			// Tests the duplicate source checker (destination arg doesn't matter)
			non-empty source, empty destination, rules array with matching non-empty source as the source at the beginning - false
			non-empty source, empty destination, rules array with matching non-empty source as the source at the end - false
			// Tests the cycle checker (destination arg doesn't matter)
			non-empty source, empty destination, rules array with matching non-empty source as the destination at the beginning - false
			non-empty source, empty destination, rules array with matching non-empty source as the destination at the end - false
			// Tests valid input
			non-empty source, non-empty destination, rules array without any duplicate sources and no destinations matching the non-empty source - true
			non-empty source with one subdomain, non-empty destination with no subdomains, rules array without any duplicate sources and no destinations matching the non-empty source - true
		*/
	
		it("should return false for empty source, destination, and rules arguments", function() {
			expect(isValidInput('','',[])).toBe(false);
		});

		it("should return false for an empty source, a valid destination, and an empty rules argument", function() {
			expect(isValidInput('', 'nickschorr.com', [])).toBe(false);
		});

		it("should return false for a valid source, an empty destination, and an empty rules argument", function() {
			expect(isValidInput('nickschorr.com', '', [])).toBe(false);
		});

		it("should return false for a source that's at the front of the rules array", function() {
			var source = "nickschorr.com"
			var rules = [
				{src:source, dest:"nickschorr.com/test/"},
				{src:"nickschorr.com/path/", dest:"nickschorr.com/path/test/"},
				{src:"test.nickschorr.com/path/", dest:"test.nickschorr.com/path/test/"}
			];

			expect(isValidInput(source, '', rules)).toBe(false);
		});

		it("should return false for a matching source that's at the end of the rules array", function() {
			var source = "nickschorr.com"
			var rules = [
				{src:"nickschorr.com/path/", dest:"nickschorr.com/path/test/"},
				{src:"test.nickschorr.com/path/", dest:"test.nickschorr.com/path/test/"},
				{src:source, dest:"nickschorr.com/test/"}
			];

			expect(isValidInput(source, '', rules)).toBe(false);
		});

		it("should return false for a source that matches a destination at the front of the rules array", function() {
			var source = "nickschorr.com"
			var rules = [
				{src:"nickschorr.com/test/", dest:source},
				{src:"nickschorr.com/path/", dest:"nickschorr.com/path/test/"},
				{src:"test.nickschorr.com/path/", dest:"test.nickschorr.com/path/test/"}
			];

			expect(isValidInput(source, '', rules)).toBe(false);
		});

		it("should return false for a source that matches a destination at the back of the rules array", function() {
			var source = "nickschorr.com"
			var rules = [
				{src:"nickschorr.com/path/", dest:"nickschorr.com/path/test/"},
				{src:"test.nickschorr.com/path/", dest:"test.nickschorr.com/path/test/"},
				{src:"nickschorr.com/test/", dest:source}
			];

			expect(isValidInput(source, '', rules)).toBe(false);
		});

		it("should return true for a nonempty source and destination, the source doesn't have any matches in the rules array, and the source isn't already a destination", function() {
			var rules = [
				{src:"nickschorr.com/path/", dest:"nickschorr.com/path/test/"},
				{src:"test.nickschorr.com/path/", dest:"test.nickschorr.com/path/test/"},
				{src:"test.sub.nickschorr.com/", dest:"sub.nickschorr.com/test/path/"}
			];

			expect(isValidInput('nickschorr.com', 'nickschorr.com/test/', rules)).toBe(true);
		});

		it("should return true for a nonempty source with one subdomain and destination with no subdomains, the source doesn't have any matches in the rules array, and the source isn't already a destination", function() {
			var rules = [
				{src:"nickschorr.com/path/", dest:"nickschorr.com/path/test/"},
				{src:"test.nickschorr.com/path/", dest:"test.nickschorr.com/path/test/"},
				{src:"test.sub.nickschorr.com/", dest:"sub.nickschorr.com/test/path/"}
			];

			expect(isValidInput('one.nickschorr.com', 'nickschorr.com/test/', rules)).toBe(true);
		});
	});

	describe("the parseRegexGroups function", () => {
		/* 	Tests:
			falsy source and falsy destination - { captureGroups: 0, substitutionGroups: [] }
			source has no capture groups and falsy destination - { captureGroups: 0, substitutionGroups: [] }
			source is falsy and destination has no substitution groups - { captureGroups: 0, substitutionGroups: [] }
			source has no capture groups and destination has no substitution groups - { captureGroups: 0, substitutionGroups: [] }
			source has one capture group and destination has no substitution groups - { captureGroups: 1, substitutionGroups: [] }
			source has no capture groups and destination has one substitution group - { captureGroups: 1, substitutionGroups: [].length == 1 }
			source has three capture groups and destination has three substitution groups - { captureGroups: 3, substitutionGroups: [].length == 3 }
			source has one capture group and destination has five substitution groups - { captureGroups: 1, substitutionGroups: [].length == 5 }
			source has five capture groups and destination has one substitution group - { captureGroups: 5, substitutionGroups: [].length == 1 }
			source has one capture group and destination has a two-digit number as its substitution group - { captureGroups: 1, substitutionGroups: [].length == 1 }
		*/

		it("should return { captureGroups: 0, substitutionGroups: [] } for a falsy source and destination", () => {
			const regexGroups = parseRegexGroups(null, null);

			expect(regexGroups.captureGroups).toEqual(0);
			
			expect(Array.isArray(regexGroups.substitutionGroups)).toBe(true)
			expect(regexGroups.substitutionGroups.length).toEqual(0);
		});

		it("should return { captureGroups: 0, substitutionGroups: [] } for a source without capture groups and falsy destination", () => {
			const regexGroups = parseRegexGroups("source.com", null);

			expect(regexGroups.captureGroups).toEqual(0);
			
			expect(Array.isArray(regexGroups.substitutionGroups)).toBe(true)
			expect(regexGroups.substitutionGroups.length).toEqual(0);
		});

		it("should return { captureGroups: 0, substitutionGroups: [] } for a falsy source and a destination without subsitution groups", () => {
			const regexGroups = parseRegexGroups(null, "destination.com");

			expect(regexGroups.captureGroups).toEqual(0);
			
			expect(Array.isArray(regexGroups.substitutionGroups)).toBe(true)
			expect(regexGroups.substitutionGroups.length).toEqual(0);
		});

		it("should return { captureGroups: 0, substitutionGroups: [] } for a source without capture groups and a destination without subsitution groups", () => {
			const regexGroups = parseRegexGroups("source.org", "destination.com");

			expect(regexGroups.captureGroups).toEqual(0);
			
			expect(Array.isArray(regexGroups.substitutionGroups)).toBe(true)
			expect(regexGroups.substitutionGroups.length).toEqual(0);
		});

		it("should return { captureGroups: 1, substitutionGroups: [] } for a source with one capture group and a destination without subsitution groups", () => {
			const regexGroups = parseRegexGroups("(\w+).org", "destination.com");

			expect(regexGroups.captureGroups).toEqual(1);
			
			expect(Array.isArray(regexGroups.substitutionGroups)).toBe(true)
			expect(regexGroups.substitutionGroups.length).toEqual(0);
		});

		it("should return { captureGroups: 1, substitutionGroups: [].length == 1 } for a source with one capture group and a destination with one subsitution group", () => {
			const regexGroups = parseRegexGroups("(\w+).org", "test.$1.org");

			expect(regexGroups.captureGroups).toEqual(1);
			
			expect(Array.isArray(regexGroups.substitutionGroups)).toBe(true)
			expect(regexGroups.substitutionGroups.length).toEqual(1);
		});

		it("should return { captureGroups: 3, substitutionGroups: [].length == 3 } for a source with three capture groups and a destination with three subsitution groups", () => {
			const regexGroups = parseRegexGroups("(\w+).org/(\d+)/([dev|prod])", "test.$1.org/$3/$2");

			expect(regexGroups.captureGroups).toEqual(3);
			
			expect(Array.isArray(regexGroups.substitutionGroups)).toBe(true)
			expect(regexGroups.substitutionGroups.length).toEqual(3);
		});

		it("should return { captureGroups: 1, substitutionGroups: [].length == 5 } for a source with one capture group and a destination with five subsitution groups", () => {
			const regexGroups = parseRegexGroups("(\w+).org/test/dev/abc", "test.$1.$2/$3/$5/$4");

			expect(regexGroups.captureGroups).toEqual(1);
			
			expect(Array.isArray(regexGroups.substitutionGroups)).toBe(true)
			expect(regexGroups.substitutionGroups.length).toEqual(5);
		});

		it("should return { captureGroups: 5, substitutionGroups: [].length == 1 } for a source with five capture groups and a destination with one subsitution group", () => {
			const regexGroups = parseRegexGroups("(\w+).([org|com])/(\w+)/(u?dev)/(\w+)", "$1.test.com/dev");

			expect(regexGroups.captureGroups).toEqual(5);
			
			expect(Array.isArray(regexGroups.substitutionGroups)).toBe(true)
			expect(regexGroups.substitutionGroups.length).toEqual(1);
		});

		it("should return { captureGroups: 1, substitutionGroups: [].length == 1 } for a source with one capture group and a destination with one, two digit subsitution group", () => {
			const regexGroups = parseRegexGroups("test.com/(\w+)", "test.com/$15");

			expect(regexGroups.captureGroups).toEqual(1);
			
			expect(Array.isArray(regexGroups.substitutionGroups)).toBe(true)
			expect(regexGroups.substitutionGroups.length).toEqual(1);
		});
	});
});