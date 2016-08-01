describe("the background redirector", function() {
	describe("the isMobile function", function() {
		it("should return null with an empty URL", function() {
			expect(isMobile('')).toBeNull();
		});

		it("should return null with a non-URL string", function() {
			expect(isMobile('this is a non URL string!')).toBeNull();
		});

		it("should return null with a fully qualified non-mobile URL", function() {
			expect(isMobile('http://www.amazon.com/')).toBeNull();
		});

		/* 
			'appears to be fully qualified' refers to a string that can fool the regex that looks for
			leading and trailing forward slashes in the URL being tested. Ideally there would be a way to
			check explicitly for valid domains, but with all the potential variations around the world, 
			it seems both fast and reasonable to do it this way.
		*/
		it("should return null with a non-URL string that appears to be fully qualified", function() {
			expect(isMobile('http://this is not a url!/')).toBeNull();
		});

		it("should return null without a fully qualified URL", function() {
			expect(isMobile('nickschorr.com')).toBeNull();
		});

		/*
			Assume fully qualified URLS from here on out, since that's what Chrome gives us when we
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
		it("should return null for an empty URL and empty rule array", function() {
			expect(isRedirectRule('', [])).toBeNull();
		});

		it("should return null for a URL and empty rule array", function() {
			expect(isRedirectRule('http://nickschorr.com/', [])).toBeNull();
		});

		/*
			'malformed' refers to an array of objects that aren't rules objects.
			Rule object format can be seen in isRedirectRule function documentation in redirector.js
		*/
		it("should return null for a URL and malformed rule array", function() {
			var malformed = [
				{source:"nickschorr.com", destination:"nickschorr.com/test/"},
				{mal:"nickschorr.com", formed:"nickschorr.com/test"}
			];

			expect(isRedirectRule('http://nickschorr.com/', malformed)).toBeNull();
		});

		it("should return null for a URL and rule array with an empty src, and dest", function() {
			var empty = [
				{source:'', destination:''}
			];

			expect(isRedirectRule('http://nickschorr.com/', empty)).toBeNull();
		});

		it("should return null for a URL and rule array with no matches", function() {
			var noMatches = [
				{src:"one.com", dest:"nickschorr.com"},
				{src:"www.two.com", dest:"nickschorr.com"},
				{src:"sub.domain.com", dest:"nickschorr.com"}
			];

			expect(isRedirectRule('http://nickschorr.com/', noMatches)).toBeNull();
		});

		it("should return a different URL for a URL and rule array with a match at the beginning", function() {
			var url = 'http://nickschorr.com';
			var match = [
				{src:"nickschorr.com", dest:"nickschorr.com/test"},
				{src:"www.two.com", dest:"nickschorr.com"},
				{src:"sub.domain.com", dest:"nickschorr.com"}
			];
			var result = isRedirectRule(url, match);

			expect(result).not.toBeNull();
			expect(result).not.toEqual(url);
		});

		it("should return a different URL for a URL and rule array with a match in the middle", function() {
			var url = 'http://nickschorr.com';
			var match = [
				{src:"www.two.com", dest:"nickschorr.com"},
				{src:"nickschorr.com", dest:"nickschorr.com/test"},
				{src:"sub.domain.com", dest:"nickschorr.com"}
			];
			var result = isRedirectRule(url, match);

			expect(result).not.toBeNull();
			expect(result).not.toEqual(url);
		});

		it("should return a different URL for a URL and rule array with a match at the end", function() {
			var url = 'http://nickschorr.com';
			var match = [
				{src:"www.two.com", dest:"nickschorr.com"},
				{src:"sub.domain.com", dest:"nickschorr.com"},
				{src:"nickschorr.com", dest:"nickschorr.com/test"}
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