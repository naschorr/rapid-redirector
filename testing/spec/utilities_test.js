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
	});
});