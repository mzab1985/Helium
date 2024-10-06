// Iteraion no.: 6

import morphdom from 'https://cdn.skypack.dev/morphdom';

function handleNavigation(event) {
    // Check if the clicked element is a spa-navigate link
    const link = event.target.closest('a.spa-navigate');
    if (!link) return; // Ignore clicks outside spa-navigate links

    event.preventDefault(); // Prevent default link behavior
    const url = link.getAttribute('href'); // Get URL
    fetchURL(url, true); // Fetch the new content and update the history state
}

function fetchURL(url, updateHistory = false) {
    axios
        .get(url, {
            headers: {
                'Accept': 'text/html',
                'Cache-Control': 'no-cache',
				'Pragma': 'no-cache',
				'Expires': '0',
                ' Content-Type': 'application/json',
            },
        })
        .then((response) => {
            const doc = parseHTML(response.data);
            updatePageContent(doc);
            if (updateHistory) {
                updatePushState(url);
            }
        })
        .catch(handleError);
}

function parseHTML(htmlString) {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, 'text/html');
}

function updatePageContent(newDoc) {
    morphdom(document.documentElement, newDoc.documentElement, {
        childrenOnly: true, // Replace only inner content of <html>
    });
}

function updatePushState(url) {
    history.pushState(null, '', url);
}

function handleError(error) {
    console.error('Error during navigation:', error);
}

function handlePopState() {
    fetchURL(location.href);
}

// Attach event listener to the document for handling clicks
document.addEventListener('click', handleNavigation);

// Handle browser back/forward button navigation
window.addEventListener('popstate', handlePopState);
