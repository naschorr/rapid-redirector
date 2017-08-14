/* Globals */
const POPUP_CONTAINER_CLASS = "notification-popup";
const POPUP_CLOSE_ICON_CLASS = "text right close-icon";
const POPUP_ICON_CLASS = "text center-text icon";
const POPUP_TEXT_CLASS = "text center-text";
const POPUP_CONTAINER_ID = "notificationPopup";
const POPUP_CLOSE_ICON_ID = "notificationPopupCloseIcon";
const POPUP_ICON_ID = "notificationPopupIcon";
const POPUP_TEXT_ID = "notificationPopupText";
/* End Globals */

/**
 * Class that handles creation and removal of notification popups
 */
class NotificationPopup {
	/**
	 * Constructs the popup's properties and initiates the creation of the actual popup.
	 * @param {(String|Array)} containerClasses - The array of classes for the container div's CSS, or the string representation of those classes.
	 * @param {(String|Array)} iconClasses - The array of classes for the icon div's CSS, or the string representation of those classes.
	 * @param {(String|Array)} textClasses - The array of classes for the text div's CSS, or the string representation of those classes.
	 * @param {String} text - The text for the popup.
	 * @param {String=} icon - The icon placed at the top of the popup (ex. Check mark to indicate success)
	 */
	constructor(containerClasses, iconClasses, textClasses, text, icon = "") {
		this.containerClasses = NotificationPopup.getArray(containerClasses).append(POPUP_CONTAINER_CLASS);
		this.iconClasses = NotificationPopup.getArray(iconClasses).append(POPUP_ICON_CLASS);
		this.textClasses = NotificationPopup.getArray(textClasses).append(POPUP_TEXT_CLASS);

		this.closeIconClasses = NotificationPopup.getArray(POPUP_CLOSE_ICON_CLASS);
		this.text = text;
		this.icon = icon;
		this.delay = NotificationPopup.calcTimeToReadString(this.text);

		let self = this;
		this.insertNotificationPopup(function() {
			document.getElementById(POPUP_CLOSE_ICON_ID).addEventListener("click", function() {
				self.removeNotificationPopup();
			});
			setTimeout(function() {
				self.removeNotificationPopup();
			}, self.delay);
		});
	}

	/*
	 * Creates and inserts a notification popup into the beginning of the body
	 * @param {function} callback - The function to call after the popup has been inserted
	 */
	insertNotificationPopup(callback) {
		let notificationHtml = 
		`<div class="${this.containerClasses.join(' ')}" id="${POPUP_CONTAINER_ID}">
			<div class="${this.closeIconClasses.join(' ')}" id="${POPUP_CLOSE_ICON_ID}"></div>
			<div class="${this.iconClasses.join(' ')}" id="${POPUP_ICON_ID}">${this.icon}</div>
			<div class="${this.textClasses.join(' ')}" id="${POPUP_TEXT_ID}">${this.text}</div>
		</div>`;

		document.body.insertAdjacentHTML("afterbegin", notificationHtml);

		if(callback) {
			callback();
		}
	}

	/*
	 * Removes a notification popup from the DOM
	 */
	removeNotificationPopup() {
		let notificationPopup = document.getElementById(POPUP_CONTAINER_ID);
		if(notificationPopup) {
			notificationPopup.parentNode.removeChild(notificationPopup);
		}
		else {
			Utilities.debugLog(`NotificationPopup with id '${POPUP_CONTAINER_ID}' not found, can't remove. Did you click on the div already?`);
		}
	}

	/**
	 * Calculates the length of time it should take someone to read the provided string (in milliseconds).
	 * @param {string} string - The string to check for how long it takes to read.
	 * @return {int} The time in milliseconds that it should take for someone to read the string. 0 if the string is empty
	 */
	static calcTimeToReadString(string) {
		if(string) {
			return 500 + 75 * string.length;
		}
		else {			
			return 0;
		}
	}

	/**
	 * Checks if an object is an array, and converts it to an array (of one object) if it's not
	 * @param {Object} object - The object to check.
	 * @return {Array} The original array, or newly created array populated with the object.
	 */
	static getArray(object) {
		if(object.constructor === Array) {
			return object;
		}
		else {
			return new Array(object);
		}
	}
}