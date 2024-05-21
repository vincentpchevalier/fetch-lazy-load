import NetworkError from './utils.js';

// Global variables
const userData = []; // Single source of truth
let scrollMode = false;
let footerObserver;

const maxUsers = 50; // Max number of users we can fetch

const footer = document.querySelector('footer');
const loadMoreBtn = document.getElementById('load-more');

function init() {
	console.log('App initialized, fetching users...');

	// Intersection Observer API - setup footer observer
	const options = {
		root: null,
		rootMargin: '0px',
		threshold: 0.15,
	};

	footerObserver = new IntersectionObserver(revealMoreUsers, options);
	// footerObserver.observe(footer);

	// Event listener for the toggle scroll mode button
	document
		.getElementById('toggle-scroll-mode')
		.addEventListener('click', toggleScrollMode);

	// Event listener for the load more button
	loadMoreBtn.addEventListener('click', () => {
		// Unlike with the observer, we will just use the fetchUsers function to fetch more users
		fetchUsers(10);
	});

	// Fetch users
	// fetchUsers(10);
}

async function fetchUsers(size = 20) {
	const url = `https://random-data-api.com/api/v2/users?size=${size}`;
	try {
		const response = await fetch(url);
		console.log(response.ok, response.status, response.statusText);
		if (!response.ok) {
			throw new NetworkError(
				`Response failed with status ${response.status}`,
				response
			);
		}
		const data = await response.json();
		const users = data.map(
			({ id, avatar, first_name, last_name, username, email }) => {
				return {
					id,
					avatar,
					name: `${first_name} ${last_name}`,
					username,
					email,
				};
			}
		);
		userData.push(...users);
	} catch (err) {
		if (err instanceof NetworkError) {
			if (userData.length === 0) showSnackbar(err.message);
		} else {
			showSnackbar('An error occurred. Please try again.');
		}
	}
	console.log(userData.length);
	loadUsers(userData);
}

function loadUsers(users) {
	const content = document.querySelector('.content');
	users.forEach((user) => {
		const card = document.createElement('div');
		card.classList.add('card', 'card--loading');
		card.dataset.id = user.id;
		card.innerHTML = `
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
	      `;
		content.appendChild(card);
	});
	// Remove the loading class once the images have loaded
	document.querySelectorAll('.card--loading img').forEach((img) => {
		img.addEventListener('load', () => {
			img.closest('.card').classList.remove('card--loading');
		});
	});
}

function revealMoreUsers(entries) {
	console.log('Reached the footer, loading more users...');
	const [entry] = entries; // passed to this function from the observer callback function
	// console.log(entries); // Array of IntersectionObserverEntry objects - footer will be the entry at index 0 in this case because we are observing only one element
	// console.log(entry); // IntersectionObserverEntry object

	if (!entry.isIntersecting) return; // Guard clause

	// Fetch more users but limit the number of users to 90 because we don't want to overload our fetch requests to a free API (Error 429 - Too Many Requests)
	if (userData.length <= maxUsers) {
		console.log('Fetching more users');
		fetchUsers(10);
	} else {
		console.log("That's the max number of users we can fetch at this time.");
	}
}

function toggleScrollMode() {
	scrollMode = !scrollMode;
	console.log('scrollMode:', scrollMode);

	// Show message in snackbar about the scroll mode

	// Disable the load more button when scroll mode is enabled and we've reached the max number of users
	loadMoreBtn.disabled = scrollMode && userData.length >= maxUsers; // && is a short-circuit operator that only evaluates the second expression if the first one is true
	loadMoreBtn.classList.toggle('btn--disabled', !scrollMode); // second argument is a boolean that determines whether the class should be added or removed

	scrollMode
		? footerObserver.observe(footer)
		: footerObserver.unobserve(footer);
}

function showSnackbar(message, type = 'error') {
	// Show snackbar
	const snackbar = document.querySelector('.snackbar');
	snackbar.classList.add('show');

	// Set timeout to hide snackbar
	setTimeout(() => {
		snackbar.classList.remove('show');
	}, 5000);

	// Update snackbar message
	const sbMessage = snackbar.querySelector('.snackbar__message');
	if (type === 'error') sbMessage.classList.add('error');
	sbMessage.textContent = message;
}

// 1. On page load, fetch the data from the API : https://random-data-api.com/api/v2/users?size=${size}
// 2. Retrieve 30 users from the API, display them as cards in the UI
// 3. Each card should have the following details: Name (first_name + last_name), username, email, avatar, and an id.
// 4. As the user scrolls down, fetch 10 more users and display them in the UI. Use observer to detect when the user has scrolled to the bottom of the page. Only display the cards once their avatars have been loaded.
// 5. Show an empty flashing card animation as a loading animation at the bottom of the page when the user scrolls down and the data is being fetched.
// 6. When the user clicks on the Load Manually, turn off the auto loading of users when the user scrolls down. Show the Load More button at the bottom of the page. When the user clicks on the Load More button, fetch the next 10 users and display them in the UI.
// 7. Create a custom error handling mechanism to handle the API errors. Extend the Error class and create a custom error class. Use this custom error class to handle the API errors.
// 8. Show a snackbar message at the bottom of the page when an error occurs. The snackbar should show the error message and disappear after 5 seconds.

document.addEventListener('DOMContentLoaded', init);
