describe("The utilities script", function() {
	//describe("The Utilities class", function() {});

	describe("The String.insertAt() function", function() {
		let stringA;
		let stringB;

		beforeEach(function() {
			stringA = "stringA";
			stringB = "stringB";
		});

		it("should be able to insert a string into the beginning of another string", function() {
			expect(stringA.insertAt(stringB, 0)).toEqual("stringBstringA");
		});

		it("should be able to insert a string into the middle of another string", function() {
			expect(stringA.insertAt(stringB, stringA.length/2)).toEqual("strstringBingA");
		});

		it("should be able to insert a string into the end of another string", function() {
			expect(stringA.insertAt(stringB, stringA.length)).toEqual("stringAstringB");
		});

		it("should handle strings inserted past the end by just inserting at the end", function() {
			expect(stringA.insertAt(stringB, stringA.length + 5)).toEqual("stringAstringB");
		});

		it("should handle strings inserted before the beginning by just inserting at the beginning", function() {
			expect(stringA.insertAt(stringB, -5)).toEqual("stringBstringA");
		});

		/* Test for falsey values */
		it("should handle strings inserted at null position like strings inserted at 0", function() {
			expect(stringA.insertAt(stringB, null)).toEqual("stringBstringA");
		});

		it("should handle strings inserted at false position like strings inserted at 0", function() {
			expect(stringA.insertAt(stringB, false)).toEqual("stringBstringA");
		});

		it("should handle strings inserted at 0 position", function() {
			expect(stringA.insertAt(stringB, 0)).toEqual("stringBstringA");
		});

		it("should handle strings inserted at '' position like strings inserted at 0", function() {
			expect(stringA.insertAt(stringB, '')).toEqual("stringBstringA");
		});

		it("should handle strings inserted at undefined position like strings inserted at 0", function() {
			expect(stringA.insertAt(stringB, undefined)).toEqual("stringBstringA");
		});

		it("should handle strings inserted at NaN position like strings inserted at 0", function() {
			expect(stringA.insertAt(stringB, NaN)).toEqual("stringBstringA");
		});
		/* End falsey tests */
	});

	describe("The String.antiSlice() function", function() {
		let string;

		beforeEach(function() {
			string = "string";
		});

		it("should be able to perform the antiSlice on a string from beginning to middle", function() {
			expect(string.antiSlice(0, string.length/2)).toEqual("ing");
		});

		it("should be able to perform the antiSlice on a string from middle to end", function() {
			expect(string.antiSlice(string.length/2, string.length)).toEqual("str");
		});

		it("should be able to perform the antiSlice on indicies inside the string", function() {
			expect(string.antiSlice(string.length/2 - 1, string.length/2 + 1)).toEqual("stng");
		});		

		it("should be able to perform the antiSlice on indicies before the string by just returning the string", function() {
			expect(string.antiSlice(-10, -5)).toEqual(string);
		});

		it("should be able to perform the antiSlice on indicies after the string by just returning the string", function() {
			expect(string.antiSlice(string.length + 5, string.length + 10)).toEqual(string);
		});

		it("should be able to perform the antiSlice on indicies before and inside the string by just returning the partial string", function() {
			expect(string.antiSlice(-3, 3)).toEqual("ing");
		});

		it("should be able to perform the antiSlice on indicies inside and after the string by just returning the partial string", function() {
			expect(string.antiSlice(string.length - 3, string.length + 3)).toEqual("str");
		});

		/* Test for falsey values */
		/* Test first falsey arg */
		it("should handle a null first argument and a 0 second argument", function() {
			expect(string.antiSlice(null, 0)).toEqual("string");
		});

		it("should handle a false first argument and a 0 second argument", function() {
			expect(string.antiSlice(false, 0)).toEqual("string");
		});

		it("should handle a 0 first and second argument", function() {
			expect(string.antiSlice(0, 0)).toEqual("string");
		});

		it("should handle a '' first argument and a 0 second argument", function() {
			expect(string.antiSlice('', 0)).toEqual("string");
		});

		it("should handle a undefined first argument and a 0 second argument", function() {
			expect(string.antiSlice(undefined, 0)).toEqual("string");
		});

		it("should handle a NaN first argument and a 0 second argument", function() {
			expect(string.antiSlice(NaN, 0)).toEqual("string");
		});

		/* Test second falsey arg */
		it("should handle a 0 first argument and a null second argument", function() {
			expect(string.antiSlice(0, null)).toEqual("string");
		});

		it("should handle a 0 first argument and a false second argument", function() {
			expect(string.antiSlice(0, false)).toEqual("string");
		});

		it("should handle a 0 first and second argument", function() {
			expect(string.antiSlice(0, 0)).toEqual("string");
		});

		it("should handle a 0 first argument and a '' second argument", function() {
			expect(string.antiSlice(0, '')).toEqual("string");
		});

		it("should handle a 0 first argument and an undefined second argument", function() {
			expect(string.antiSlice(0, undefined)).toEqual("string");
		});

		it("should handle a 0 first argument and a NaN second argument", function() {
			expect(string.antiSlice(0, NaN)).toEqual("string");
		});
		/* End falsey tests */
	});

	describe("The Array.append() function", function() {
		let arrayA;
		let arrayB;
		let object;
		let string;
		let int;

		beforeEach(function() {
			arrayA = new Array("one", "two", "three");
			arrayB = arrayA.slice();
			object = {data: "object"};
			string = "string";
			int = 42;
		});

		it("should return the same array when passed no arguments", function() {
			expect(arrayA.append()).toEqual(arrayA);
		});

		it("should return the same array with an object pushed onto the end when given an object as the argument", function() {
			arrayB.push(object);
			expect(arrayA.append(object)).toEqual(arrayB);
		});

		it("should return the array with an arbitrary amount of objects pushed into it", function() {
			arrayB.push(object);
			arrayB.push(string);
			arrayB.push(int);
			expect(arrayA.append(object, string, int)).toEqual(arrayB);
		});

		it("should return the array with null pushed into it when given a null argument", function() {
			arrayB.push(null);
			expect(arrayA.append(null)).toEqual(arrayB);
		});
	});
});