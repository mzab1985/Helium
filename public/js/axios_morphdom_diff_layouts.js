// Iteraion no.: 5

import morphdom from 'https://cdn.skypack.dev/morphdom';

const useTimer = true; // Set to true to enable timing logs, false to disable

function handleNavigation(event) {
	// Check if the clicked element is a spa-navigate link
	const link = event.target.closest('a.spa-navigate');
	if (!link) return; // Ignore clicks outside spa-navigate links

	event.preventDefault(); // Prevent default link behavior
	const url = link.getAttribute('href'); // Get URL

    // Clear the console before logging new messages
    if (useTimer) {
        console.clear();
    }

    // Start timing if useTimer is true
    let startTime;
    if (useTimer) {
        startTime = performance.now();
    }

	axios
		.get(url, {
			headers: {
				Accept: 'text/html',
				// 'Cache-Control': 'no-cache',
				// Pragma: 'no-cache',
				// Expires: '0',
			},
		})
		.then((response) => {
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

			// Get current and new layout types
			// const currentLayoutType = document.body.getAttribute('data-layout-type');
			// const newLayoutType = doc.body.getAttribute('data-layout-type');

			// If the layout type has changed, replace the entire body and head
			// if (currentLayoutType !== newLayoutType) {
				//1.  These commented out lines will specifically replace the body and head----working
				morphdom(document.querySelector('head'), doc.querySelector('head'));
				morphdom(document.body, doc.body);
                
                // 2. 
                // Update the entire <html> contents (excluding <html> itself)-----working
                // morphdom(document.documentElement, doc.documentElement, {
                //     childrenOnly: true // This option ensures only inner content of <html> is replaced
                // });

                // Calculate the time taken to update the DOM if useTimer is true
                if (useTimer) {
                    const domUpdateTime = performance.now() - domUpdateStartTime;
                    console.log(`Updated DOM in ${domUpdateTime.toFixed(2)} milliseconds`);
                }

				// 3. morphdom will not re-render the common elements such as sidebar, header, so we can still use the below---sometimes duplicates 
                // the new page on top of old page
				// morphdom(document.querySelector('body'), doc.querySelector('body'));
			// } 
            // else {
				// 4. If the layout is the same, just replace the #content section
				// const newContent = doc.querySelector('#content');
				// morphdom(document.querySelector('#content'), newContent);
			// }

			// Push new URL into history
			history.pushState(null, '', url);
		})
		.catch((error) => {
			console.error('Error during navigation:', error);
		});
}

// Attach event listener to the document
document.addEventListener('click', handleNavigation);

// Handle browser back/forward button navigation
window.addEventListener('popstate', function (event) {
	axios
		.get(location.href, {
			headers: {
				Accept: 'text/html',
				'Cache-Control': 'no-cache',
			},
		})
		.then((response) => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(response.data, 'text/html');

			const currentLayoutType = document.body.getAttribute('data-layout-type');
			const newLayoutType = doc.body.getAttribute('data-layout-type');

			if (currentLayoutType !== newLayoutType) {
				morphdom(document.querySelector('head'), doc.querySelector('head'));
				morphdom(document.body, doc.body);
			} else {
				const newContent = doc.querySelector('#content');
				morphdom(document.querySelector('#content'), newContent);
			}
		})
		.catch((error) => {
			console.error('Error during popstate navigation:', error);
		});
});
