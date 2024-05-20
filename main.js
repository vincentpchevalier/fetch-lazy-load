function init() {
	console.log('App initialized');
}

// 1. On page load, fetch the data from the API : https://random-data-api.com/api/v2/users?size=${size}
// 2. Retrieve 30 users from the API, display them as cards in the UI
// 3. Each card should have the following details: Name (first_name + last_name), username, email
// 4. As the user scrolls down, fetch the next 30 users and display them in the UI. Use observer to detect when the user has scrolled to the bottom of the page.
// 5. Show an empty flashing card animation as a loading animation at the bottom of the page when the user scrolls down and the data is being fetched.
// 6. When the user clicks on the Load Manually, turn off the auto loading of users when the user scrolls down. Show the Load More button at the bottom of the page. When the user clicks on the Load More button, fetch the next 30 users and display them in the UI.
// 7. Create a custom error handling mechanism to handle the API errors. Extend the Error class and create a custom error class. Use this custom error class to handle the API errors.
// 8. Show a toast message at the top of the page when an error occurs. Include a button to dismiss the toast message. Include a "Try Again" button in the toast message. When the user clicks on the "Try Again" button, retry the API call.

document.addEventListener('DOMContentLoaded', init);
