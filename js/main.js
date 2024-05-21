// 1. On page load, fetch the data from the API : https://random-data-api.com/api/v2/users?size=${size}
// 2. Retrieve users from the API. Only load the data that you need to display (see next step). Store the data in a users array that will serve as your single source of truth. Limit the number of users using a maxUsers variable.
// 3. Display the data from your users array as cards in the UI. Each card should have the following details: Name (first_name + last_name), username, email, avatar, and an id. Use this markup for the card. Apply a 'card--loading' class to the card while the avatar is loading. Once the avatar has loaded, remove the 'card--loading' class.

/* 
<div class="card">
	<img
		src="${user.avatar}"
		alt="avatar"
		class="card__img"
	/>
  <div class="card__content">
    <h2>${user.name}</h2>
    <p>${user.username}</p>
    <p>${user.email}</p>
  </div>
</div>
*/

// 4. As the user scrolls down, fetch more users and display them in the UI. Use the intersection observer API to detect when the user has scrolled to the bottom of the page. Only display the cards once their avatars have been loaded.
// 5. When the user clicks on the "toggle-scroll-mode" button (id), turn off the auto loading of users when the user scrolls down. Enable the "load-more" button (id) at the bottom of the page. When the user clicks on the Load More button, fetch the next number of users and display them in the UI as you did in step 3. If the user has reached the max number of users, disable the Load More button and show a message in the snackbar at the bottom of the page.
// 6. Create a custom error handling mechanism to handle the API errors. Extend the Error class and create a custom error class. Use this custom error class to handle the API errors. Import it into your main.js from a utils.js file.
// 7. Use the custom error class to handle the API errors and show a snackbar message at the bottom of the page when an error occurs. The snackbar should show the error message and disappear after a few seconds.
