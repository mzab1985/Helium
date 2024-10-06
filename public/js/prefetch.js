// Iteraion no.: 2

// Configuration flags
const useNProgress = false; // Set to true to use NProgress, false to disable
const useTimer = true; // Set to true to enable timing logs, false to disable
const contentElement = document.querySelector('.content');

// Cache for preloaded responses
const prefetchCache = new Map();

// Before adding new event listeners, remove old ones
const removeEventListeners = () => {
    document.querySelectorAll('a.spa-navigate').forEach(link => {
        link.removeEventListener('click', handleNavigation);
        link.removeEventListener('mouseenter', handlePrefetch);
    });
};

// Prefetch content when the user hovers over a link
const handlePrefetch = function() {
    const url = this.getAttribute('href');
    
    // If the URL has already been prefetched, do nothing
    if (prefetchCache.has(url)) {
        return;
    }

    // Fetch and cache the response
    axios.get(url, {
        headers: {
            'Accept': 'application/json' // Indicate you're expecting JSON
        }
    })
    .then(response => {
        // Cache the response so it can be used when the link is clicked
        prefetchCache.set(url, response.data);
        console.log(`Prefetched ${url}`);
    })
    .catch(error => {
        console.error(`Error prefetching ${url}:`, error);
    });
};

// Generic function to handle SPA navigation using axios
function setupSPANavigation() {
    // Select all links with the 'spa-navigate' class
    const links = document.querySelectorAll('a.spa-navigate');

    // Add click event listener and hover event listener to each link
    links.forEach(link => {
        // Handle link click
        link.addEventListener('click', function(event) {
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

            // Check if the response is already in the prefetch cache
            if (prefetchCache.has(url)) {
                const responseData = prefetchCache.get(url);

                // Update DOM with the cached response data
                updateDOM(responseData, url, startTime);
            } else {
                // Fetch the new content using Axios if not already prefetched
                axios.get(url, {
                    headers: {
                        'Accept': 'application/json' // Indicate you're expecting JSON
                    }
                })
                .then(response => {
                    // Update DOM with the fetched response data
                    updateDOM(response.data, url, startTime);
                })
                .catch(error => {
                    console.error('There has been a problem with your axios operation:', error);
                })
                .finally(() => {
                    // Complete NProgress after the request is finished
                    if (useNProgress) {
                        NProgress.done();
                    }
                });
            }
        });

        // Handle link hover for prefetching
        link.addEventListener('mouseenter', handlePrefetch);
    });
}

// Function to update the DOM with fetched or cached content
function updateDOM(data, url, startTime) {
    // Start timing for DOM update if useTimer is true
    let domUpdateStartTime;
    if (useTimer) {
        domUpdateStartTime = performance.now();
    }

    // Create a temporary element to parse the response HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;

    // Select the content you want to inject (assuming your content area has a class of 'content')
    const newContent = tempDiv.querySelector('.content').innerHTML;

    // Replace the existing content with the new HTML
    contentElement.innerHTML = newContent;

    // Calculate the time taken to update the DOM if useTimer is true
    if (useTimer) {
        const domUpdateTime = performance.now() - domUpdateStartTime;
        console.log(`Updated DOM in ${domUpdateTime.toFixed(2)} milliseconds`);
    }

    // Push the new URL into the browser's history
    history.pushState(null, '', url);

    // Re-initialize SPA navigation for the new content
    // setupSPANavigation();

    // Log the new URL and fetch time
    if (useTimer) {
        const fetchTime = performance.now() - startTime;
        console.log(`Navigated to: ${url} in ${fetchTime.toFixed(2)} milliseconds`);
    }
}

// Handle back/forward navigation
window.addEventListener('popstate', function(event) {
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
    axios.get(location.href)
        .then(response => {
            // Update DOM with the fetched response data
            updateDOM(response.data, location.href, startTime);
        })
        .catch(error => {
            console.error('There has been a problem with your axios operation:', error);
        })
        .finally(() => {
            // Complete NProgress after the request is finished
            if (useNProgress) {
                NProgress.done();
            }
        });
});

// Call the function to set up SPA navigation
document.addEventListener('DOMContentLoaded', function() {
    setupSPANavigation();
});
