import NetworkError from './utils.js';

// Global variables
const userData = []; // Single source of truth
const maxUsers = 30; // Max number of users we can fetch
let scrollMode = true; // Lazy load scroll mode is enabled by default
let maxUsersReached;
let footerObserver;

const options = {
	root: null,
	rootMargin: '0px',
	threshold: 0.15,
};

// DOM elements
const footer = document.querySelector('footer');
const loadMoreBtn = document.getElementById('load-more');
const toggleScrollModeBtn = document.getElementById('toggle-scroll-mode');

function init() {
	console.log('App initialized, fetching users...');

	// Instantiate observer for the footer and start observing
	footerObserver = new IntersectionObserver(revealMoreUsers, options);
	footerObserver.observe(footer);

	// Event listener for the toggle scroll mode button
	toggleScrollModeBtn.addEventListener('click', toggleScrollMode);

	// Event listener for the load more button
	loadMoreBtn.addEventListener('click', () => {
		fetchUsers(10);
	});

	// Fetch users
	fetchUsers(10);
}

async function fetchUsers(size = 20) {
	maxUsersReached = userData.length >= maxUsers;
	// console.log('max users:', maxUsers, 'maxUsersReached:', maxUsersReached); // Debugging to keep track of the max users and if we've reached the limit

	const url = `https://random-data-api.com/api/v2/users?size=${size}`;

	// Fetch users but limit the number of users to maxUsers because we don't want to overload our fetch requests to a free API (Error 429 - Too Many Requests)
	if (!maxUsersReached) {
		try {
			const response = await fetch(url);
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
				showSnackbar(err.message);
			} else {
				showSnackbar('An error occurred. Please try again.');
			}
		}
		loadUsers(userData);
	} else {
		showSnackbar(
			`That's the max number of users we can fetch at this time.`,
			'success'
		);

		// Disable the load more button
		loadMoreBtn.disabled = true;
		loadMoreBtn.classList.add('btn--disabled');
	}
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

	// Fetch more users
	if (userData.length !== 0) fetchUsers(10);
}

function toggleScrollMode() {
	scrollMode = !scrollMode;
	// console.log('scrollMode:', scrollMode);

	// Show message in snackbar about the scroll mode
	showSnackbar(
		`Scroll mode is ${scrollMode ? 'enabled' : 'disabled'}.`,
		'success'
	);

	// Disable the load more button when scroll mode is enabled and we've reached the max number of users
	loadMoreBtn.disabled = scrollMode && userData.length >= maxUsers; // && is a short-circuit operator that only evaluates the second expression if the first one is true
	loadMoreBtn.classList.toggle('btn--disabled', scrollMode || maxUsersReached); // second argument is a boolean that determines whether the class should be added or removed

	// Toggle the observer based on the scroll mode
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

document.addEventListener('DOMContentLoaded', init);
