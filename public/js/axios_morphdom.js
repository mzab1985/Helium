// Iteraion no.: 4

// With this approach, only one layout works, replaces the content section with the new one using morphdom

import morphdom from 'morphdom';

// Configuration flags
const useNProgress = false; // Set to true to use NProgress, false to disable
const useTimer = true; // Set to true to enable timing logs, false to disable
const currentContent = document.querySelector('#content');

// Before adding new event listeners, remove old ones
const removeEventListeners = () => {
	document.querySelectorAll('a.spa-navigate').forEach((link) => {
		link.removeEventListener('click', handleNavigation);
	});
};

// Generic function to handle SPA navigation using axios
function setupSPANavigation() {
	// Select all links with the 'spa-navigate' class
	const links = document.querySelectorAll('a.spa-navigate');

	// Add click event listener to each link
	links.forEach((link) => {
		link.addEventListener('click', function (event) {
			event.preventDefault(); // Prevent the default link behavior

			const url = this.getAttribute('href'); // Get the URL from the href attribute

			// Clear the console before logging new messages
			if (useTimer) {
				console.clear();
			}

			// Start timing if useTimer is true
			let startTime;
			if (useTimer) {
				startTime = performance.now();
			}

			// Start NProgress if useNProgress is true
			if (useNProgress) {
				NProgress.start();
			}

			// Fetch JSON data
			axios
				.get(url, {
					headers: {
						Accept: 'application/json',
						'Cache-Control': 'no-cache',
						Pragma: 'no-cache',
						Expires: '0',
					},
				})
				.then((response) => {
					// Calculate the time taken to fetch the response if useTimer is true
					if (useTimer) {
						const fetchTime = performance.now() - startTime;
						console.log(`Fetched ${url} in ${fetchTime.toFixed(2)} milliseconds`);
					}

					// Start timing for DOM update if useTimer is true
					let domUpdateStartTime;
					if (useTimer) {
						domUpdateStartTime = performance.now();
					}

					const parser = new DOMParser();
					const doc = parser.parseFromString(response.data, 'text/html');
					const newContent = doc.querySelector('#content'); // Ensure this matches your structure

					

					// Log the current and new content for comparison
					// console.log('Current content:', currentContent.innerHTML);
					// console.log('New content:', newContent.innerHTML);

					// Use morphdom to inject the new HTML content
					morphdom(currentContent, newContent);

					// Calculate the time taken to update the DOM if useTimer is true
					if (useTimer) {
						const domUpdateTime = performance.now() - domUpdateStartTime;
						console.log(`Updated DOM in ${domUpdateTime.toFixed(2)} milliseconds`);
					}

					// Push the new URL into the browser's history
					history.pushState(null, '', url);

					// Optionally, log the new URL
					console.log(`Navigated to: ${url}`);
				})
				.catch((error) => {
					console.error('There has been a problem with your axios operation:', error);
				})
				.finally(() => {
					// Complete NProgress after the request is finished (whether successful or not) if useNProgress is true
					if (useNProgress) {
						NProgress.done();
					}
				});
		});
	});
}

// Handle back/forward navigation
window.addEventListener('popstate', function (event) {
	// Clear the console before logging new messages if useTimer is true
	if (useTimer) {
		console.clear();
	}

	// Start timing for fetching the current URL if useTimer is true
	let startTime;
	if (useTimer) {
		startTime = performance.now();
	}

	// Start NProgress if useNProgress is true
	if (useNProgress) {
		NProgress.start();
	}

	// When the user presses back or forward, fetch the content for the current URL
	axios
		.get(location.href)
		.then((response) => {
			// Calculate the time taken to fetch the response if useTimer is true
			if (useTimer) {
				const fetchTime = performance.now() - startTime;
				console.log(`Fetched ${location.href} in ${fetchTime.toFixed(2)} milliseconds`);
			}

			// Start timing for DOM update if useTimer is true
			let domUpdateStartTime;
			if (useTimer) {
				domUpdateStartTime = performance.now();
			}

			// Replace the current body content with the fetched HTML
			const parser = new DOMParser();
			const doc = parser.parseFromString(response.data, 'text/html');
			const newContent = doc.querySelector('#content'); // Ensure this matches your structure
			const currentContent = document.querySelector('#content');

			// Log the current and new content for comparison
			// console.log('Current content before popstate:', currentContent.innerHTML);
			// console.log('New content from popstate:', newContent.innerHTML);

			// Use morphdom to inject the new HTML content
			morphdom(currentContent, newContent);

			// Calculate the time taken to update the DOM if useTimer is true
			if (useTimer) {
				const domUpdateTime = performance.now() - domUpdateStartTime;
				console.log(`Updated DOM in ${domUpdateTime.toFixed(2)} milliseconds`);
			}

			// Optionally, log the new URL
			console.log(`Navigated to: ${location.href}`);
		})
		.catch((error) => {
			console.error('There has been a problem with your axios operation:', error);
		})
		.finally(() => {
			// Complete NProgress after the request is finished (whether successful or not) if useNProgress is true
			if (useNProgress) {
				NProgress.done();
			}
		});
});

// Call the function to set up SPA navigation
document.addEventListener('DOMContentLoaded', function () {
	setupSPANavigation();
});
