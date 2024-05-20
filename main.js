// Global variables
const userData = []; // Single source of truth
let scrollMode = true;
let footerObserver;

const footer = document.querySelector('footer');

async function init() {
	console.log('App initialized, fetching users...');

	// Intersection Observer API - setup footer observer
	const options = {
		root: null,
		rootMargin: '0px',
		threshold: 0.15,
	};

	footerObserver = new IntersectionObserver(revealMoreUsers, options);
	footerObserver.observe(footer);

	document
		.getElementById('toggle-scroll-mode')
		.addEventListener('click', toggleScrollMode);

	// Fetch users
	const users = await fetchUsers();
	userData.push(...users);
	loadUsers(userData);
}

function toggleScrollMode() {
	scrollMode = !scrollMode;
	console.log('scrollMode:', scrollMode);

	scrollMode
		? footerObserver.observe(footer)
		: footerObserver.unobserve(footer);
}

function revealMoreUsers(entries) {
	console.warn('Reached the footer, loading more users...');
	const [entry] = entries;
	console.log(entry);

	if (!entry.isIntersecting) return; // Guard clause

	if (userData.length <= 90) {
		console.log('Fetching more users');
		fetchUsers(10).then((users) => {
			userData.push(...users);
			loadUsers(users);
		});
	} else {
		console.log("That's the max number of users we can fetch at this time.");
	}
}

async function fetchUsers(size = 30) {
	const url = `https://random-data-api.com/api/v2/users?size=${size}`;
	const response = await fetch(url);
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
	return users;
}

function loadUsers(users) {
	const content = document.querySelector('.content');
	console.log(content);
	users.forEach((user) => {
		const card = document.createElement('div');
		card.classList.add('card', 'card--loading');
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
	document.querySelectorAll('.card--loading img').forEach((img) => {
		img.addEventListener('load', () => {
			img.closest('.card').classList.remove('card--loading');
		});
	});
}

// 1. On page load, fetch the data from the API : https://random-data-api.com/api/v2/users?size=${size}
// 2. Retrieve 30 users from the API, display them as cards in the UI
// 3. Each card should have the following details: Name (first_name + last_name), username, email, avatar, and an id.
// 4. As the user scrolls down, fetch 10 more users and display them in the UI. Use observer to detect when the user has scrolled to the bottom of the page. Only display the cards once their avatars have been loaded.
// 5. Show an empty flashing card animation as a loading animation at the bottom of the page when the user scrolls down and the data is being fetched.
// 6. When the user clicks on the Load Manually, turn off the auto loading of users when the user scrolls down. Show the Load More button at the bottom of the page. When the user clicks on the Load More button, fetch the next 30 users and display them in the UI.
// 7. Create a custom error handling mechanism to handle the API errors. Extend the Error class and create a custom error class. Use this custom error class to handle the API errors.
// 8. Show a toast message at the top of the page when an error occurs. Include a button to dismiss the toast message. Include a "Try Again" button in the toast message. When the user clicks on the "Try Again" button, retry the API call.

document.addEventListener('DOMContentLoaded', init);
