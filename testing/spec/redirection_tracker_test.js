describe("the RedirectionTracker class", function() {
	/* This is basically just a dict wrapper with some extra functionality (and room for expansion) */

	let redirectionTracker;
	let tabA;
	let stringA;

	beforeEach(function() {
		redirectionTracker = new RedirectionTracker();
		tabA = 100;
		stringA = "stringA";
	});

	afterEach(function() {
		delete redirectionTracker;
	});

	describe("the constructor method", function() {
		it("should create an empty dictionary (js object) when called", function() {
			expect(redirectionTracker._tabs instanceof Object).toEqual(true);
			expect(Object.keys(redirectionTracker._tabs).length).toEqual(0);
		});
	});

	describe("the addRedirection method", function() {
		beforeEach(function() {
			redirectionTracker = new RedirectionTracker();
		});

		afterEach(function() {
			delete redirectionTracker;
		});

		it("should be able to add an integer key, and a string value to the tabs dict", function() {
			redirectionTracker.addRedirection(tabA, stringA);
			let result = redirectionTracker._tabs[tabA];

			expect(result).toEqual(stringA);
		});
	});

	describe("the getRedirection method", function() {
		beforeEach(function() {
			redirectionTracker = new RedirectionTracker();
		});

		afterEach(function() {
			delete redirectionTracker;
		});

		it("should be able to retrieve the correct value when given a key", function() {
			redirectionTracker._tabs[tabA] = stringA;

			expect(redirectionTracker.getRedirection(tabA)).toEqual(stringA);
		});

		it("should return undefined when given a key that's not in the tabs dict", function() {
			expect(redirectionTracker.getRedirection(tabA)).toBeUndefined();
		});
	});

	describe("the canRedirect method", function() {
		let stringB;

		beforeEach(function() {
			redirectionTracker = new RedirectionTracker();
			stringB = "stringB";
		});

		afterEach(function() {
			delete redirectionTracker;
		});

		it("should return true when given a valid tabId, and a string that's different to the stored one", function() {
			redirectionTracker._tabs[tabA] = stringA;

			expect(redirectionTracker.canRedirect(tabA, stringB)).toEqual(true);
		});

		it("should return false when given a valid tabId, and a string that's the same as the stored one", function() {
			redirectionTracker._tabs[tabA] = stringA;

			expect(redirectionTracker.canRedirect(tabA, stringA)).toEqual(false);
		});		

		it("should return false when given an invalid tabId, and any string", function() {
			let someTab = 123456789;
			redirectionTracker._tabs[tabA] = stringA;

			expect(redirectionTracker.canRedirect(someTab, stringB)).toEqual(false);
		});
	});
});