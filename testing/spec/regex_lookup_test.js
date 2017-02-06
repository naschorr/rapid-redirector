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