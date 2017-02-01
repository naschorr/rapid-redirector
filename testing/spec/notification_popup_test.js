/* For some reason, Notification Popup isn't defined, so the tests can't run */
	describe("the NotificationPopup class", function() {

		describe("the calcTimeToReadString method", function() {
			/* 	Tests:
				empty string - 0
				non empty string - number > 0
			*/
			it("should return 0 when given an empty string", function() {
				expect(NotificationPopup.calcTimeToReadString('')).toBe(0);
			});

			it("should return a number, greater than 0 when given a non-empty string", function() {
				expect(NotificationPopup.calcTimeToReadString('non-empty string')).toBeGreaterThan(0);
			});
		});

		describe("the getArray method", function() {
			/*	Tests:
				array - same array
				object - array populated with the object
			*/
			let array;
			let object;

			beforeEach(function() {
				array = new Array();
				object = {};
			});

			it("should return the same array when given an array", function() {
				expect(NotificationPopup.getArray(array)).toEqual(array);
			});

			it("should return an array populated with the object when given the object", function() {
				array.push(object);
				expect(NotificationPopup.getArray(object)).toEqual(array);
			});
		});
	});